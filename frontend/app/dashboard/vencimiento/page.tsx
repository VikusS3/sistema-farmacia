"use client";
import ProductosVencimiento from "@/app/components/productos/ProductosVencimiento";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useProductosWhitExpired } from "@/app/hooks/productos/useProductosWhitExpired";
import { RefreshCcw } from "lucide-react";

export default function GestionProductosVencimiento() {
  const {
    loading,
    productosConVencimiento,
    refetch: refetchProductos,
  } = useProductosWhitExpired();

  if (loading) return <div>Loading...</div>;
  return (
    <ProtectedRoute>
      <div className="p-6 bg-background-100 text-text-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">
          Gestión de Vencimiento de Productos
        </h1>

        <button
          className="bg-primary-200 text-white py-2 px-4 rounded-lg hover:bg-primary-100 transition-all focus:ring-2 focus:ring-primary-300 mb-2 flex items-center gap-2"
          // onClick={() => refetchCajas()} esto da error se conjela la aplicacion
          onClick={() => refetchProductos()}
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Actualizar
        </button>
        <ProductosVencimiento productos={productosConVencimiento || []} />
      </div>
    </ProtectedRoute>
  );
}
