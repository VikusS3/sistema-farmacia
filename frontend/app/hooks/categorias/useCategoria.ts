import { useState, useEffect } from "react";
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
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);

  const loadCategorias = async () => {
    try {
      const response = await fetchCategorias();
      setCategorias(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addCategoria = async (categoria: Partial<Categoria>) => {
    setLoading(true);
    setError("");
    try {
      await createCategoria(categoria);
      loadCategorias();
    } catch (error: unknown) {
      const mensajeError = extractErrorMessage(error);
      setError(mensajeError);
      MySwal.fire({
        icon: "error",
        title: "Error al crear categoria",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const actualizarCategoria = async (
    id: number,
    categoria: Partial<Categoria>
  ) => {
    setLoading(true);
    setError("");
    try {
      await updateCategoria(id, categoria);
      loadCategorias();
    } catch (error: unknown) {
      const mensajeError = extractErrorMessage(error);
      setError(mensajeError);
      MySwal.fire({
        icon: "error",
        title: "Error al actualizar categoria",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
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
      setLoading(true);
      setError("");
      try {
        await deleteCategoria(id);
        loadCategorias();
      } catch (error: unknown) {
        const mensajeError = extractErrorMessage(error);
        setError(mensajeError);
        MySwal.fire({
          icon: "error",
          title: "Error al borrar categoria",
          text: mensajeError,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  return {
    categorias,
    loading,
    error,
    addCategoria,
    actualizarCategoria,
    borrarCategoria,
    fetchCategoria,
  };
};
