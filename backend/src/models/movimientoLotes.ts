import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { MovimientoLote } from "../types";

export const MovimientoLoteModel = {
  async findByLoteId(loteId: number): Promise<MovimientoLote[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM movimiento_lotes WHERE lote_id = ? ORDER BY fecha DESC`,
      [loteId]
    );
    return rows as MovimientoLote[];
  },

  async create(movimiento: Omit<MovimientoLote, "id" | "fecha">): Promise<number> {
    const [result] = await pool.query(
      `INSERT INTO movimiento_lotes (lote_id, tipo, cantidad, motivo) VALUES (?, ?, ?, ?)`,
      [movimiento.lote_id, movimiento.tipo, movimiento.cantidad, movimiento.motivo || null]
    );
    return (result as any).insertId;
  },

  async getResumen(loteId: number): Promise<{ total_entradas: number; total_salidas: number }> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
         COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN cantidad ELSE 0 END), 0) as total_entradas,
         COALESCE(SUM(CASE WHEN tipo = 'salida' THEN cantidad ELSE 0 END), 0) as total_salidas
       FROM movimiento_lotes WHERE lote_id = ?`,
      [loteId]
    );
    return rows[0] as any;
  },
};
