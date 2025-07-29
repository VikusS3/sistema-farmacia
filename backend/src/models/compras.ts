import pool from "../config/db";
import { Compra, DetalleCompra } from "../types";
import { ProductoModel } from "./productos";

export const CompraModel = {
  async create(
    compra: Omit<Compra, "id">,
    detalles: Omit<DetalleCompra, "id" | "compra_id">[]
  ) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insertar compra
      const [compraResult] = await connection.query(
        `INSERT INTO compras (proveedor_id, usuario_id, fecha, total) VALUES (?, ?, NOW(), ?)`,
        [compra.proveedor_id, compra.usuario_id, compra.total]
      );
      const compraId = (compraResult as any).insertId;

      // Insertar detalles y actualizar stock
      for (const detalle of detalles) {
        await connection.query(
          `INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [
            compraId,
            detalle.producto_id,
            detalle.cantidad,
            detalle.precio_unitario,
            detalle.subtotal,
          ]
        );

        // Actualizar stock usando la lógica de factor de conversión
        const producto = await ProductoModel.findById(detalle.producto_id);
        const cantidadEnUnidadMinima =
          detalle.cantidad * producto!.factor_conversion;

        await connection.query(
          `UPDATE productos SET stock = stock + ? WHERE id = ?`,
          [cantidadEnUnidadMinima, detalle.producto_id]
        );
      }

      await connection.commit();
      return compraId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getAll(): Promise<Compra[]> {
    const [rows] = await pool.query(
      "SELECT * FROM compras ORDER BY fecha DESC"
    );
    return rows as Compra[];
  },

  async getById(id: number): Promise<any> {
    const [rows] = await pool.query(
      `SELECT c.*, p.nombre AS proveedor_nombre, u.nombre AS usuario_nombre
       FROM compras c
       JOIN proveedores p ON c.proveedor_id = p.id
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.id = ?`,
      [id]
    );
    return rows;
  },

  async getDetallesByCompraId(compraId: number): Promise<DetalleCompra[]> {
    const [rows] = await pool.query(
      `SELECT dc.*, pr.nombre AS producto_nombre
       FROM detalle_compras dc
       JOIN productos pr ON dc.producto_id = pr.id
       WHERE dc.compra_id = ?`,
      [compraId]
    );
    return rows as DetalleCompra[];
  },
};
