import pool from "../config/db";
import { Venta, DetalleVenta } from "../types";
import { ProductoModel } from "./productos";

export const VentaModel = {
  async create(
    venta: Omit<Venta, "id">,
    detalles: Omit<DetalleVenta, "id" | "venta_id">[]
  ) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [ventaResult] = await connection.query(
        `INSERT INTO ventas (cliente_id, usuario_id, caja_id, fecha, total)
         VALUES (?, ?, ?, NOW(), ?)`,
        [venta.cliente_id, venta.usuario_id, venta.caja_id, venta.total]
      );
      const ventaId = (ventaResult as any).insertId;

      for (const detalle of detalles) {
        await connection.query(
          `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [
            ventaId,
            detalle.producto_id,
            detalle.cantidad,
            detalle.precio_unitario,
            detalle.subtotal,
          ]
        );

        // Descontar del stock (en unidad mínima)
        await ProductoModel.updateStockVenta(
          detalle.producto_id,
          detalle.cantidad,
          connection
        );
      }

      await connection.commit();
      return ventaId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getAll(): Promise<Venta[]> {
    const [rows] = await pool.query("SELECT * FROM ventas ORDER BY fecha DESC");
    return rows as Venta[];
  },

  async getById(id: number): Promise<any> {
    const [rows] = await pool.query(
      `SELECT v.*, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre
       FROM ventas v
       JOIN clientes c ON v.cliente_id = c.id
       JOIN usuarios u ON v.usuario_id = u.id
       WHERE v.id = ?`,
      [id]
    );
    return rows;
  },

  async getDetallesByVentaId(ventaId: number): Promise<DetalleVenta[]> {
    const [rows] = await pool.query(
      `SELECT dv.*, p.nombre AS producto_nombre
       FROM detalle_ventas dv
       JOIN productos p ON dv.producto_id = p.id
       WHERE dv.venta_id = ?`,
      [ventaId]
    );
    return rows as DetalleVenta[];
  },
};
