import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  createUser,
  deleteUser,
  fetchUser,
  fetchUsuarios,
  updateUser,
} from "@/app/services/usuarioServices";
import { Usuario } from "@/app/types";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useUsuarios = () => {
  const MySwal = withReactContent(Swal);
  const queryClient = useQueryClient();

  const {
    data: usuarios = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Usuario[], Error>({
    queryKey: ["usuarios"],
    queryFn: fetchUsuarios,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const addUsuario = async (usuario: Partial<Usuario>) => {
    try {
      await createUser(usuario);
      await queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    } catch (error) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al crear usuario",
        text: mensajeError,
      });
    }
  };

  const updateUsuario = async (id: number, usuario: Partial<Usuario>) => {
    try {
      await updateUser(id, usuario);
      await queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    } catch (error) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al actualizar usuario",
        text: mensajeError,
      });
    }
  };

  const deleteUsuario = async (id: number) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        await queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        MySwal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
      } catch (error) {
        const mensajeError = extractErrorMessage(error);
        MySwal.fire({
          icon: "error",
          title: "Error al eliminar usuario",
          text: mensajeError,
        });
      }
    }
  };

  return {
    usuarios,
    loading,
    error: error ? error.message : "",
    fetchUser,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    refetch,
  };
};
