"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useCajas } from "@/app/hooks/cajas/useCajas";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import dayjs from "dayjs";
import { Caja } from "@/app/types";

export default function GestionCajasPage() {
  const { cajas, isCajasLoading, isCajasError, cajasError, refetchCajas } =
    useCajas();
  const [pageIndex, setPageIndex] = useState(0);

  if (isCajasLoading) return <div>Loading...</div>;
  if (isCajasError) return <div>Error: {cajasError?.message}</div>;

  const pageSize = 10;
  const totalPages = Math.ceil(cajas?.length || 0 / pageSize);
  const startIndex = pageIndex * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageItems = cajas?.slice(startIndex, endIndex);

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  return (
    <ProtectedRoute>
      <div className="p-8 bg-white text-gray-800 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Gestión de Cajas</h1>
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => refetchCajas()}
            aria-label="Actualizar lista de cajas"
          >
            <RefreshCcw className="w-5 h-5" />
            Actualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white text-left">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha Apertura</th>
                <th className="px-4 py-3">Monto Apertura</th>
                <th className="px-4 py-3">Fecha Cierre</th>
                <th className="px-4 py-3">Monto Cierre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentPageItems?.map((caja: Caja) => (
                <tr
                  key={caja.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 py-3">{caja.id}</td>
                  <td className="px-4 py-3">{caja.estado}</td>
                  <td className="px-4 py-3">
                    {dayjs(caja.fecha_apertura).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="px-4 py-3">{caja.monto_apertura}</td>
                  <td className="px-4 py-3">
                    {dayjs(caja.fecha_cierre).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="px-4 py-3">{caja.monto_cierre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            aria-label="Página anterior"
          >
            &lt;
          </button>
          {[...Array(totalPages).keys()].map((i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-md ${
                i === pageIndex
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
              onClick={() => handlePageChange(i)}
              aria-label={`Página ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={pageIndex === totalPages - 1}
            aria-label="Página siguiente"
          >
            &gt;
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
