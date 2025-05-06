import { useQuery, useQueryClient } from "@tanstack/react-query";
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

const MySwal = withReactContent(Swal);

export const useVentas = () => {
  const queryClient = useQueryClient();

  // Fetch ventas
  const {
    data: ventas = [],
    isLoading: loading,
    isError,
    error,
    refetch: fetchVentasManual,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: fetchVentas,
  });

  const addVenta = async (venta: Partial<Venta>) => {
    try {
      const ventaData = {
        ...venta,
        detalle_venta: venta.detalle_venta ?? [],
      } as Omit<Venta, "id" | "creado_en" | "actualizado_en"> & {
        detalle_venta: Omit<DetalleVenta, "id" | "venta_id">[];
      };

      await createVenta(ventaData);
      await queryClient.invalidateQueries({ queryKey: ["ventas"] });
      MySwal.fire({
        icon: "success",
        title: "Venta registrada",
        text: "La venta fue registrada exitosamente.",
      });
    } catch (err) {
      const mensaje = extractErrorMessage(err);
      MySwal.fire({
        icon: "error",
        title: "Error al registrar venta",
        text: mensaje,
      });
    }
  };

  const actualizarVenta = async (
    id: number,
    venta: Partial<Venta> & { detalle_venta?: DetalleVenta[] }
  ) => {
    try {
      await updateVenta(id, venta);
      await queryClient.invalidateQueries({ queryKey: ["ventas"] });
      MySwal.fire({
        icon: "success",
        title: "Venta actualizada",
        text: "La venta se actualizó correctamente.",
      });
    } catch (err) {
      const mensaje = extractErrorMessage(err);
      MySwal.fire({
        icon: "error",
        title: "Error al actualizar venta",
        text: mensaje,
      });
    }
  };

  const eliminarVenta = async (id: number) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteVenta(id);
        await queryClient.invalidateQueries({ queryKey: ["ventas"] });
        MySwal.fire({
          icon: "success",
          title: "Venta eliminada",
          text: "La venta se eliminó correctamente.",
        });
      } catch (err) {
        const mensaje = extractErrorMessage(err);
        MySwal.fire({
          icon: "error",
          title: "Error al eliminar venta",
          text: mensaje,
        });
      }
    }
  };

  return {
    ventas,
    loading,
    error: isError ? extractErrorMessage(error) : null,
    addVenta,
    actualizarVenta,
    eliminarVenta,
    fetchVentas: fetchVentasManual,
    fetchVentasConProductos,
  };
};
