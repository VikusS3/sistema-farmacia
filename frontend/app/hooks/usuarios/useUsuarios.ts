/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import api from "@/app/lib/axiosConfig";
import { Usuario } from "@/app/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Ocurrió un error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error: any) {
      setError(error?.response?.data?.message || "Ocurrió un error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addUsuario = async (usuario: Partial<Usuario>) => {
    setLoading(true);
    setError("");

    try {
      await api.post("/usuarios", usuario);
      MySwal.fire({
        icon: "success",
        title: "Usuario agregado",
        text: `${usuario.nombres} se ha agregado correctamente.`,
      });
      fetchUsuarios();
    } catch (error: any) {
      console.error("Error completo:", error);
      // Extraer el mensaje de error de la estructura del backend
      const mensajeError =
        error?.response?.data?.error?.[0]?.message ||
        error?.message ||
        "Ocurrió un error inesperado";

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al agregar usuario",
        text: mensajeError,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUsuario = async (id: number, usuario: Partial<Usuario>) => {
    setLoading(true);
    setError("");
    try {
      await api.put(`/usuarios/${id}`, usuario);
      fetchUsuarios();
    } catch (error: any) {
      console.error("Error completo:", error);
      // Extraer el mensaje de error de la estructura del backend
      const mensajeError =
        error?.response?.data?.error?.[0]?.message ||
        error?.message ||
        "Ocurrió un error inesperado";

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al agregar usuario",
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
      await api.delete(`/usuarios/${id}`);
      fetchUsuarios();
    } catch (error: any) {
      setError(error?.response?.data?.message || "Ocurrió un error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
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
