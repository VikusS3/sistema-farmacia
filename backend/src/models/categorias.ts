import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Categoria } from "../types";
import { PaginationParams, safeSortColumn } from "../utils/pagination";

const CATEGORIAS_UPDATEABLE_FIELDS = ["nombre", "descripcion"];

export const CategoriaModel = {
  async findAll(
    pag?: PaginationParams
  ): Promise<{ data: Categoria[]; total: number }> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (pag?.search) {
      conditions.push("(nombre LIKE ?)");
      params.push(`%${pag.search}%`);
    }

    const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM categorias${where}`,
      params
    );
    const total = (countRows[0] as any).total;

    const sort = safeSortColumn(pag?.sort || "id");
    const order = pag?.order || "ASC";
    const limit = pag?.limit || 10;
    const offset = pag?.offset || 0;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM categorias${where} ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return { data: rows as Categoria[], total };
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
