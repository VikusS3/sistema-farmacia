import api from "../lib/axiosConfig";
import { Productos } from "../types";
import { extractErrorMessage } from "../utils/errorHandler";

export const fetchProductos = async (): Promise<Productos[]> => {
  try {
    const response = await api.get("/productos");
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const fetchProducto = async (id: number): Promise<Productos> => {
  try {
    const response = await api.get(`/productos/${id}`);
    if (response.data.fecha_vencimiento) {
      response.data.fecha_vencimiento = new Date(
        response.data.fecha_vencimiento
      )
        .toISOString()
        .split("T")[0];
    }
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const createProducto = async (
  producto: Partial<Productos>
): Promise<void> => {
  try {
    await api.post("/productos", producto);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const updateProducto = async (
  id: number,
  producto: Partial<Productos>
): Promise<void> => {
  try {
    await api.put(`/productos/${id}`, producto);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const deleteProducto = async (id: number): Promise<void> => {
  try {
    await api.delete(`/productos/${id}`);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const getProductosWithExpired = async (): Promise<Productos[]> => {
  try {
    const response = await api.get("/productos/vencimiento/with-experied");
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};
