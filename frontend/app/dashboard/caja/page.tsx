"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import CajaPage from "@/app/components/caja/CajaPage";

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="p-6 font-sans max-w-4xl mx-auto bg-background-200 shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold mb-6">Gestión de Caja</h1>
        <CajaPage />
      </div>
    </ProtectedRoute>
  );
}
