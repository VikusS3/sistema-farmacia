import { useQuery } from "@tanstack/react-query";
import {
  getTopProductosMasVendidos,
  getVentasMensuales,
  getMetricasDashboard,
} from "@/app/services/reporteService";

export const useTopProductosMasVendidos = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["top-productos"],
    queryFn: getTopProductosMasVendidos,
  });

  return { data, isLoading, error };
};

export const useVentasMensuales = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ventas-mensuales"],
    queryFn: getVentasMensuales,
  });

  return { data, isLoading, error };
};

export const useMetricasDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["metricas-dashboard"],
    queryFn: getMetricasDashboard,
  });

  return { data, isLoading, error };
};
