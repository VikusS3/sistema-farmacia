import { useQuery } from "@tanstack/react-query";
import { fetchCaja } from "@/app/services/cajaServices";
import { Caja } from "@/app/types";

//PROBALMENTE NUNCA LO USE :v
export const useCajaDetails = (cajaId: number | null | undefined) => {
  const {
    data: cajaDetalles,
    isLoading: isCajaDetailsLoading,
    error: cajaDetailsError,
    refetch: refetchCajaDetails,
    isError: isCajaDetailsError,
  } = useQuery<Caja, Error>({
    queryKey: ["caja-details", cajaId],
    queryFn: () => {
      if (cajaId === null || cajaId === undefined) {
        throw new Error("El ID de la caja no puede ser nulo o indefinido.");
      }
      return fetchCaja(cajaId);
    },
    enabled: !!cajaId && cajaId > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return {
    cajaDetalles,
    isCajaDetailsLoading,
    cajaDetailsError,
    refetchCajaDetails,
    isCajaDetailsError,
  };
};
