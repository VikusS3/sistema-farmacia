import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Clientes } from "../types";

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
      [nombre, email, telefono, direccion]
    );
    return result.insertId;
  },

  async update(id: number, cliente: Partial<Clientes>): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE clientes SET ? WHERE id = ?",
      [cliente, id]
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
