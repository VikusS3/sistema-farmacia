/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Compra, DetalleCompra } from "@/app/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  createCompra,
  deleteCompra,
  fetchCompras,
  fetchComprasConProductos,
  updateCompra,
} from "@/app/services/compraServices";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useCompras = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);

  const loadCompras = async () => {
    setLoading(true);
    try {
      const response = await fetchCompras();
      setCompras(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addCompra = async (compra: Partial<Compra>) => {
    setLoading(true);
    setError("");

    try {
      const compraData = {
        ...compra,
        detalle_compra: compra.detalle_compra ?? [],
      } as Omit<Compra, "id" | "creado_en" | "actualizado_en"> & {
        detalle_compra: Omit<DetalleCompra, "id" | "compra_id">[];
      };
      await createCompra(compraData);
      loadCompras();
    } catch (error: any) {
      // Extraer el mensaje de error de la estructura del backend
      const mensajeError = extractErrorMessage(error);

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al crear compra",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const actualizarCompra = async (
    id: number,
    compra: Partial<Compra> & { detalle_compra?: DetalleCompra[] }
  ) => {
    setLoading(true);
    setError("");

    try {
      await updateCompra(id, compra);
      loadCompras();
      MySwal.fire("Actualizado", "La compra ha sido actualizada", "success");
    } catch (error: any) {
      const mensajeError = extractErrorMessage(error);

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al actualizar compra",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarCompra = async (id: number) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });
    if (result.isConfirmed) {
      try {
        await deleteCompra(id);
        loadCompras();

        MySwal.fire("Eliminado", "La compra ha sido eliminada", "success");
      } catch (error: any) {
        const mensajeError = extractErrorMessage(error);

        setError(mensajeError);

        MySwal.fire({
          icon: "error",
          title: "Error al eliminar compra",
          text: mensajeError,
        });
      }
    }
  };

  useEffect(() => {
    loadCompras();
  }, []);

  return {
    compras,
    loading,
    error,
    addCompra,
    actualizarCompra,
    fetchComprasConProductos,
    eliminarCompra,
    fetchCompras,
  };
};
