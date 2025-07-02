import React from "react";
import { useTopProductosMasVendidos } from "@/app/hooks/dashboard/useEstadisticas";

export const PopularMedications = () => {
  const { data, isLoading, error } = useTopProductosMasVendidos();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error al cargar los productos mas vendidos</div>;
  }

  return (
    <div className="space-y-4">
      {data?.map((med, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {med.nombre} {med.unidad_medida}
            </p>
            <p className="text-sm text-gray-600">
              {med.unidades_vendidas} unidades vendidas
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-green-600">
              {med.cambio}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
