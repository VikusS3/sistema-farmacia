/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Usuario } from "@/app/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  createUser,
  deleteUser,
  fetchUser,
  fetchUsuarios,
  updateUser,
} from "@/app/services/usuarioServices";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);

  const loadUsuarios = async () => {
    try {
      const response = await fetchUsuarios();
      setUsuarios(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addUsuario = async (usuario: Partial<Usuario>) => {
    setLoading(true);
    setError("");

    try {
      await createUser(usuario);
      loadUsuarios();
    } catch (error: any) {
      // Extraer el mensaje de error de la estructura del backend
      const mensajeError = extractErrorMessage(error);

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al crear usuario",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUsuario = async (id: number, usuario: Partial<Usuario>) => {
    setLoading(true);
    setError("");

    try {
      await updateUser(id, usuario);
      loadUsuarios();
    } catch (error: any) {
      // Extraer el mensaje de error de la estructura del backend
      const mensajeError = extractErrorMessage(error);

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al actualizar usuario",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUsuario = async (id: number) => {
    setLoading(true);
    setError("");

    try {
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
        await deleteUser(id);
        loadUsuarios();

        MySwal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
      }
    } catch (error: any) {
      // Extraer el mensaje de error de la estructura del backend
      const mensajeError = extractErrorMessage(error);

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al eliminar usuario",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    addUsuario,
    deleteUsuario,
    fetchUser,
    updateUsuario,
    setUsuarios,
  };
};
