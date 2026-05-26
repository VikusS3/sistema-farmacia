import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import { Compra, DetalleCompra, Producto, UnidadVenta } from "../types";
import { ProductoModel } from "./productos";

export const CompraModel = {
  async create(
    compra: Omit<Compra, "id">,
    detalles: Omit<DetalleCompra, "id" | "compra_id">[]
  ) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [compraResult] = await connection.query(
        `INSERT INTO compras (proveedor_id, usuario_id, caja_id, fecha, subtotal, descuento, total, observaciones)
         VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)`,
        [
          compra.proveedor_id,
          compra.usuario_id,
          compra.caja_id || null,
          compra.subtotal || compra.total,
          compra.descuento || 0,
          compra.total,
          compra.observaciones || null,
        ]
      );
      const compraId = (compraResult as any).insertId;

      for (const detalle of detalles) {
        const [rows] = await connection.query(
          `SELECT * FROM productos WHERE id = ? FOR UPDATE`,
          [detalle.producto_id]
        );
        const producto: any = (rows as any)[0];

        if (!producto) {
          throw new Error(`Producto ID ${detalle.producto_id} no encontrado`);
        }

        const unidadesPorBlister = producto.unidades_por_blister ?? 1;
        const blistersPorCaja = producto.blisters_por_caja ?? 1;

        let factorConversion = 1;
        if (detalle.tipo_compra === "blister") {
          factorConversion = unidadesPorBlister;
        } else if (detalle.tipo_compra === "caja") {
          factorConversion = unidadesPorBlister * blistersPorCaja;
        }

        const unidadesTotales = detalle.cantidad * factorConversion;
        const costoUnitarioCompra = detalle.subtotal > 0 && unidadesTotales > 0
          ? detalle.subtotal / unidadesTotales
          : 0;

        let loteId: number | null = null;

        if (producto.require_lote && detalle.numero_lote && detalle.fecha_vencimiento) {
          loteId = await ProductoModel.createLote({
            producto_id: detalle.producto_id,
            compra_id: compraId,
            numero_lote: detalle.numero_lote,
            fecha_vencimiento: detalle.fecha_vencimiento,
            cantidad_inicial: unidadesTotales,
            cantidad_disponible: unidadesTotales,
            costo_unitario: costoUnitarioCompra,
          });

          await connection.query(
            `INSERT INTO movimiento_lotes (lote_id, tipo, cantidad, motivo) VALUES (?, 'entrada', ?, ?)`,
            [loteId, unidadesTotales, `Compra #${compraId}`]
          );
        }

        await connection.query(
          `INSERT INTO detalle_compras
           (compra_id, producto_id, lote_id, tipo_compra, cantidad, factor_conversion, unidades_totales, costo_unitario_compra, subtotal)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            compraId,
            detalle.producto_id,
            loteId,
            detalle.tipo_compra,
            detalle.cantidad,
            factorConversion,
            unidadesTotales,
            costoUnitarioCompra,
            detalle.subtotal,
          ]
        );

        const [stockRow] = await connection.query<RowDataPacket[]>(
          `SELECT stock FROM productos WHERE id = ?`,
          [detalle.producto_id]
        );
        const stockAnterior = stockRow.length > 0 ? Number(stockRow[0].stock) : 0;
        const stockNuevo = stockAnterior + unidadesTotales;

        await connection.query(
          `UPDATE productos SET stock = stock + ? WHERE id = ?`,
          [unidadesTotales, detalle.producto_id]
        );

        await connection.query(
          `INSERT INTO inventario
            (producto_id, lote_id, usuario_id, movimiento, tipo_referencia, referencia_id,
             cantidad, stock_anterior, stock_nuevo, motivo, fecha_movimiento)
           VALUES (?, ?, ?, 'compra', 'compra', ?, ?, ?, ?, ?, NOW())`,
          [
            detalle.producto_id,
            loteId,
            compra.usuario_id,
            compraId,
            unidadesTotales,
            stockAnterior,
            stockNuevo,
            `Compra #${compraId}`,
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
      `SELECT c.*, p.nombre AS proveedor_nombre
       FROM compras c
       JOIN proveedores p ON c.proveedor_id = p.id
       ORDER BY c.fecha DESC`
    );
    return rows as Compra[];
  },

  async getById(id: number): Promise<any> {
    const [compraRows] = await pool.query<RowDataPacket[]>(
      `SELECT c.*, p.nombre AS proveedor_nombre, u.nombre AS usuario_nombre
       FROM compras c
       JOIN proveedores p ON c.proveedor_id = p.id
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.id = ?`,
      [id]
    );

    if (compraRows.length === 0) return null;

    const [detalleRows] = await pool.query<RowDataPacket[]>(
      `SELECT dc.*, pr.nombre AS producto_nombre, l.numero_lote
       FROM detalle_compras dc
       JOIN productos pr ON dc.producto_id = pr.id
       LEFT JOIN lotes l ON dc.lote_id = l.id
       WHERE dc.compra_id = ?`,
      [id]
    );

    return {
      ...compraRows[0],
      detalles: detalleRows,
    };
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
