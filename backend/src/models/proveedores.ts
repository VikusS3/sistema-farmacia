import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Proveedor } from "../types";

const PROVEEDORES_UPDATEABLE_FIELDS = ["nombre", "email", "telefono", "direccion"];

export const ProveedoresModel = {
  async findAll(): Promise<Proveedor[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM proveedores"
    );
    return rows as Proveedor[];
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
