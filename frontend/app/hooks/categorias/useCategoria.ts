import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Categoria } from "@/app/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  createCategoria,
  deleteCategoria,
  fetchCategoria,
  fetchCategorias,
  updateCategoria,
} from "@/app/services/categoriaServices";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useCategoria = () => {
  const MySwal = withReactContent(Swal);
  const queryClient = useQueryClient();

  const {
    data: categorias = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Categoria[], Error>({
    queryKey: ["categorias"],
    queryFn: fetchCategorias,
    staleTime: 1000 * 60 * 5,
  });

  const addCategoria = async (categoria: Partial<Categoria>) => {
    try {
      await createCategoria(categoria);
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
    } catch (error: unknown) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al crear categoría",
        text: mensajeError,
      });
      throw error; // opcionalmente relanzar si necesitas manejarlo afuera
    }
  };

  const actualizarCategoria = async (
    id: number,
    categoria: Partial<Categoria>
  ) => {
    try {
      await updateCategoria(id, categoria);
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
    } catch (error: unknown) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al actualizar categoría",
        text: mensajeError,
      });
      throw error;
    }
  };

  const borrarCategoria = async (id: number) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bórralo",
    });

    if (result.isConfirmed) {
      try {
        await deleteCategoria(id);
        await queryClient.invalidateQueries({ queryKey: ["categorias"] });
      } catch (error: unknown) {
        const mensajeError = extractErrorMessage(error);
        MySwal.fire({
          icon: "error",
          title: "Error al borrar categoría",
          text: mensajeError,
        });
        throw error;
      }
    }
  };

  return {
    categorias,
    loading,
    error: error ? error.message : "",
    addCategoria,
    actualizarCategoria,
    borrarCategoria,
    fetchCategoria,
    refetchCategorias: refetch,
  };
};
