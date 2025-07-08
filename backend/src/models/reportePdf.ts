import pool from "../config/db";
import { RowDataPacket } from "mysql2";

export const ReportePdfModel = {
  async obtenerVentasPorFecha(desde: string, hasta: string) {
    const [rows] = await pool.query(
      `SELECT * FROM ventas WHERE fecha BETWEEN ? AND ?`,
      [desde, hasta]
    );
    return rows;
  },

  async obtenerVentasPorMes(mes: string, anio: string) {
    const [rows] = await pool.query(
      `SELECT * FROM ventas WHERE MONTH(fecha) = ? AND YEAR(fecha) = ?`,
      [mes, anio]
    );
    return rows;
  },

  async obtenerVentasPorAnio(anio: string) {
    const [rows] = await pool.query(
      `SELECT * FROM ventas WHERE YEAR(fecha) = ?`,
      [anio]
    );
    return rows;
  },
};
