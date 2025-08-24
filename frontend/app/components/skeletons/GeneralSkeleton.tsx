import React from "react";

const GeneralSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {/* Componente 1 */}
      <div className="h-8 bg-gray-300 rounded" />

      {/* Componente 2 */}
      <div className="h-6 bg-gray-300 rounded" />

      {/* Componente 3 */}
      <div className="h-20 bg-gray-300 rounded" />

      {/* Componente 4 */}
      <div className="h-10 bg-gray-300 rounded" />
    </div>
  );
};

export default GeneralSkeleton;
