import pool from "../config/db";
import { Venta, DetalleVenta } from "../types";

export const VentaModel = {
  async create(
    venta: Omit<Venta, "id">,
    detalles: Omit<DetalleVenta, "id" | "venta_id" | "ganancia">[]
  ) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Calcular subtotal total
      let subtotalVenta = 0;
      for (const detalle of detalles) {
        subtotalVenta += detalle.subtotal;
      }

      // Aplicar adicional y descuento en el backend
      const totalVenta =
        subtotalVenta +
        Number(venta.adicional || 0) -
        Number(venta.descuento || 0);

      // Insertar venta
      const [ventaResult] = await connection.query(
        `INSERT INTO ventas (cliente_id, usuario_id, caja_id, fecha,adicional,descuento,metodo_pago,total)
         VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)`,
        [
          venta.cliente_id,
          venta.usuario_id,
          venta.caja_id,
          Number(venta.adicional || 0),
          Number(venta.descuento || 0),
          venta.metodo_pago,
          totalVenta,
        ]
      );
      const ventaId = (ventaResult as any).insertId;

      // Procesar cada detalle
      for (const detalle of detalles) {
        // Leer producto y bloquear la fila
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
        if (detalle.unidad_venta === "blister") {
          cantidadEnMinima *= producto.factor_conversion;
        } else if (detalle.unidad_venta === "caja") {
          cantidadEnMinima *= producto.factor_caja;
        }

        if (cantidadEnMinima <= 0) {
          throw new Error("Cantidad mínima calculada inválida");
        }

        // Calcular ganancia real
        const ganancia =
          (producto.precio_venta - producto.precio_compra) * cantidadEnMinima;

        // Insertar detalle de venta
        await connection.query(
          `INSERT INTO detalle_ventas
           (venta_id, producto_id, cantidad, unidad_venta, precio_unitario, subtotal, ganancia)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            ventaId,
            detalle.producto_id,
            detalle.cantidad,
            detalle.unidad_venta,
            detalle.precio_unitario,
            detalle.subtotal,
            ganancia,
          ]
        );

        // Actualizar stock
        await connection.query(
          `UPDATE productos
           SET stock = stock - ?
           WHERE id = ?`,
          [cantidadEnMinima, detalle.producto_id]
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
