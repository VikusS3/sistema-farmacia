import pool from "../config/db";
import { Compra, DetalleCompra } from "../types";

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
        `INSERT INTO compras (proveedor_id, usuario_id, fecha, total)
         VALUES (?, ?, NOW(), ?)`,
        [compra.proveedor_id, compra.usuario_id, compra.total]
      );
      const compraId = (compraResult as any).insertId;

      // Procesar cada detalle
      for (const detalle of detalles) {
        // Obtener producto usando la misma conexión
        const [rows] = await connection.query(
          `SELECT * FROM productos WHERE id = ? FOR UPDATE`,
          [detalle.producto_id]
        );
        const producto: any = (rows as any)[0];

        if (!producto) {
          throw new Error(`Producto ID ${detalle.producto_id} no encontrado`);
        }

        // Calcular cantidad en unidades mínimas
        let cantidadEnMinima = detalle.cantidad;
        if (detalle.unidad_compra === "blister") {
          cantidadEnMinima *= producto.factor_conversion;
        } else if (detalle.unidad_compra === "caja" && producto.factor_caja) {
          cantidadEnMinima *= producto.factor_caja;
        }

        if (cantidadEnMinima <= 0) {
          throw new Error("Cantidad mínima calculada inválida");
        }

        // Calcular nuevo precio_compra y ganancia
        const nuevoPrecioCompra = detalle.precio_unitario / cantidadEnMinima;
        const nuevaGanancia = producto.precio_venta - nuevoPrecioCompra;

        // Insertar detalle de compra usando la misma conexión
        await connection.query(
          `INSERT INTO detalle_compras
           (compra_id, producto_id, cantidad, unidad_compra, precio_unitario, subtotal)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            compraId,
            detalle.producto_id,
            detalle.cantidad,
            detalle.unidad_compra,
            detalle.precio_unitario,
            detalle.subtotal,
          ]
        );

        // Actualizar stock y precios del producto
        await connection.query(
          `UPDATE productos
           SET stock = stock + ?,
               precio_compra = ?,
               ganancia = ?
           WHERE id = ?`,
          [
            cantidadEnMinima,
            nuevoPrecioCompra,
            nuevaGanancia,
            detalle.producto_id,
          ]
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
