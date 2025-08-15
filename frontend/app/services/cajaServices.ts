// src/services/cajaService.ts
import axios from "axios";
import api from "../lib/axiosConfig";
import { extractErrorMessage } from "../utils/errorHandler";
import {
  Caja,
  AbrirCajaInput,
  CerrarCajaInput,
  AbrirCajaResponse,
  CajaActivaResponse,
} from "../types";

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
  } catch (error: unknown) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const abrirCaja = async (
  data: AbrirCajaInput
): Promise<AbrirCajaResponse> => {
  try {
    const response = await api.post("/cajas/abrir", data);
    return response.data;
  } catch (error: unknown) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const cerrarCaja = async (data: CerrarCajaInput): Promise<Caja> => {
  try {
    const response = await api.post("/cajas/cerrar", data);
    return response.data; // Retorna la caja actualizada
  } catch (error: unknown) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const getCajaActivaByUser = async (
  usuario_id: number
): Promise<CajaActivaResponse | null> => {
  try {
    const response = await api.get<CajaActivaResponse>(
      `/cajas/abierta/${usuario_id}`
    );
    return response.data;
  } catch (error: unknown) {
    const mensajeError = extractErrorMessage(error);
    console.error("Error al obtener caja activa:", mensajeError);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null; // No hay caja activa
    }
    throw error;
  }
};
