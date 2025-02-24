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
    const response = await api.get(`/compras/${id}/productos`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    const mensajeError = extractErrorMessage(error);
    console.error(mensajeError);
    throw error;
  }
};

export const createCompra = async (
  compra: Omit<Compra, "id" | "creado_en" | "actualizado_en"> & {
    detalle_compra: Omit<DetalleCompra, "id" | "compra_id">[];
  }
): Promise<Compra> => {
  try {
    // Eliminamos `compra_id` antes de enviarlo
    const compraData = {
      ...compra,
      detalle_compra: compra.detalle_compra,
    };

    const response = await api.post("/compras", compraData);
    return response.data;
  } catch (error) {
    console.error(error);
    console.error(extractErrorMessage(error));
    throw error;
  }
};

export const updateCompra = async (
  id: number,
  compra: Partial<Compra>
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
