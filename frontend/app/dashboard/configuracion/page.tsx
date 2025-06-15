"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { createBackup } from "@/app/services/backUpService";

export default function GestionCajasPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        {/*Botón de prueba para hacer el backUp de la base de datos*/}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={createBackup}
        >
          Crear Backup
        </button>
      </div>
    </ProtectedRoute>
  );
}
