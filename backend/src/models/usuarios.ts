import pool from "../config/db";
import { RowDataPacket } from "mysql2";

export type Usuario = {
  id?: number;
  nombres: string;
  email: string;
  password: string;
  rol?: "admin" | "empleado";
  creado_en?: Date;
  actualizado_en?: Date;
};

export const UsuarioModel = {
  async findAll(): Promise<Usuario[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM usuarios");
    return rows as Usuario[];
  },

  async findById(id: number): Promise<Usuario | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );
    return rows[0] as Usuario | null;
  },

  async create(usuario: Usuario): Promise<number> {
    const { nombres, email, password, rol } = usuario;
    const [result] = await pool.query<any>(
      "INSERT INTO usuarios (nombres, email, password, rol) VALUES (?, ?, ?, ?)",
      [nombres, email, password, rol || "empleado"]
    );
    return result.insertId;
  },

  async update(id: number, usuario: Partial<Usuario>): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE usuarios SET ? WHERE id = ?",
      [usuario, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM usuarios WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
