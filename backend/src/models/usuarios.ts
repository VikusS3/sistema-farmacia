import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Usuario } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const UsuarioModel = {
  async findAll(): Promise<Usuario[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, nombre, email, rol, estado, creado_en, actualizado_en FROM usuarios"
    );
    return rows as Usuario[];
  },

  async findById(id: number): Promise<Usuario | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, nombre, email, rol, estado, creado_en, actualizado_en FROM usuarios WHERE id = ?",
      [id]
    );
    return rows[0] as Usuario | null;
  },

  async login(
    email: string,
    password: string
  ): Promise<{ usuario: Usuario | null; token: string | null }> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    const usuario = rows[0] as Usuario | null;
    if (!usuario) return { usuario: null, token: null };

    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta) return { usuario: null, token: null };

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return { usuario, token };
  },

  async create(usuario: Usuario): Promise<number> {
    const { nombre, email, password, rol } = usuario;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query<any>(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, rol || "empleado"]
    );

    return result.insertId;
  },

  async update(id: number, usuario: Partial<Usuario>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];
    const allowedFields = ["nombre", "email", "password", "rol"];

    for (const field of allowedFields) {
      if ((usuario as any)[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push((usuario as any)[field]);
      }
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.query<any>(
      `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`,
      values
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
