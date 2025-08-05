import api from "../lib/axiosConfig";
import { Compra, DetalleCompra, CompraProducto } from "../types";
import { extractErrorMessage } from "../utils/errorHandler";

export const fetchCompras = async (): Promise<Compra[]> => {
  try {
    const response = await api.get("/compras");
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const fetchComprasConProductos = async (
  id: number
): Promise<CompraProducto> => {
  try {
    const response = await api.get(`/compras/${id}`);
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const createCompra = async (compra: {
  usuario_id: number;
  proveedor_id: number;
  total: number;
  detalles: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }[];
}) => {
  try {
    const response = await api.post("/compras", compra);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCompra = async (
  id: number,
  compra: Partial<Compra> & { detalle_compra?: DetalleCompra[] }
): Promise<void> => {
  try {
    await api.put(`/compras/${id}`, compra);
  } catch (error) {
    console.error(error);
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const deleteCompra = async (id: number): Promise<void> => {
  try {
    await api.delete(`/compras/${id}`);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};
