"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useCajas } from "@/app/hooks/cajas/useCajas";
import { RefreshCcw } from "lucide-react";

export default function GestionCajasPage() {
  const { cajas, isCajasLoading, isCajasError, cajasError, refetchCajas } =
    useCajas();

  if (isCajasLoading) return <div>Loading...</div>;
  if (isCajasError) return <div>Error: {cajasError?.message}</div>;
  return (
    <ProtectedRoute>
      <div className="p-6 bg-background-100 text-text-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Gestión de Cajas</h1>

        <button
          className="bg-primary-200 text-white py-2 px-4 rounded-lg hover:bg-primary-100 transition-all focus:ring-2 focus:ring-primary-300 mb-2 flex items-center gap-2"
          onClick={() => refetchCajas()}
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Actualizar
        </button>
        <pre>{JSON.stringify(cajas?.slice(0, 3), null, 2)}</pre>

        {/* <CajaList cajas={cajas || []} /> */}
      </div>
    </ProtectedRoute>
  );
}
