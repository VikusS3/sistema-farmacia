import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Proovedor } from "../types";

export const ProovedoresModel = {
  async findAll(): Promise<Proovedor[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM proveedores"
    );
    return rows as Proovedor[];
  },

  async findById(id: number): Promise<Proovedor | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM proveedores WHERE id = ?",
      [id]
    );
    return rows[0] as Proovedor | null;
  },

  async create(proovedor: Proovedor): Promise<number> {
    const { nombre, ruc, telefono, direccion } = proovedor;
    const [result] = await pool.query<any>(
      "INSERT INTO proveedores (nombre, ruc, telefono, direccion) VALUES (?, ?, ?, ?)",
      [nombre, ruc, telefono, direccion]
    );
    return result.insertId;
  },

  async update(id: number, proovedor: Partial<Proovedor>): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE proveedores SET ? WHERE id = ?",
      [proovedor, id]
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
