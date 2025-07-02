import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import {
  MetricasDashboard,
  VentasQueryResult,
  ClientesQueryResult,
  InventarioQueryResult,
  GananciaQueryResult,
  StockBajoQueryResult,
  CambioType,
} from "../types";

export const ReportesModel = {
  async getTopProductosMasVendidos(limit = 5): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        p.id,
        p.nombre,
        p.unidad_medida,
  
        SUM(CASE 
          WHEN v.fecha BETWEEN CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY 
                          AND CURDATE()
          THEN dv.cantidad
          ELSE 0
        END) AS ventas_semana_actual,
  
        SUM(CASE 
          WHEN v.fecha BETWEEN CURDATE() - INTERVAL (WEEKDAY(CURDATE()) + 7) DAY 
                          AND CURDATE() - INTERVAL (WEEKDAY(CURDATE()) + 1) DAY
          THEN dv.cantidad
          ELSE 0
        END) AS ventas_semana_pasada
  
      FROM detalle_ventas dv
      JOIN ventas v ON dv.venta_id = v.id
      JOIN productos p ON dv.producto_id = p.id
      GROUP BY p.id
      ORDER BY ventas_semana_actual DESC
      LIMIT ?`,

      [limit]
    );

    return rows;
  },

  async getVentasMensuales(): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        YEAR(fecha) AS anio,
        MONTH(fecha) AS mes,
        SUM(total) AS total
     FROM ventas
     WHERE YEAR(fecha) = YEAR(CURDATE())
     GROUP BY anio, mes
     ORDER BY anio, mes`
    );
    return rows;
  },

  async obtenerMetricasDashboard(): Promise<MetricasDashboard> {
    const [ventasMesActual] = await pool.query<
      (VentasQueryResult & RowDataPacket)[]
    >(
      `SELECT SUM(total) AS total, COUNT(*) AS cantidad FROM ventas
     WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())`
    );

    const [ventasMesPasado] = await pool.query<
      (VentasQueryResult & RowDataPacket)[]
    >(
      `SELECT SUM(total) AS total, COUNT(*) AS cantidad FROM ventas
       WHERE MONTH(fecha) = MONTH(CURDATE() - INTERVAL 1 MONTH)
       AND YEAR(fecha) = YEAR(CURDATE() - INTERVAL 1 MONTH)`
    );

    const [clientesMesActual] = await pool.query<
      (ClientesQueryResult & RowDataPacket)[]
    >(
      `SELECT COUNT(DISTINCT cliente_id) AS total FROM ventas
       WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())`
    );

    const [clientesMesPasado] = await pool.query<
      (ClientesQueryResult & RowDataPacket)[]
    >(
      `SELECT COUNT(DISTINCT cliente_id) AS total FROM ventas
       WHERE MONTH(fecha) = MONTH(CURDATE() - INTERVAL 1 MONTH)
       AND YEAR(fecha) = YEAR(CURDATE() - INTERVAL 1 MONTH)`
    );

    const [inventarioActivo] = await pool.query<
      (InventarioQueryResult & RowDataPacket)[]
    >(`SELECT SUM(stock) AS total FROM productos`);

    const [stockBajo] = await pool.query<
      (StockBajoQueryResult & RowDataPacket)[]
    >(`SELECT COUNT(*) AS total FROM productos WHERE stock <= stock_minimo`);

    const [gananciaMesActual] = await pool.query<
      (GananciaQueryResult & RowDataPacket)[]
    >(
      `SELECT 
        SUM((dv.precio_unitario - p.precio_compra) * dv.cantidad) AS ganancia,
        SUM(dv.precio_unitario * dv.cantidad) AS ingreso
       FROM detalle_ventas dv
       JOIN productos p ON p.id = dv.producto_id
       JOIN ventas v ON v.id = dv.venta_id
       WHERE MONTH(v.fecha) = MONTH(CURDATE()) AND YEAR(v.fecha) = YEAR(CURDATE())`
    );

    const [gananciaMesPasado] = await pool.query<
      (GananciaQueryResult & RowDataPacket)[]
    >(
      `SELECT 
        SUM((dv.precio_unitario - p.precio_compra) * dv.cantidad) AS ganancia,
        SUM(dv.precio_unitario * dv.cantidad) AS ingreso
       FROM detalle_ventas dv
       JOIN productos p ON p.id = dv.producto_id
       JOIN ventas v ON v.id = dv.venta_id
       WHERE MONTH(v.fecha) = MONTH(CURDATE() - INTERVAL 1 MONTH)
       AND YEAR(v.fecha) = YEAR(CURDATE() - INTERVAL 1 MONTH)`
    );

    const calcCambio = (actual: number, anterior: number): number => {
      if (anterior === 0 || anterior === null) return actual > 0 ? 100 : 0;
      return ((actual - anterior) / anterior) * 100;
    };

    const calcularTipo = (cambio: number): CambioType => {
      if (cambio > 0) return "positive";
      if (cambio < 0) return "negative";
      return "warning";
    };

    const ventasActual = ventasMesActual[0];
    const ventasPasado = ventasMesPasado[0];
    const clientesActual = clientesMesActual[0];
    const clientesPasado = clientesMesPasado[0];
    const inventario = inventarioActivo[0];
    const stock = stockBajo[0];
    const gananciaActual = gananciaMesActual[0];
    const gananciaPasado = gananciaMesPasado[0];

    const margenActual =
      gananciaActual.ingreso && gananciaActual.ingreso > 0
        ? ((gananciaActual.ganancia || 0) / gananciaActual.ingreso) * 100
        : 0;

    const margenAnterior =
      gananciaPasado.ingreso && gananciaPasado.ingreso > 0
        ? ((gananciaPasado.ganancia || 0) / gananciaPasado.ingreso) * 100
        : 0;

    return {
      ventasTotales: {
        value: ventasActual.total || 0,
        change: parseFloat(
          calcCambio(ventasActual.total || 0, ventasPasado.total || 0).toFixed(
            1
          )
        ),
        changeType: calcularTipo(
          calcCambio(ventasActual.total || 0, ventasPasado.total || 0)
        ),
      },
      prescripciones: {
        value: ventasActual.cantidad || 0,
        change: ventasActual.cantidad - ventasPasado.cantidad,
        changeType: calcularTipo(ventasActual.cantidad - ventasPasado.cantidad),
      },
      inventarioActivo: {
        value: inventario.total || 0,
        change: 0,
        changeType: "warning",
      },
      pacientes: {
        value: clientesActual.total || 0,
        change: clientesActual.total - clientesPasado.total,
        changeType: calcularTipo(clientesActual.total - clientesPasado.total),
      },
      margenGanancia: {
        value: parseFloat(margenActual.toFixed(1)),
        change: parseFloat((margenActual - margenAnterior).toFixed(1)),
        changeType: calcularTipo(margenActual - margenAnterior),
      },
      stockBajo: {
        value: stock.total || 0,
        change: 0,
        changeType: "warning",
      },
    };
  },
};
