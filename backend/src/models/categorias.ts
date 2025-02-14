import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Categoria } from "../types";

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
    const [result] = await pool.query<any>(
      "UPDATE categorias SET ? WHERE id = ?",
      [categoria, id]
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
