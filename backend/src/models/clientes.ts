import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Clientes } from "../types";

const CLIENTES_UPDATEABLE_FIELDS = ["nombre", "email", "telefono", "direccion"];

export const ClientesModel = {
  async findAll(): Promise<Clientes[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM clientes");
    return rows as Clientes[];
  },

  async findById(id: number): Promise<Clientes | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM clientes WHERE id = ?",
      [id]
    );
    return rows[0] as Clientes | null;
  },

  async create(cliente: Clientes): Promise<number> {
    const { nombre, email, telefono, direccion } = cliente;
    const [result] = await pool.query<any>(
      "INSERT INTO clientes (nombre, email, telefono, direccion) VALUES (?, ?, ?, ?)",
      [nombre, email || null, telefono || null, direccion || null]
    );
    return result.insertId;
  },

  async update(id: number, cliente: Partial<Clientes>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    for (const field of CLIENTES_UPDATEABLE_FIELDS) {
      if ((cliente as any)[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push((cliente as any)[field]);
      }
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.query<any>(
      `UPDATE clientes SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM clientes WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
