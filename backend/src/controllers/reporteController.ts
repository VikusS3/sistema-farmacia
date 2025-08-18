import { RequestHandler } from "express";
import { ReportesModel } from "../models/reportes";
import { meses } from "../constants/estadisticas";

export const ReportesController = {
  getTopProductosMasVendidos: (async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const productos = await ReportesModel.getTopProductosMasVendidos(limit);

      // Formatear la respuesta para el frontend
      const productosFormateados = productos.map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        unidades_vendidas: p.total_vendido || 0,
        unidad_medida: p.unidad_medida,
        cambio: p.cambio_porcentual !== null ? Number(p.cambio_porcentual).toFixed(2) : '0.00',
      }));

      res.json(productosFormateados);
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
