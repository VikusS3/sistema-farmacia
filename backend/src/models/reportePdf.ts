import pool from "../config/db";
import { RowDataPacket } from "mysql2";

export const ReportePdfModel = {
  async obtenerVentasPorFecha(desde: string, hasta: string) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        v.id,
        v.fecha,
        v.total,
        v.descuento,
        v.adicional,
        v.metodo_pago,
        c.nombre AS cliente_nombre,
        u.nombre AS usuario_nombre
      FROM ventas v
      INNER JOIN clientes c ON v.cliente_id = c.id
      INNER JOIN usuarios u ON v.usuario_id = u.id
      WHERE fecha BETWEEN ? AND ?`,
      [desde, hasta]
    );
    return rows;
  },

  async obtenerVentasPorMes(mes: string, anio: string) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        v.id,
        v.fecha,
        v.total,
        v.descuento,
        v.adicional,
        v.metodo_pago,
        c.nombre AS cliente_nombre,
        u.nombre AS usuario_nombre
      FROM ventas v
      INNER JOIN clientes c ON v.cliente_id = c.id
      INNER JOIN usuarios u ON v.usuario_id = u.id
      WHERE MONTH(fecha) = ? AND YEAR(fecha) = ?`,
      [mes, anio]
    );
    return rows;
  },

  async obtenerVentasPorAnio(anio: string) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        v.id,
        v.fecha,
        v.total,
        v.descuento,
        v.adicional,
        v.metodo_pago,
        c.nombre AS cliente_nombre,
        u.nombre AS usuario_nombre
      FROM ventas v
      INNER JOIN clientes c ON v.cliente_id = c.id
      INNER JOIN usuarios u ON v.usuario_id = u.id
      WHERE YEAR(fecha) = ?`,
      [anio]
    );
    return rows;
  },

  async controlInventario() {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        p.id,
        p.nombre,
        p.stock,
        p.stock_minimo,
        p.unidad_medida,
        p.precio_unidad,
        p.precio_blister,
        p.precio_caja,
        l.fecha_vencimiento,
        l.numero_lote,
        l.cantidad_disponible
      FROM productos p
      LEFT JOIN lotes l ON l.producto_id = p.id AND l.estado = 'activo'
      ORDER BY p.nombre, l.fecha_vencimiento`
    );
    return rows;
  },
};
