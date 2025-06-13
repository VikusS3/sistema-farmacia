import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { abrirCaja, cerrarCaja, fetchCajas } from "@/app/services/cajaServices";
import {
  Caja,
  AbrirCajaInput,
  CerrarCajaInput,
  AbrirCajaResponse,
} from "@/app/types";
import { extractErrorMessage } from "@/app/utils/errorHandler";
import { useEffect } from "react";

const MySwal = withReactContent(Swal);

export const useCajas = () => {
  const queryClient = useQueryClient();

  // ✅ Obtener lista de cajas
  const {
    data: cajas,
    isLoading: isCajasLoading,
    error: cajasError,
    isError: isCajasError,
    refetch: refetchCajas,
  } = useQuery<Caja[], Error>({
    queryKey: ["cajas"],
    queryFn: fetchCajas,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // ✅ Mutación para abrir caja
  const abrirCajaMutation = useMutation<
    AbrirCajaResponse,
    Error,
    AbrirCajaInput
  >({
    mutationFn: abrirCaja,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cajas"] });
      if (data?.id && data.message) {
        queryClient.invalidateQueries({ queryKey: ["caja-activa", data.id] });
      }
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
    onSuccess: (closedCaja) => {
      queryClient.invalidateQueries({ queryKey: ["cajas"] });
      if (closedCaja?.usuario_id) {
        queryClient.invalidateQueries({
          queryKey: ["caja-activa", closedCaja.usuario_id],
        });
      }
      MySwal.fire("Éxito", "Caja cerrada correctamente", "success");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      MySwal.fire("Error", message, "error");
    },
  });

  useEffect(() => {
    fetchCajas().then((data) => console.log("CAJAS:", data));
  }, []);

  return {
    cajas,
    isCajasLoading,
    isCajasError,
    cajasError,
    refetchCajas,

    abrirCaja: abrirCajaMutation.mutate,
    cerrarCaja: cerrarCajaMutation.mutate,

    isAbrirCajaLoading: abrirCajaMutation.isPending,
    isAbrirCajaSuccess: abrirCajaMutation.isSuccess,
    isAbrirCajaError: abrirCajaMutation.isError,

    isCerrarCajaLoading: cerrarCajaMutation.isPending,
    isCerrarCajaSuccess: cerrarCajaMutation.isSuccess,
    isCerrarCajaError: cerrarCajaMutation.isError,
  };
};
