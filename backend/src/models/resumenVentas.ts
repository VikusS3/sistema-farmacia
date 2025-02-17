import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { ResumenVentas } from "../types";

export const ResumenVentasModel = {
  async findAll(): Promise<ResumenVentas[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM resumen_ventas"
    );
    return rows as ResumenVentas[];
  },

  async findById(id: number): Promise<ResumenVentas | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM resumen_ventas WHERE id = ?",
      [id]
    );
    return rows[0] as ResumenVentas | null;
  },
};
