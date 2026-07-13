import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Proveedor } from "../types";
import { PaginationParams, safeSortColumn } from "../utils/pagination";

const PROVEEDORES_UPDATEABLE_FIELDS = ["nombre", "email", "telefono", "direccion"];

export const ProveedoresModel = {
  async findAll(
    pag?: PaginationParams
  ): Promise<{ data: Proveedor[]; total: number }> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (pag?.search) {
      conditions.push("(nombre LIKE ? OR email LIKE ? OR telefono LIKE ?)");
      params.push(`%${pag.search}%`, `%${pag.search}%`, `%${pag.search}%`);
    }

    const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM proveedores${where}`,
      params
    );
    const total = (countRows[0] as any).total;

    const sort = safeSortColumn(pag?.sort || "id");
    const order = pag?.order || "ASC";
    const limit = pag?.limit || 10;
    const offset = pag?.offset || 0;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM proveedores${where} ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return { data: rows as Proveedor[], total };
  },

  async findById(id: number): Promise<Proveedor | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM proveedores WHERE id = ?",
      [id]
    );
    return rows[0] as Proveedor | null;
  },

  async create(proveedor: Proveedor): Promise<number> {
    const { nombre, email, telefono, direccion } = proveedor;
    const [result] = await pool.query<any>(
      "INSERT INTO proveedores (nombre, email, telefono, direccion) VALUES (?, ?, ?, ?)",
      [nombre, email || null, telefono || null, direccion || null]
    );
    return result.insertId;
  },

  async update(id: number, proveedor: Partial<Proveedor>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    for (const field of PROVEEDORES_UPDATEABLE_FIELDS) {
      if ((proveedor as any)[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push((proveedor as any)[field]);
      }
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.query<any>(
      `UPDATE proveedores SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM proveedores WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
