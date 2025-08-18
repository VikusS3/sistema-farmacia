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
  // Top productos más vendidos
  async getTopProductosMasVendidos(limit = 5): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `WITH ventas_mes_actual AS (
        SELECT 
          p.id,
          p.nombre,
          p.unidad_medida,
          SUM(dv.cantidad) AS cantidad_mes_actual,
          COUNT(DISTINCT v.id) AS num_ventas_mes_actual
        FROM detalle_ventas dv
        JOIN ventas v ON dv.venta_id = v.id
        JOIN productos p ON dv.producto_id = p.id
        WHERE v.fecha >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
          AND v.fecha < DATE_FORMAT(CURRENT_DATE + INTERVAL 1 MONTH, '%Y-%m-01')
        GROUP BY p.id, p.nombre, p.unidad_medida
      ),
      ventas_mes_pasado AS (
        SELECT 
          p.id,
          SUM(dv.cantidad) AS cantidad_mes_pasado
        FROM detalle_ventas dv
        JOIN ventas v ON dv.venta_id = v.id
        JOIN productos p ON dv.producto_id = p.id
        WHERE v.fecha >= DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01')
          AND v.fecha < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
        GROUP BY p.id
      )
      SELECT 
        a.id,
        a.nombre,
        a.unidad_medida,
        a.cantidad_mes_actual AS total_vendido,
        COALESCE(
          ROUND(
            ((a.cantidad_mes_actual - COALESCE(p.cantidad_mes_pasado, 0)) / 
            NULLIF(COALESCE(p.cantidad_mes_pasado, 0), 0)) * 100,
            2
          ),
          CASE 
            WHEN a.cantidad_mes_actual > 0 THEN 100 
            ELSE 0 
          END
        ) AS cambio_porcentual
      FROM ventas_mes_actual a
      LEFT JOIN ventas_mes_pasado p ON a.id = p.id
      ORDER BY a.cantidad_mes_actual DESC
      LIMIT ?`,
      [limit]
    );

    return rows;
  },

  // Ventas por mes
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

  // Métricas dashboard
  async obtenerMetricasDashboard(): Promise<MetricasDashboard> {
    const [ventasMesActual] = await pool.query<
      (VentasQueryResult & RowDataPacket)[]
    >(
      `SELECT SUM(total) AS total, COUNT(*) AS cantidad 
       FROM ventas
       WHERE MONTH(fecha) = MONTH(CURDATE()) 
         AND YEAR(fecha) = YEAR(CURDATE())`
    );

    const [ventasMesPasado] = await pool.query<
      (VentasQueryResult & RowDataPacket)[]
    >(
      `SELECT SUM(total) AS total, COUNT(*) AS cantidad 
       FROM ventas
       WHERE MONTH(fecha) = MONTH(CURDATE() - INTERVAL 1 MONTH)
         AND YEAR(fecha) = YEAR(CURDATE() - INTERVAL 1 MONTH)`
    );

    const [clientesMesActual] = await pool.query<
      (ClientesQueryResult & RowDataPacket)[]
    >(
      `SELECT COUNT(DISTINCT cliente_id) AS total 
       FROM ventas
       WHERE MONTH(fecha) = MONTH(CURDATE()) 
         AND YEAR(fecha) = YEAR(CURDATE())`
    );

    const [clientesMesPasado] = await pool.query<
      (ClientesQueryResult & RowDataPacket)[]
    >(
      `SELECT COUNT(DISTINCT cliente_id) AS total 
       FROM ventas
       WHERE MONTH(fecha) = MONTH(CURDATE() - INTERVAL 1 MONTH)
         AND YEAR(fecha) = YEAR(CURDATE() - INTERVAL 1 MONTH)`
    );

    const [valorInventario] = await pool.query<
      (RowDataPacket & { total: number })[]
    >(
      `SELECT 
      IFNULL(SUM(stock * precio_venta), 0) AS total
   FROM productos`
    );

    const [inventarioActivo] = await pool.query<
      (InventarioQueryResult & RowDataPacket)[]
    >(`SELECT SUM(stock) AS total FROM productos`);

    // ⚠️ Stock bajo: ya no existe stock_minimo → usamos umbral fijo (ej: < 10)
    const [stockBajo] = await pool.query<
      (StockBajoQueryResult & RowDataPacket)[]
    >(`SELECT COUNT(*) AS total FROM productos WHERE stock < 10`);

    // Ganancia e ingresos del mes actual (ya viene de detalle_ventas.ganancia)
    const [gananciaMesActual] = await pool.query<
      (GananciaQueryResult & RowDataPacket)[]
    >(
      `SELECT 
        SUM(dv.ganancia) AS ganancia,
        SUM(dv.subtotal) AS ingreso
       FROM detalle_ventas dv
       JOIN ventas v ON v.id = dv.venta_id
       WHERE MONTH(v.fecha) = MONTH(CURDATE()) 
         AND YEAR(v.fecha) = YEAR(CURDATE())`
    );

    // Ganancia e ingresos del mes pasado
    const [gananciaMesPasado] = await pool.query<
      (GananciaQueryResult & RowDataPacket)[]
    >(
      `SELECT 
        SUM(dv.ganancia) AS ganancia,
        SUM(dv.subtotal) AS ingreso
       FROM detalle_ventas dv
       JOIN ventas v ON v.id = dv.venta_id
       WHERE MONTH(v.fecha) = MONTH(CURDATE() - INTERVAL 1 MONTH)
         AND YEAR(v.fecha) = YEAR(CURDATE() - INTERVAL 1 MONTH)`
    );

    // 🔽 Funciones auxiliares (igual que antes)
    const calcCambio = (actual: number, anterior: number): number => {
      if (anterior === 0 || anterior === null) return actual > 0 ? 100 : 0;
      return ((actual - anterior) / anterior) * 100;
    };

    const calcularTipo = (cambio: number): CambioType => {
      if (cambio > 0) return "positive";
      if (cambio < 0) return "negative";
      return "warning";
    };

    // Variables resultado
    const ventasActual = ventasMesActual[0];
    const ventasPasado = ventasMesPasado[0];
    const clientesActual = clientesMesActual[0];
    const clientesPasado = clientesMesPasado[0];
    const inventario = inventarioActivo[0];
    const valorInventarioTotal = valorInventario[0];
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
      valorInventarioTotal: {
        value: valorInventarioTotal.total || 0,
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
