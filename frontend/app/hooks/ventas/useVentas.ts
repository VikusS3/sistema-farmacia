/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Venta, DetalleVenta } from "@/app/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  createVenta,
  deleteVenta,
  fetchVentas,
  fetchVentasConProductos,
  updateVenta,
} from "@/app/services/ventasServices";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useVentas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);

  const loadVentas = async () => {
    setLoading(true);
    try {
      const response = await fetchVentas();
      setVentas(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addVenta = async (venta: Partial<Venta>) => {
    setLoading(true);
    setError("");

    try {
      const ventaData = {
        ...venta,
        detalle_venta: venta.detalle_venta ?? [],
      } as Omit<Venta, "id" | "creado_en" | "actualizado_en"> & {
        detalle_venta: Omit<DetalleVenta, "id" | "venta_id">[];
      };
      await createVenta(ventaData);
      loadVentas();
    } catch (error: any) {
      const mensajeError = extractErrorMessage(error);
      setError(mensajeError);
      MySwal.fire({
        icon: "error",
        title: "Error al crear venta",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const actualizarVenta = async (
    id: number,
    venta: Partial<Venta> & { detalle_venta?: DetalleVenta[] }
  ) => {
    setLoading(true);
    setError("");

    try {
      await updateVenta(id, venta);
      loadVentas();
      MySwal.fire({
        icon: "success",
        title: "Venta actualizada",
        text: "La venta se actualizó correctamente",
      });
    } catch (error: any) {
      const mensajeError = extractErrorMessage(error);
      setError(mensajeError);
      MySwal.fire({
        icon: "error",
        title: "Error al actualizar venta",
        text: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarVenta = async (id: number) => {
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
      setLoading(true);
      setError("");

      try {
        await deleteVenta(id);
        loadVentas();
        MySwal.fire({
          icon: "success",
          title: "Venta eliminada",
          text: "La venta se eliminó correctamente",
        });
      } catch (error: any) {
        const mensajeError = extractErrorMessage(error);
        setError(mensajeError);
        MySwal.fire({
          icon: "error",
          title: "Error al eliminar venta",
          text: mensajeError,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadVentas();
  }, []);

  return {
    ventas,
    loading,
    error,
    addVenta,
    actualizarVenta,
    eliminarVenta,
    fetchVentasConProductos,
    fetchVentas,
  };
};
