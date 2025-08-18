"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";

function CategoriasPage() {
  return (
    <div className="p-6 bg-background-100 text-text-100 rounded-lg shadow-lg">
      {/* Título */}
      <h1 className="text-2xl font-bold mb-4 text-primary-200">Categorias</h1>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <CategoriasPage />
    </ProtectedRoute>
  );
}
