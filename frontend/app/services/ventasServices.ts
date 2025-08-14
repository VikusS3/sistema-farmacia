/* eslint-disable @typescript-eslint/no-explicit-any */
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
    cliente_id: venta.cliente_id,
    usuario_id: venta.usuario_id,
    caja_id: (venta as any).caja_id ?? null,
    fecha: venta.fecha,
    adicional: venta.adicional ?? 0,
    descuento: venta.descuento ?? 0,
    metodo_pago: venta.metodo_pago,
    total: venta.total,
    detalle_venta: venta.detalle_venta.map((d) => ({
      producto_id: d.producto_id,
      cantidad: d.cantidad,
      unidad_venta: (d as any).unidad_venta ?? "unidad",
      precio_unitario: d.precio_unitario,
      subtotal: d.subtotal,
    })),
  };

  try {
    await api.post("/ventas", ventaData);
  } catch (error) {
    console.error(error);
    const mensajeError = extractErrorMessage(error);
    console.error("Error lanzado desde createVenta:", mensajeError);
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
  const response = await api.get(`ventas/${id}/generar-ticket`, {
    responseType: "blob", // 👈 esto es clave para PDFs
  });
  return response.data;
};
