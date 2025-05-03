/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../lib/axiosConfig";
import { Proveedores } from "../types";
import { extractErrorMessage } from "../utils/errorHandler";

export const fecthProveedores = async (): Promise<Proveedores[]> => {
  try {
    const response = await api.get("/proveedores");
    return response.data;
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const fetchProveedor = async (id: number): Promise<Proveedores> => {
  try {
    const response = await api.get(`/proveedores/${id}`);
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const createProveedor = async (
  proveedor: Partial<Proveedores>
): Promise<void> => {
  try {
    await api.post("/proveedores", proveedor);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const updateProveedor = async (
  id: number,
  proveedor: Partial<Proveedores>
): Promise<void> => {
  try {
    await api.put(`/proveedores/${id}`, proveedor);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const deleteProveredor = async (id: number): Promise<void> => {
  try {
    await api.delete(`/proveedores/${id}`);
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};
