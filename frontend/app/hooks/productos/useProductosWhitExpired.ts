import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { fetchProductos } from "@/app/services/productosServices";
import { Productos } from "@/app/types";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export const useProductosWhitExpired = () => {
  const MySwal = withReactContent(Swal);

  const {
    data: productosConVencimiento = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Productos[], Error>({
    queryKey: ["productosConVencimiento"],
    queryFn: fetchProductos,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });

  if (error) {
    const mensajeError = extractErrorMessage(error);
    MySwal.fire({
      icon: "error",
      title: "Error al cargar productos con vencimiento",
      text: mensajeError,
    });
  }

  return { productosConVencimiento, loading, refetch };
};
