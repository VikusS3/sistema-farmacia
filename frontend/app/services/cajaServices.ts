import api from "../lib/axiosConfig";
import { Caja, AbrirCajaInput, CerrarCajaInput } from "../types";
import { extractErrorMessage } from "../utils/errorHandler";

export const fetchCajas = async (): Promise<Caja[]> => {
  try {
    const response = await api.get("/cajas");
    return response.data;
  } catch (error: unknown) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const fetchCaja = async (id: number): Promise<Caja> => {
  try {
    const response = await api.get(`/cajas/${id}`);
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const abrirCaja = async (
  data: AbrirCajaInput
): Promise<{ insertId: number }> => {
  try {
    const response = await api.post("/cajas/abrir", data);
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const cerrarCaja = async (data: CerrarCajaInput): Promise<Caja> => {
  try {
    const response = await api.put(`/cajas/cerrar`, data);
    console.log(response.data);
    return response.data; // caja actualizada completa
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const getCajaActivaByUser = async (
  usuario_id: number
): Promise<Caja | null> => {
  try {
    const response = await api.get(`/cajas/activa/usuario/${usuario_id}`);
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};
