import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  createCompra,
  deleteCompra,
  fetchCompras,
  fetchComprasConProductos,
  updateCompra,
} from "@/app/services/compraServices";
import { Compra, DetalleCompra } from "@/app/types";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useCompras = () => {
  const MySwal = withReactContent(Swal);
  const queryClient = useQueryClient();

  const {
    data: compras = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Compra[], Error>({
    queryKey: ["compras"],
    queryFn: fetchCompras,
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });

  const addCompra = async (compra: Partial<Compra>) => {
    try {
      const compraData = {
        ...compra,
        detalle_compra: compra.detalle_compra ?? [],
      } as Omit<Compra, "id" | "creado_en" | "actualizado_en"> & {
        detalle_compra: Omit<DetalleCompra, "id" | "compra_id">[];
      };

      await createCompra(compraData);
      await queryClient.invalidateQueries({
        queryKey: ["compras"],
      });
    } catch (error) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al crear compra",
        text: mensajeError,
      });
    }
  };

  const actualizarCompra = async (
    id: number,
    compra: Partial<Compra> & { detalle_compra?: DetalleCompra[] }
  ) => {
    try {
      await updateCompra(id, compra);
      await queryClient.invalidateQueries({
        queryKey: ["compras"],
      });

      MySwal.fire("Actualizado", "La compra ha sido actualizada", "success");
    } catch (error) {
      const mensajeError = extractErrorMessage(error);
      MySwal.fire({
        icon: "error",
        title: "Error al actualizar compra",
        text: mensajeError,
      });
    }
  };

  const eliminarCompra = async (id: number) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        await deleteCompra(id);
        await queryClient.invalidateQueries({
          queryKey: ["compras"],
        });

        MySwal.fire("Eliminado", "La compra ha sido eliminada", "success");
      } catch (error) {
        const mensajeError = extractErrorMessage(error);
        MySwal.fire({
          icon: "error",
          title: "Error al eliminar compra",
          text: mensajeError,
        });
      }
    }
  };

  return {
    compras,
    loading,
    error: error ? error.message : "",
    addCompra,
    actualizarCompra,
    eliminarCompra,
    fetchComprasConProductos,
    fetchCompras,
    refetch,
  };
};
