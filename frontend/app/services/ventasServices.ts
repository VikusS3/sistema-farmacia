/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../lib/axiosConfig";
import { DetalleVenta, Venta } from "../types";

const extractErrorMessage = (error: any): string => {
  return (
    error?.response?.data?.message || error?.message || "Error desconocido"
  );
};

// Obtener ventas
export const fetchVentas = async () => {
  try {
    const response = await api.get("/ventas");
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw new Error(mensajeError);
  }
};

// Obtener ventas con productos
export const fetchVentasConProductos = async () => {
  try {
    const response = await api.get("/ventas/con-productos");
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw new Error(mensajeError);
  }
};

// Crear venta
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

// Actualizar venta
export const updateVenta = async (id: number, venta: any) => {
  try {
    const ventaData = {
      cliente_id: venta.cliente_id ?? null,
      usuario_id: venta.usuario_id,
      caja_id: venta.caja_id ?? null,
      total: venta.total,
      productos: venta.detalle.map((d: any) => ({
        producto_id: d.producto_id,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        unidad_venta: d.unidad_venta,
      })),
    };

    const response = await api.put(`/ventas/${id}`, ventaData);
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw new Error(mensajeError);
  }
};

// Eliminar venta
export const deleteVenta = async (id: number) => {
  try {
    const response = await api.delete(`/ventas/${id}`);
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw new Error(mensajeError);
  }
};

// Obtener ticket en PDF
export const fetchVentaTicket = async (id: number): Promise<Blob> => {
  try {
    const response = await api.get(`ventas/${id}/generar-ticket`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw new Error(mensajeError);
  }
};
