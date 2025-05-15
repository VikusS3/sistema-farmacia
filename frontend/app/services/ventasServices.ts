import api from "../lib/axiosConfig";
import { Venta, DetalleVenta, VentaProducto } from "../types";
import { extractErrorMessage } from "../utils/errorHandler";

export const fetchVentas = async (): Promise<Venta[]> => {
  try {
    const response = await api.get("/ventas");
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const fetchVentasConProductos = async (
  id: number
): Promise<VentaProducto> => {
  try {
    const response = await api.get(`ventas/venta/${id}/productos`);
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const createVenta = async (
  venta: Omit<Venta, "id" | "creado_en" | "actualizado_en"> & {
    detalle_venta: Omit<DetalleVenta, "id" | "venta_id">[];
  }
): Promise<void> => {
  const ventaData = {
    ...venta,
    detalle_venta: venta.detalle_venta,
  };

  try {
    await api.post("/ventas", ventaData);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error("Error lanzado desde createVenta:", mensajeError);

    // Lanzamos un error real que pueda ser capturado
    throw new Error(mensajeError);
  }
};

export const updateVenta = async (
  id: number,
  venta: Partial<Venta> & { detalle_venta?: DetalleVenta[] }
): Promise<void> => {
  try {
    await api.put(`/ventas/${id}`, venta);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw new Error(mensajeError);
  }
};

export const deleteVenta = async (id: number): Promise<void> => {
  try {
    await api.delete(`/ventas/${id}`);
  } catch (error) {
    console.error(error);
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const fetchVentaTicket = async (id: number): Promise<Blob> => {
  const response = await api.get(`ventas/venta/${id}/ticket`, {
    responseType: "blob", // 👈 esto es clave para PDFs
  });
  return response.data;
};
