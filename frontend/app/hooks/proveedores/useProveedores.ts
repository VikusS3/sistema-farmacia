import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  createProveedor,
  deleteProveredor,
  fecthProveedores,
  fetchProveedor,
  updateProveedor,
} from "@/app/services/proveedoresServices";
import { Proveedores } from "@/app/types";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useProveedores = () => {
  const MySwal = withReactContent(Swal);
  const queryClient = useQueryClient();

  const {
    data: proveedores = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Proveedores[], Error>({
    queryKey: ["proveedores"],
    queryFn: fecthProveedores,
    staleTime: 1000 * 60 * 5,
  });

  const addProveedor = async (proveedor: Partial<Proveedores>) => {
    try {
      await createProveedor(proveedor);
      await queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    } catch (error) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al crear proveedor",
        text: mensajeError,
      });
    }
  };

  const actualizarProveedor = async (
    id: number,
    proveedor: Partial<Proveedores>
  ) => {
    try {
      await updateProveedor(id, proveedor);
      await queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    } catch (error) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al actualizar proveedor",
        text: mensajeError,
      });
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
      try {
        await deleteProveredor(id);
        await queryClient.invalidateQueries({ queryKey: ["proveedores"] });
        MySwal.fire("Eliminado!", "El proveedor ha sido eliminado.", "success");
      } catch (error) {
        const mensajeError = extractErrorMessage(error);
        MySwal.fire({
          icon: "error",
          title: "Error al eliminar proveedor",
          text: mensajeError,
        });
      }
    }
  };

  return {
    proveedores,
    loading,
    error: error ? error.message : "",
    addProveedor,
    actualizarProveedor,
    eliminarProveedor,
    fetchProveedor,
    refetch,
  };
};
