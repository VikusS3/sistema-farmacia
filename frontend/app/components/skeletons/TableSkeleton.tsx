import React from "react";

interface TableSkeletonProps {
  rows?: number; // cantidad de filas de placeholder
  columns?: number; // cantidad de columnas de placeholder
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="w-full border rounded-md overflow-hidden">
      <div className="animate-pulse">
        {/* Cabecera */}
        <div className="flex border-b bg-gray-200">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-6 w-full bg-gray-300 m-2 rounded" />
          ))}
        </div>

        {/* Filas */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex border-b last:border-b-0">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-5 w-full bg-gray-200 m-2 rounded"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
