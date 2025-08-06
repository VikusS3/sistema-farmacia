/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const {
    data: ventas = [],
    isLoading: loading,
    isError,
    error,
    refetch: fetchVentasManual,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: fetchVentas,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const addVenta = async (venta: Partial<Venta>) => {
    try {
      const ventaData: Omit<Venta, "id" | "creado_en" | "actualizado_en"> & {
        detalle_venta: Omit<DetalleVenta, "id" | "venta_id">[];
      } = {
        cliente_id: venta.cliente_id!,
        usuario_id: venta.usuario_id!,
        caja_id: (venta as any).caja_id ?? null,
        fecha: venta.fecha!, // obligatorio según tipo
        adicional: venta.adicional ?? 0,
        descuento: venta.descuento ?? 0,
        metodo_pago: venta.metodo_pago!,
        total: venta.total!,
        detalle_venta: venta.detalle_venta ?? [],
        cliente_nombre: (venta as any).cliente_nombre ?? "", // si no lo usas pon string vacío
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
        text: `Error: ${mensaje}`,
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
