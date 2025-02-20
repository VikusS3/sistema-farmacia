/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Proveedores } from "@/app/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  createProveedor,
  deleteProveredor,
  fecthProveedores,
  fetchProveedor,
  updateProveedor,
} from "@/app/services/proveedoresServices";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedores[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);

  const loadProveedores = async () => {
    try {
      const response = await fecthProveedores();
      setProveedores(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addProveedor = async (proveedor: Partial<Proveedores>) => {
    setLoading(true);
    setError("");

    try {
      await createProveedor(proveedor);
      loadProveedores();
    } catch (error: any) {
      // Extraer el mensaje de error de la estructura del backend
      const mensajeError = extractErrorMessage(error);

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al crear proveedor",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const actualizarProveedor = async (
    id: number,
    proveedor: Partial<Proveedores>
  ) => {
    setLoading(true);
    setError("");

    try {
      await updateProveedor(id, proveedor);
      loadProveedores();
    } catch (error: any) {
      // Extraer el mensaje de error de la estructura del backend
      const mensajeError = extractErrorMessage(error);

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al actualizar proveedor",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarProveedor = async (id: number) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setLoading(true);
      setError("");
      try {
        await deleteProveredor(id);
        loadProveedores();
        MySwal.fire("Eliminado!", "El proveedor ha sido eliminado.", "success");
      } catch (error: any) {
        // Extraer el mensaje de error de la estructura del backend
        const mensajeError = extractErrorMessage(error);

        setError(mensajeError);

        MySwal.fire({
          icon: "error",
          title: "Error al eliminar proveedor",
          text: mensajeError,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadProveedores();
  }, []);

  return {
    proveedores,
    loading,
    error,
    addProveedor,
    actualizarProveedor,
    eliminarProveedor,
    fetchProveedor,
  };
};
