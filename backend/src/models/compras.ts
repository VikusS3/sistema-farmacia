import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Compras } from "../types";

export const ComprasModel = {
  async findAll(): Promise<Compras[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM compras");
    return rows as Compras[];
  },

  async findById(id: number): Promise<Compras | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM compras WHERE id = ?",
      [id]
    );
    return rows[0] as Compras | null;
  },

  async create(compra: Compras): Promise<number> {
    const { proveedor_id, usuario_id, fecha, total } = compra;
    const [result] = await pool.query<any>(
      "INSERT INTO compras (proveedor_id, usuario_id, fecha, total) VALUES (?, ?, ?, ?)",
      [proveedor_id, usuario_id, fecha, total]
    );
    return result.insertId;
  },

  async update(id: number, compra: Partial<Compras>): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE compras SET ? WHERE id = ?",
      [compra, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>("DELETE FROM compras WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },
};
