import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { DetalleCompra } from "../types";

export const DetalleCompraModel = {
  async create(detalleCompra: Omit<DetalleCompra, "id">): Promise<number> {
    const {
      compra_id,
      producto_id,
      lote_id,
      tipo_compra,
      cantidad,
      factor_conversion,
      unidades_totales,
      costo_unitario_compra,
      subtotal,
    } = detalleCompra;
    const [result] = await pool.query<any>(
      `INSERT INTO detalle_compras (compra_id, producto_id, lote_id, tipo_compra, cantidad, factor_conversion, unidades_totales, costo_unitario_compra, subtotal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        compra_id,
        producto_id,
        lote_id || null,
        tipo_compra,
        cantidad,
        factor_conversion,
        unidades_totales,
        costo_unitario_compra,
        subtotal,
      ]
    );
    return result.insertId;
  },

  async findByCompraId(compra_id: number): Promise<DetalleCompra[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT dc.*, p.nombre as producto_nombre, l.numero_lote as lote_numero
       FROM detalle_compras dc
       JOIN productos p ON dc.producto_id = p.id
       LEFT JOIN lotes l ON dc.lote_id = l.id
       WHERE dc.compra_id = ?`,
      [compra_id]
    );
    return rows as DetalleCompra[];
  },

  async update(
    id: number,
    detalleCompra: Partial<DetalleCompra>
  ): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE detalle_compras SET ? WHERE id = ?",
      [detalleCompra, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM detalle_compras WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  async deleteByCompraId(compra_id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM detalle_compras WHERE compra_id = ?",
      [compra_id]
    );
    return result.affectedRows > 0;
  },
};
