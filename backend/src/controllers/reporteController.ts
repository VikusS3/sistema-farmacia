import { Request, Response, RequestHandler } from "express";
import { ReportesModel } from "../models/reportes";
import { meses } from "../constants/estadisticas";

export const ReportesController = {
  getTopProductosMasVendidos: (async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const productos = await ReportesModel.getTopProductosMasVendidos(limit);

      const productosConCambio = productos.map((p: any) => {
        const actual = p.ventas_semana_actual || 0;
        const pasada = p.ventas_semana_pasada || 0;

        let cambio = 0;
        if (pasada > 0) {
          cambio = ((actual - pasada) / pasada) * 100;
        } else if (actual > 0) {
          cambio = 100; // si antes no hubo ventas
        }

        return {
          id: p.id,
          nombre: p.nombre,
          unidades_vendidas: actual,
          unidad_medida: p.unidad_medida,
          cambio: cambio.toFixed(2), // lo devolvemos como string con dos decimales
        };
      });

      res.json(productosConCambio);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error al obtener los productos más vendidos" });
    }
  }) as RequestHandler,

  getVentasMensuales: (async (req, res) => {
    try {
      const ventasPorMes = await ReportesModel.getVentasMensuales();

      // Mapeo inicial: todos los meses con total 0
      const datosCompletos = meses.map((nombre, index) => {
        return { name: nombre, total: 0 };
      });

      // Reemplazar con datos reales
      ventasPorMes.forEach((row: any) => {
        const i = row.mes - 1;
        datosCompletos[i].total = row.total ? parseFloat(row.total) : 0;
      });

      res.json(datosCompletos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener ventas mensuales" });
    }
  }) as RequestHandler,

  getMetricasDashboard: (async (req, res) => {
    try {
      const metricas = await ReportesModel.obtenerMetricasDashboard();
      res.json(metricas);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error al obtener las métricas del dashboard" });
    }
  }) as RequestHandler,
};
