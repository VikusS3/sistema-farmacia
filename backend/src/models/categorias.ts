import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Categoria } from "../types";

const CATEGORIAS_UPDATEABLE_FIELDS = ["nombre", "descripcion"];

export const CategoriaModel = {
  async findAll(): Promise<Categoria[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM categorias"
    );
    return rows as Categoria[];
  },

  async findById(id: number): Promise<Categoria | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM categorias WHERE id = ?",
      [id]
    );
    return rows[0] as Categoria | null;
  },

  async create(categoria: Categoria): Promise<number> {
    const { nombre, descripcion } = categoria;
    const [result] = await pool.query<any>(
      "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion]
    );
    return result.insertId;
  },

  async update(id: number, categoria: Partial<Categoria>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    for (const field of CATEGORIAS_UPDATEABLE_FIELDS) {
      if ((categoria as any)[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push((categoria as any)[field]);
      }
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.query<any>(
      `UPDATE categorias SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM categorias WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
