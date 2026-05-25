import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Venta, DetalleVenta, Producto, UnidadVenta } from "../types";
import { ProductoModel } from "./productos";
import { InventarioModel } from "./inventario";

export const VentaModel = {
  async create(
    venta: Omit<Venta, "id">,
    detalles: {
      producto_id: number;
      cantidad: number;
      unidad_venta: UnidadVenta;
      subtotal: number;
    }[],
  ): Promise<number> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const subtotalVenta = detalles.reduce(
        (sum, d) => sum + (d.subtotal || 0),
        0,
      );
      const totalVenta =
        subtotalVenta +
        Number(venta.adicional || 0) -
        Number(venta.descuento || 0);

      const [ventaResult] = await connection.query(
        `INSERT INTO ventas (
          cliente_id, usuario_id, caja_id, fecha, adicional, descuento, metodo_pago, total
        ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)`,
        [
          venta.cliente_id,
          venta.usuario_id,
          venta.caja_id,
          Number(venta.adicional || 0),
          Number(venta.descuento || 0),
          venta.metodo_pago,
          totalVenta,
        ],
      );

      const ventaId = (ventaResult as any).insertId;

      for (const detalle of detalles) {
        const [productoRows] = (await connection.query(
          `SELECT * FROM productos WHERE id = ? FOR UPDATE`,
          [detalle.producto_id],
        )) as [any[], any];

        const producto = productoRows[0] as Producto;

        if (!producto) {
          throw new Error(`Producto ID ${detalle.producto_id} no encontrado`);
        }

        const precioUnitario = ProductoModel.calculatePrice(
          producto,
          detalle.unidad_venta,
        );
        const subtotal = precioUnitario * detalle.cantidad;

        const cantidadBase = ProductoModel.convertToBaseUnits(
          detalle.cantidad,
          detalle.unidad_venta,
          producto,
        );

        const costoBase = producto.precio_compra * cantidadBase;
        const ganancia = subtotal - costoBase;

        await connection.query(
          `INSERT INTO detalle_ventas
            (venta_id, producto_id, cantidad, unidad_venta, precio_unitario, subtotal, ganancia)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            ventaId,
            detalle.producto_id,
            detalle.cantidad,
            detalle.unidad_venta,
            precioUnitario,
            subtotal,
            ganancia,
          ],
        );

        await connection.query(
          `UPDATE productos SET stock = stock - ? WHERE id = ?`,
          [cantidadBase, detalle.producto_id],
        );

        if (producto.require_lote) {
          await ProductoModel.consumeLote(
            detalle.producto_id,
            cantidadBase,
            connection,
          );
        }
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
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT v.*, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre
       FROM ventas v
       LEFT JOIN clientes c ON v.cliente_id = c.id
       JOIN usuarios u ON v.usuario_id = u.id
       ORDER BY v.fecha DESC, v.id DESC`,
    );
    return rows as Venta[];
  },

  async getById(id: number): Promise<any> {
    const [ventaRows] = await pool.query<RowDataPacket[]>(
      `SELECT v.*, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre,
              ca.monto_apertura as caja_apertura
       FROM ventas v
       LEFT JOIN clientes c ON v.cliente_id = c.id
       JOIN usuarios u ON v.usuario_id = u.id
       LEFT JOIN cajas ca ON v.caja_id = ca.id
       WHERE v.id = ?`,
      [id],
    );

    if (!Array.isArray(ventaRows) || ventaRows.length === 0) {
      return null;
    }

    const [productos] = await pool.query<RowDataPacket[]>(
      `SELECT 
        dv.id,
        dv.producto_id,
        p.nombre AS producto_nombre,
        dv.cantidad,
        dv.unidad_venta,
        dv.precio_unitario,
        dv.subtotal,
        dv.ganancia
       FROM detalle_ventas dv
       JOIN productos p ON dv.producto_id = p.id
       WHERE dv.venta_id = ?`,
      [id],
    );

    return {
      ...ventaRows[0],
      productos: Array.isArray(productos) ? productos : [],
    };
  },

  async getVentaConProductosById(id: number): Promise<any> {
    const [ventaRows] = await pool.query<RowDataPacket[]>(
      `SELECT v.*, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre
       FROM ventas v
       LEFT JOIN clientes c ON v.cliente_id = c.id
       JOIN usuarios u ON v.usuario_id = u.id
       WHERE v.id = ?`,
      [id],
    );

    if (!Array.isArray(ventaRows) || ventaRows.length === 0) {
      return null;
    }

    const [detalleRows] = await pool.query<RowDataPacket[]>(
      `SELECT dv.*, p.nombre AS producto_nombre
       FROM detalle_ventas dv
       JOIN productos p ON dv.producto_id = p.id
       WHERE dv.venta_id = ?`,
      [id],
    );

    return {
      venta: ventaRows[0],
      productos: detalleRows,
    };
  },

  async getVentasByDateRange(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<Venta[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT v.*, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre
       FROM ventas v
       LEFT JOIN clientes c ON v.cliente_id = c.id
       JOIN usuarios u ON v.usuario_id = u.id
       WHERE DATE(v.fecha) BETWEEN ? AND ?
       ORDER BY v.fecha DESC`,
      [fechaInicio, fechaFin],
    );
    return rows as Venta[];
  },

  async getVentasPorUsuario(usuario_id: number): Promise<Venta[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT v.*, c.nombre AS cliente_nombre
       FROM ventas v
       LEFT JOIN clientes c ON v.cliente_id = c.id
       WHERE v.usuario_id = ?
       ORDER BY v.fecha DESC`,
      [usuario_id],
    );
    return rows as Venta[];
  },

  async getVentasPorCliente(cliente_id: number): Promise<Venta[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT v.*, u.nombre AS usuario_nombre
       FROM ventas v
       JOIN usuarios u ON v.usuario_id = u.id
       WHERE v.cliente_id = ?
       ORDER BY v.fecha DESC`,
      [cliente_id],
    );
    return rows as Venta[];
  },

  async getEstadisticasVenta(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<{
    total_ventas: number;
    total_articulos: number;
    promedio_venta: number;
    ganancia_total: number;
  }> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
         COALESCE(SUM(v.total), 0) as total_ventas,
         COUNT(*) as num_ventas,
         COALESCE(SUM(dv.cantidad), 0) as total_articulos,
         COALESCE(SUM(dv.ganancia), 0) as ganancia_total
       FROM ventas v
       LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
       WHERE DATE(v.fecha) BETWEEN ? AND ?`,
      [fechaInicio, fechaFin],
    );

    const row = rows[0] as any;
    return {
      total_ventas: parseFloat(row.total_ventas || 0),
      total_articulos: parseInt(row.total_articulos || 0),
      promedio_venta:
        row.num_ventas > 0 ? parseFloat(row.total_ventas) / row.num_ventas : 0,
      ganancia_total: parseFloat(row.ganancia_total || 0),
    };
  },

  async cancelVenta(venta_id: number, usuario_id: number): Promise<void> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [ventaRows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM ventas WHERE id = ?`,
        [venta_id],
      );

      if (ventaRows.length === 0) {
        throw new Error("Venta no encontrada");
      }

      const venta = ventaRows[0] as Venta;

      if (venta.estado === "cancelada") {
        throw new Error("La venta ya ha sido cancelada");
      }

      const [detalles] = await connection.query<RowDataPacket[]>(
        `SELECT dv.*, p.require_lote
         FROM detalle_ventas dv
         JOIN productos p ON dv.producto_id = p.id
         WHERE dv.venta_id = ?`,
        [venta_id],
      );

      for (const detalle of detalles as any[]) {
        const cantidadBase = detalle.cantidad;

        await connection.query(
          `UPDATE productos SET stock = stock + ? WHERE id = ?`,
          [cantidadBase, detalle.producto_id],
        );

        if (detalle.require_lote) {
          await ProductoModel.returnToLote(
            detalle.producto_id,
            cantidadBase,
            connection,
          );
        }

        await InventarioModel.registrarMovimiento(
          {
            producto_id: detalle.producto_id,
            movimiento: "ajuste",
            cantidad: cantidadBase,
            motivo: `Cancelación de venta #${venta_id}`,
            fecha_movimiento: new Date().toISOString().split("T")[0],
          },
          connection,
        );
      }

      await connection.query(
        `UPDATE ventas SET estado = 'cancelada', total = 0 WHERE id = ?`,
        [venta_id],
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};
