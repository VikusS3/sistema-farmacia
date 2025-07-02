/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../lib/axiosConfig";
import { TopProductosMasVendidos, MetricasDashboard } from "../types/reporte";
import { extractErrorMessage } from "../utils/errorHandler";

export const getTopProductosMasVendidos = async (): Promise<
  TopProductosMasVendidos[]
> => {
  try {
    const response = await api.get("/reportes/top-productos");
    return response.data;
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const getVentasMensuales = async (): Promise<any[]> => {
  try {
    const response = await api.get("/reportes/ventas-mensuales");
    return response.data;
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const getMetricasDashboard = async (): Promise<MetricasDashboard> => {
  try {
    const response = await api.get("/reportes/metricas-dashboard");
    return response.data;
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};
