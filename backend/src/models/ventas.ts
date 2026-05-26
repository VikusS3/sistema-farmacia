import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Venta, DetalleVenta, Producto, UnidadVenta } from "../types";
import { ProductoModel } from "./productos";

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
          cliente_id, usuario_id, caja_id, fecha, subtotal, descuento, adicional, metodo_pago, total
        ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)`,
        [
          venta.cliente_id,
          venta.usuario_id,
          venta.caja_id,
          subtotalVenta,
          Number(venta.descuento || 0),
          Number(venta.adicional || 0),
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

        const unidadesBase = ProductoModel.convertToBaseUnits(
          detalle.cantidad,
          detalle.unidad_venta,
          producto,
        );

        let costoRealUnitario = 0;
        let loteId: number | null = null;

        if (producto.require_lote) {
          costoRealUnitario = await ProductoModel.getCostoUnitarioLote(detalle.producto_id);
          const [loteRows] = await connection.query<RowDataPacket[]>(
            `SELECT id FROM lotes
             WHERE producto_id = ? AND cantidad_disponible > 0
             ORDER BY fecha_vencimiento ASC LIMIT 1`,
            [detalle.producto_id]
          );
          if (loteRows.length > 0) {
            loteId = loteRows[0].id;
          }
        }

        const costoTotal = costoRealUnitario * unidadesBase;
        const ganancia = subtotal - costoTotal;

        await connection.query(
          `INSERT INTO detalle_ventas
            (venta_id, producto_id, lote_id, unidad_venta, cantidad, unidades_base,
             precio_unitario, costo_real_unitario, descuento, adicional, subtotal, ganancia)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ventaId,
            detalle.producto_id,
            loteId,
            detalle.unidad_venta,
            detalle.cantidad,
            unidadesBase,
            precioUnitario,
            costoRealUnitario,
            0,
            0,
            subtotal,
            ganancia,
          ],
        );

        await connection.query(
          `UPDATE productos SET stock = stock - ? WHERE id = ?`,
          [unidadesBase, detalle.producto_id],
        );

        const [stockRow] = await connection.query<RowDataPacket[]>(
          `SELECT stock FROM productos WHERE id = ?`,
          [detalle.producto_id]
        );
        const stockNuevo = stockRow.length > 0 ? Number(stockRow[0].stock) : 0;
        const stockAnterior = stockNuevo + unidadesBase;

        await connection.query(
          `INSERT INTO inventario
            (producto_id, lote_id, usuario_id, movimiento, tipo_referencia, referencia_id,
             cantidad, stock_anterior, stock_nuevo, motivo, fecha_movimiento)
           VALUES (?, ?, ?, 'venta', 'venta', ?, ?, ?, ?, ?, NOW())`,
          [
            detalle.producto_id,
            loteId,
            venta.usuario_id,
            ventaId,
            -unidadesBase,
            stockAnterior,
            stockNuevo,
            `Venta #${ventaId}`,
          ]
        );

        if (producto.require_lote) {
          await ProductoModel.consumeLote(
            detalle.producto_id,
            unidadesBase,
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
        dv.id, dv.producto_id, p.nombre AS producto_nombre,
        dv.lote_id, dv.unidad_venta, dv.cantidad, dv.unidades_base,
        dv.precio_unitario, dv.costo_real_unitario,
        dv.descuento, dv.adicional, dv.subtotal, dv.ganancia
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
        const unidadesBase = detalle.unidades_base || detalle.cantidad;

        await connection.query(
          `UPDATE productos SET stock = stock + ? WHERE id = ?`,
          [unidadesBase, detalle.producto_id],
        );

        const [stockRow] = await connection.query<RowDataPacket[]>(
          `SELECT stock FROM productos WHERE id = ?`,
          [detalle.producto_id]
        );
        const stockNuevo = stockRow.length > 0 ? Number(stockRow[0].stock) : 0;
        const stockAnterior = stockNuevo - unidadesBase;

        await connection.query(
          `INSERT INTO inventario
            (producto_id, lote_id, usuario_id, movimiento, tipo_referencia, referencia_id,
             cantidad, stock_anterior, stock_nuevo, motivo, fecha_movimiento)
           VALUES (?, ?, ?, 'devolucion', 'venta', ?, ?, ?, ?, ?, NOW())`,
          [
            detalle.producto_id,
            detalle.lote_id || null,
            usuario_id,
            venta_id,
            unidadesBase,
            stockAnterior,
            stockNuevo,
            `Cancelación de venta #${venta_id}`,
          ]
        );

        if (detalle.require_lote) {
          await ProductoModel.returnToLote(
            detalle.producto_id,
            unidadesBase,
            connection,
          );
        }
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
