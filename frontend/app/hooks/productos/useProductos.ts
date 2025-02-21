import { useState, useEffect } from "react";
import { Productos } from "@/app/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  createProducto,
  deleteProducto,
  fetchProducto,
  fetchProductos,
  updateProducto,
} from "@/app/services/productosServices";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useProductos = () => {
  const [productos, setProductos] = useState<Productos[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);

  const loadProductos = async () => {
    try {
      const response = await fetchProductos();
      setProductos(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addProducto = async (producto: Partial<Productos>) => {
    setLoading(true);
    setError("");

    try {
      await createProducto(producto);
      loadProductos();
    } catch (error) {
      // Extraer el mensaje de error de la estructura del backend
      const mensajeError = extractErrorMessage(error);

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al crear producto",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const actualizarProducto = async (
    id: number,
    producto: Partial<Productos>
  ) => {
    setLoading(true);
    setError("");

    try {
      await updateProducto(id, producto);
      loadProductos();
    } catch (error) {
      const mensajeError = extractErrorMessage(error);

      setError(mensajeError);

      MySwal.fire({
        icon: "error",
        title: "Error al actualizar producto",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
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
        loadProductos();
      } catch (error) {
        const mensajeError = extractErrorMessage(error);

        setError(mensajeError);

        MySwal.fire({
          icon: "error",
          title: "Error al eliminar producto",
          text: mensajeError,
        });
      }
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  return {
    productos,
    loading,
    error,
    addProducto,
    actualizarProducto,
    eliminarProducto,
    fetchProducto,
  };
};
