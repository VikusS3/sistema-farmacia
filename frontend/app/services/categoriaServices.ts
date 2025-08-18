import api from "../lib/axiosConfig";
import { Categorias } from "../types";
import { extractErrorMessage } from "../utils/errorHandler";

export const fetchCategorias = async (): Promise<Categorias[]> => {
  try {
    const response = await api.get("/categorias");
    return response.data;
  } catch (error: unknown) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const fetchCategoria = async (id: number): Promise<Categorias> => {
  try {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const createCategoria = async (
  categoria: Partial<Categorias>
): Promise<void> => {
  try {
    await api.post("/categorias", categoria);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const updateCategoria = async (
  id: number,
  categoria: Partial<Categorias>
): Promise<void> => {
  try {
    await api.put(`/categorias/${id}`, categoria);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const deleteCategoria = async (id: number): Promise<void> => {
  try {
    await api.delete(`/categorias/${id}`);
  } catch (error: unknown) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};
