/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "../lib/axiosConfig";
import { Clientes } from "../types";
import { extractErrorMessage } from "../utils/errorHandler";

export const fetchClientes = async (): Promise<Clientes[]> => {
  try {
    const response = await api.get("/clientes");
    return response.data;
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const fetchCliente = async (id: number): Promise<Clientes> => {
  try {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const createCliente = async (
  cliente: Partial<Clientes>
): Promise<void> => {
  try {
    await api.post("/clientes", cliente);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const updateCliente = async (
  id: number,
  cliente: Partial<Clientes>
): Promise<void> => {
  try {
    await api.put(`/clientes/${id}`, cliente);
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const deleteCliente = async (id: number): Promise<void> => {
  try {
    await api.delete(`/clientes/${id}`);
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};
