import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCajaActivaByUser,
  abrirCaja,
  cerrarCaja,
} from "@/app/services/cajaServices";
import {
  Caja,
  AbrirCajaInput,
  CerrarCajaInput,
  CajaActivaResponse,
} from "@/app/types"; // 👈 Importar CajaActivaResponse
import { extractErrorMessage } from "@/app/utils/errorHandler";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const useCajaActiva = (usuarioId: number) => {
  const queryClient = useQueryClient();

  const {
    data: cajaActiva,
    isLoading,
    error,
    refetch,
    isError,
  } = useQuery<CajaActivaResponse | null, Error>({
    queryKey: ["caja-activa", usuarioId],
    queryFn: () => getCajaActivaByUser(usuarioId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true, //ver si cambiarlo a false a futuro
    enabled: !!usuarioId,
  });

  // ✅ Mutación para abrir caja
  const abrirCajaMutation = useMutation<
    { id: number; message: string },
    Error,
    AbrirCajaInput
  >({
    mutationFn: abrirCaja,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["caja-activa", usuarioId] });
    },
    onSuccess: () => {
      MySwal.fire("Éxito", "Caja abierta correctamente", "success");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      MySwal.fire("Error", message, "error");
    },
  });

  // ✅ Mutación para cerrar caja
  const cerrarCajaMutation = useMutation<Caja, Error, CerrarCajaInput>({
    mutationFn: cerrarCaja,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["caja-activa", usuarioId] });
    },
    onSuccess: () => {
      MySwal.fire("Éxito", "Caja cerrada correctamente", "success");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      MySwal.fire("Error", message, "error");
    },
  });

  return {
    cajaActiva,
    isCajaLoading: isLoading,
    isCajaError: isError,
    cajaError: error,
    refetchCaja: refetch,

    abrirCaja: abrirCajaMutation.mutate,
    cerrarCaja: cerrarCajaMutation.mutate,

    abrirCajaLoading: abrirCajaMutation.isPending,
    abrirCajaSuccess: abrirCajaMutation.isSuccess,
    abrirCajaError: abrirCajaMutation.isError,

    cerrarCajaLoading: cerrarCajaMutation.isPending,
    cerrarCajaSuccess: cerrarCajaMutation.isSuccess,
    cerrarCajaError: cerrarCajaMutation.isError,
  };
};
