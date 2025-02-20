/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Clientes } from "@/app/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  createCliente,
  deleteCliente,
  fetchCliente,
  fetchClientes,
  updateCliente,
} from "@/app/services/clienteServices";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useClientes = () => {
  const [clientes, setClientes] = useState<Clientes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);

  const loadClientes = async () => {
    try {
      const response = await fetchClientes();
      setClientes(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addCliente = async (cliente: Partial<Clientes>) => {
    setLoading(true);
    setError("");

    try {
      await createCliente(cliente);
      loadClientes();
    } catch (error: any) {
      // Extraer el mensaje de error de la estructura del backend
      const mensajeError = extractErrorMessage(error);

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al crear cliente",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const actualizarCliente = async (id: number, cliente: Partial<Clientes>) => {
    setLoading(true);
    setError("");

    try {
      await updateCliente(id, cliente);
      loadClientes();
    } catch (error: any) {
      const mensajeError = extractErrorMessage(error);

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al actualizar cliente",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const borrarCliente = async (id: number) => {
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
        await deleteCliente(id);
        loadClientes();
        MySwal.fire("Eliminado!", "El cliente ha sido eliminado.", "success");
      } catch (error: any) {
        // Extraer el mensaje de error de la estructura del backend
        const mensajeError = extractErrorMessage(error);

        setError(mensajeError);

        MySwal.fire({
          icon: "error",
          title: "Error al eliminar cliente",
          text: mensajeError,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    addCliente,
    fetchCliente,
    actualizarCliente,
    borrarCliente,
  };
};
