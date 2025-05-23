import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCajaActivaByUser,
  abrirCaja,
  cerrarCaja,
} from "@/app/services/cajaServices";
import { Caja } from "@/app/types";
import { extractErrorMessage } from "@/app/utils/errorHandler";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const useCajaActiva = (usuarioId: number) => {
  const queryClient = useQueryClient();

  // ✅ Obtener la caja activa del usuario
  const {
    data: cajaActiva,
    isLoading,
    error,
    refetch,
  } = useQuery<Caja | null, Error>({
    queryKey: ["caja-activa", usuarioId],
    queryFn: () => getCajaActivaByUser(usuarioId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // ✅ Mutación para abrir caja
  const abrirCajaMutation = useMutation({
    mutationFn: abrirCaja,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caja-activa", usuarioId] });
      MySwal.fire("Éxito", "Caja abierta correctamente", "success");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      MySwal.fire("Error", message, "error");
    },
  });

  // ✅ Mutación para cerrar caja
  const cerrarCajaMutation = useMutation({
    mutationFn: ({
      id,
      fecha_cierre,
      monto_cierre,
    }: {
      id: number;
      fecha_cierre?: string;
      monto_cierre: number;
    }) => cerrarCaja({ id, fecha_cierre: fecha_cierre || "", monto_cierre }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caja-activa", usuarioId] });
      MySwal.fire("Éxito", "Caja cerrada correctamente", "success");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      MySwal.fire("Error", message, "error");
    },
  });

  return {
    cajaActiva,
    isLoading,
    error,
    refetch,
    abrirCaja: abrirCajaMutation.mutate,
    cerrarCaja: cerrarCajaMutation.mutate,
    abrirCajaLoading: abrirCajaMutation.isPending,
    cerrarCajaLoading: cerrarCajaMutation.isPending,
  };
};
