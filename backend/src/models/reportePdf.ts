import pool from "../config/db";

export const ReportePdfModel = {
  async obtenerVentasPorFecha(desde: string, hasta: string) {
    const [rows] = await pool.query(
      `SELECT 
        v.id,
        v.fecha,
        v.total,
        v.descuento,
        v.adicional,
        v.metodo_pago,
        c.nombre AS cliente_nombre,
        u.nombres AS usuario_nombre
      FROM ventas v
      INNER JOIN clientes c ON v.cliente_id = c.id
      INNER JOIN usuarios u ON v.usuario_id = u.id
      WHERE fecha BETWEEN ? AND ?`,
      [desde, hasta]
    );
    return rows;
  },

  async obtenerVentasPorMes(mes: string, anio: string) {
    const [rows] = await pool.query(
      `SELECT 
        v.id,
        v.fecha,
        v.total,
        v.descuento,
        v.adicional,
        v.metodo_pago,
        c.nombre AS cliente_nombre,
        u.nombres AS usuario_nombre
      FROM ventas v
      INNER JOIN clientes c ON v.cliente_id = c.id
      INNER JOIN usuarios u ON v.usuario_id = u.id
      WHERE MONTH(fecha) = ? AND YEAR(fecha) = ?`,
      [mes, anio]
    );
    return rows;
  },

  async obtenerVentasPorAnio(anio: string) {
    const [rows] = await pool.query(
      `SELECT 
        v.id,
        v.fecha,
        v.total,
        v.descuento,
        v.adicional,
        v.metodo_pago,
        c.nombre AS cliente_nombre,
        u.nombres AS usuario_nombre
      FROM ventas v
      INNER JOIN clientes c ON v.cliente_id = c.id
      INNER JOIN usuarios u ON v.usuario_id = u.id
      WHERE YEAR(fecha) = ?`,
      [anio]
    );
    return rows;
  },

  async controlInventario() {
    const [rows] = await pool.query(
      `SELECT 
        p.id,
        p.nombre,
        p.stock,
        p.stock_minimo,
        p.unidad_medida,
        p.precio_compra,
        p.precio_venta,
        p.fecha_vencimiento
      FROM productos p`
    );
    return rows;
  },
};
