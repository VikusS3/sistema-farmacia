/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCajaActivaByUser, cerrarCaja } from "@/app/services/cajaServices";
import Swal from "sweetalert2";

export function useCajaActiva(usuarioId: number) {
  const queryClient = useQueryClient();

  // Caja activa del usuario
  const {
    data: cajaActiva,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["caja-activa", usuarioId],
    queryFn: () => getCajaActivaByUser(usuarioId),
    enabled: !!usuarioId, // Evita consulta si no hay usuario logueado
  });

  // Cerrar caja activa
  const { mutate: cerrarCajaActiva, isPending: isClosing } = useMutation({
    mutationFn: cerrarCaja,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caja-activa"] });
      queryClient.invalidateQueries({ queryKey: ["cajas"] });
      Swal.fire("Éxito", "Caja cerrada correctamente", "success");
    },
    onError: (err: any) => {
      Swal.fire("Error", err.message || "No se pudo cerrar la caja", "error");
    },
  });

  return {
    cajaActiva,
    isLoading,
    isError,
    error,
    refetch,
    cerrarCajaActiva,
    isClosing,
  };
}
