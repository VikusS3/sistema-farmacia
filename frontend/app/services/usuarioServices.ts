/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../lib/axiosConfig";
import { Usuario } from "../types";
import { extractErrorMessage } from "../utils/errorHandler";

export const fetchUsuarios = async (): Promise<Usuario> => {
  try {
    const response = await api.get("/usuarios");
    return response.data;
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const fetchUser = async (id: number): Promise<Usuario> => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const createUser = async (usuario: Partial<Usuario>): Promise<void> => {
  try {
    await api.post("/usuarios", usuario);
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const updateUser = async (
  id: number,
  usuario: Partial<Usuario>
): Promise<void> => {
  try {
    await api.put(`/usuarios/${id}`, usuario);
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/usuarios/${id}`);
  } catch (error: any) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};
