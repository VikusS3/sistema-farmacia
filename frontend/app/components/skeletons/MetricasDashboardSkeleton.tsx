import React from "react";

const MetricasDashboardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6 p-4">
      {/* Filas de 3 tarjetas pequeñas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-gray-300 rounded" />
              <div className="h-4 w-4 bg-gray-300 rounded-full" />
            </div>
            <div className="mt-2">
              <div className="h-8 w-24 bg-gray-300 rounded" />
              <div className="h-3 w-32 bg-gray-300 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Tarjetas grandes debajo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-48 bg-gray-200 rounded-lg" />
        <div className="h-48 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default MetricasDashboardSkeleton;
