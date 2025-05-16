import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Caja } from "../types";
import { getPeruDateTime } from "../utils/cajaUtils";

export const CajaModel = {
  async findAll(): Promise<Caja[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM cajas order by id desc"
    );
    return rows as Caja[];
  },

  async findById(id: number): Promise<Caja | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM cajas WHERE id = ?",
      [id]
    );
    return rows[0] as Caja | null;
  },

  async abrirCaja(
    data: Omit<Caja, "id" | "fecha_cierre" | "monto_cierre" | "estado">
  ): Promise<{ insertId: number }> {
    const { usuario_id, monto_apertura } = data;
    const fecha_apertura = data.fecha_apertura || getPeruDateTime();

    if (!fecha_apertura) {
      throw new Error("Fecha de apertura es obligatoria");
    }

    const [result] = await pool.query<any>(
      `INSERT INTO cajas (usuario_id, fecha_apertura, monto_apertura, estado)
       VALUES (?, ?, ?, 'abierta')`,
      [usuario_id, fecha_apertura, monto_apertura]
    );

    return { insertId: result.insertId };
  },

  async cerrarCaja(
    id: number,
    fecha_cierre: string,
    monto_cierre: number
  ): Promise<{ affectedRows: number }> {
    const cierre = fecha_cierre || getPeruDateTime();

    const [result] = await pool.query<any>(
      `UPDATE cajas
       SET fecha_cierre = ?, monto_cierre = ?, estado = 'cerrada'
       WHERE id = ? AND estado = 'abierta'`,
      [cierre, monto_cierre, id]
    );

    return { affectedRows: result.affectedRows };
  },

  async findCajaActivaByUser(usuario_id: number): Promise<Caja | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM cajas WHERE usuario_id = ? AND estado = 'abierta' ORDER BY id DESC LIMIT 1",
      [usuario_id]
    );
    return rows[0] as Caja | null;
  },
};
