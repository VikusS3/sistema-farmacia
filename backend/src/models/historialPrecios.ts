import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { HistorialPrecio } from "../types";

export const HistorialPrecioModel = {
  async findByProductoId(productoId: number): Promise<HistorialPrecio[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM historial_precios WHERE producto_id = ? ORDER BY fecha_cambio DESC`,
      [productoId]
    );
    return rows as HistorialPrecio[];
  },

  async create(
    registro: Omit<HistorialPrecio, "id" | "fecha_cambio">
  ): Promise<number> {
    const [result] = await pool.query(
      `INSERT INTO historial_precios (producto_id, tipo_precio, precio_anterior, precio_nuevo)
       VALUES (?, ?, ?, ?)`,
      [
        registro.producto_id,
        registro.tipo_precio,
        registro.precio_anterior,
        registro.precio_nuevo,
      ]
    );
    return (result as any).insertId;
  },
};
