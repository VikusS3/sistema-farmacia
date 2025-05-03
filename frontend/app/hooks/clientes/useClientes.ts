import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const MySwal = withReactContent(Swal);
  const queryClient = useQueryClient();

  const {
    data: clientes = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Clientes[], Error>({
    queryKey: ["clientes"],
    queryFn: fetchClientes,
    staleTime: 1000 * 60 * 5,
  });

  const addCliente = async (cliente: Partial<Clientes>) => {
    try {
      await createCliente(cliente);
      await queryClient.invalidateQueries({ queryKey: ["clientes"] });
    } catch (error: unknown) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al crear cliente",
        text: mensajeError,
      });
    }
  };

  const actualizarCliente = async (id: number, cliente: Partial<Clientes>) => {
    try {
      await updateCliente(id, cliente);
      await queryClient.invalidateQueries({ queryKey: ["clientes"] });
    } catch (error: unknown) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al actualizar cliente",
        text: mensajeError,
      });
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
      try {
        await deleteCliente(id);
        await queryClient.invalidateQueries({ queryKey: ["clientes"] });
        MySwal.fire("Eliminado!", "El cliente ha sido eliminado.", "success");
      } catch (error: unknown) {
        const mensajeError = extractErrorMessage(error);
        MySwal.fire({
          icon: "error",
          title: "Error al eliminar cliente",
          text: mensajeError,
        });
      }
    }
  };

  return {
    clientes,
    loading,
    error: error ? error.message : "",
    addCliente,
    fetchCliente,
    actualizarCliente,
    borrarCliente,
    refetch, // útil para refrescar manualmente si se necesita
  };
};
