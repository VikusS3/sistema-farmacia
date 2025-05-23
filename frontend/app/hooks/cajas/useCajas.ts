import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { abrirCaja, cerrarCaja, fetchCajas } from "@/app/services/cajaServices";
import { Caja } from "@/app/types";
import { extractErrorMessage } from "@/app/utils/errorHandler";

const MySwal = withReactContent(Swal);

export const useCajas = () => {
  const queryClient = useQueryClient();

  // Obtener lista de cajas
  const {
    data: cajas,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Caja[], Error>({
    queryKey: ["cajas"],
    queryFn: fetchCajas,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Mutación para abrir caja
  const abrirCajaMutation = useMutation({
    mutationFn: abrirCaja,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cajas"] });
      MySwal.fire("Éxito", "Caja abierta correctamente", "success");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      MySwal.fire("Error", message, "error");
    },
  });

  // Mutación para cerrar caja
  const cerrarCajaMutation = useMutation({
    mutationFn: ({
      id,
      fecha_cierre,
      monto_cierre,
    }: {
      id: number;
      fecha_cierre?: string;
      monto_cierre: number;
    }) =>
      cerrarCaja({
        id,
        fecha_cierre: fecha_cierre || "",
        monto_cierre,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cajas"] });
      MySwal.fire("Éxito", "Caja cerrada correctamente", "success");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      MySwal.fire("Error", message, "error");
    },
  });

  return {
    cajas,
    loading,
    error,
    refetch,
    abrirCaja: abrirCajaMutation.mutate,
    abrirCajaStatus: abrirCajaMutation.status,
    cerrarCaja: cerrarCajaMutation.mutate,
    cerrarCajaStatus: cerrarCajaMutation.status,
  };
};
