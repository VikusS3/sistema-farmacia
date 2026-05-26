import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { DetalleVenta } from "../types";

export const DetalleVentaModel = {
  async create(detalleVenta: Omit<DetalleVenta, "id">): Promise<number> {
    const {
      venta_id,
      producto_id,
      lote_id,
      unidad_venta,
      cantidad,
      unidades_base,
      precio_unitario,
      costo_real_unitario,
      descuento,
      adicional,
      subtotal,
      ganancia,
    } = detalleVenta;
    const [result] = await pool.query<any>(
      `INSERT INTO detalle_ventas (venta_id, producto_id, lote_id, unidad_venta, cantidad, unidades_base, precio_unitario, costo_real_unitario, descuento, adicional, subtotal, ganancia)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        venta_id,
        producto_id,
        lote_id || null,
        unidad_venta,
        cantidad,
        unidades_base,
        precio_unitario,
        costo_real_unitario,
        descuento,
        adicional,
        subtotal,
        ganancia,
      ]
    );
    return result.insertId;
  },

  async findByVentaId(venta_id: number): Promise<DetalleVenta[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT dv.*, p.nombre as producto_nombre, l.numero_lote as lote_numero
       FROM detalle_ventas dv
       JOIN productos p ON dv.producto_id = p.id
       LEFT JOIN lotes l ON dv.lote_id = l.id
       WHERE dv.venta_id = ?`,
      [venta_id]
    );
    return rows as DetalleVenta[];
  },

  async update(
    id: number,
    detalleVenta: Partial<DetalleVenta>
  ): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE detalle_ventas SET ? WHERE id = ?",
      [detalleVenta, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM detalle_ventas WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  async deleteByVentaId(venta_id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM detalle_ventas WHERE venta_id = ?",
      [venta_id]
    );
    return result.affectedRows > 0;
  },
};
