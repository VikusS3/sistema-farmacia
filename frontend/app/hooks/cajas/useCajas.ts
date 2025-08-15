// src/hooks/useCaja.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  fetchCajas,
  fetchCaja,
  abrirCaja,
  cerrarCaja,
  getCajaActivaByUser,
} from "@/app/services/cajaServices";
import {
  Caja,
  AbrirCajaInput,
  CerrarCajaInput,
  AbrirCajaResponse,
  CajaActivaResponse,
} from "@/app/types";

// 📦 Lista de todas las cajas
export const useCajas = () => {
  return useQuery<Caja[]>({
    queryKey: ["cajas"],
    queryFn: fetchCajas,
  });
};

// 📦 Detalle de una caja
export const useCajaById = (id: number) => {
  return useQuery<Caja>({
    queryKey: ["caja", id],
    queryFn: () => fetchCaja(id),
    enabled: !!id,
  });
};

// 📦 Caja activa de un usuario
export const useCajaActiva = (usuarioId?: number) => {
  return useQuery<CajaActivaResponse | null>({
    queryKey: ["cajaActiva", usuarioId],
    queryFn: () => getCajaActivaByUser(usuarioId!),
    enabled: typeof usuarioId === "number" && usuarioId > 0, // evita llamar si es null o undefined
    refetchOnWindowFocus: false,
  });
};

// 🚀 Mutaciones de apertura y cierre
export const useCajaMutations = (usuarioId?: number) => {
  const queryClient = useQueryClient();

  const abrirCajaMutation = useMutation<
    AbrirCajaResponse,
    Error,
    AbrirCajaInput
  >({
    mutationFn: abrirCaja,
    onSuccess: () => {
      Swal.fire(
        "Caja abierta",
        "La caja se ha abierto correctamente",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["cajas"] });
      queryClient.invalidateQueries({ queryKey: ["cajaActiva", usuarioId] });
    },
    onError: (error) => {
      Swal.fire("Error", error.message, "error");
    },
  });

  const cerrarCajaMutation = useMutation<Caja, Error, CerrarCajaInput>({
    mutationFn: cerrarCaja,
    onSuccess: () => {
      Swal.fire(
        "Caja cerrada",
        "La caja se ha cerrado correctamente",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["cajas"] });
      queryClient.invalidateQueries({ queryKey: ["cajaActiva", usuarioId] });
    },
    onError: (error) => {
      Swal.fire("Error", error.message, "error");
    },
  });

  return {
    abrirCaja: abrirCajaMutation.mutateAsync,
    cerrarCaja: cerrarCajaMutation.mutateAsync,
    isLoadingAbrir: abrirCajaMutation.isPending,
    isLoadingCerrar: cerrarCajaMutation.isPending,
  };
};
