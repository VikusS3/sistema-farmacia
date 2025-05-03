import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  createProducto,
  deleteProducto,
  fetchProducto,
  fetchProductos,
  updateProducto,
} from "@/app/services/productosServices";
import { Productos } from "@/app/types";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useProductos = () => {
  const MySwal = withReactContent(Swal);
  const queryClient = useQueryClient();

  const {
    data: productos = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Productos[], Error>({
    queryKey: ["productos"],
    queryFn: fetchProductos,
    staleTime: 1000 * 60 * 5,
  });

  const addProducto = async (producto: Partial<Productos>) => {
    try {
      await createProducto(producto);
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    } catch (error) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al crear producto",
        text: mensajeError,
      });
    }
  };

  const actualizarProducto = async (
    id: number,
    producto: Partial<Productos>
  ) => {
    try {
      await updateProducto(id, producto);
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    } catch (error) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al actualizar producto",
        text: mensajeError,
      });
    }
  };

  const eliminarProducto = async (id: number) => {
    const result = await MySwal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: "Estás a punto de eliminar un producto",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteProducto(id);
        await queryClient.invalidateQueries({ queryKey: ["productos"] });
      } catch (error) {
        const mensajeError = extractErrorMessage(error);
        MySwal.fire({
          icon: "error",
          title: "Error al eliminar producto",
          text: mensajeError,
        });
      }
    }
  };

  return {
    productos,
    loading,
    error: error ? error.message : "",
    addProducto,
    actualizarProducto,
    eliminarProducto,
    fetchProducto,
    refetch, // útil si necesitas refrescar manualmente
  };
};
