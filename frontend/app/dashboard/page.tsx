"use client";

import { useAuth } from "../hooks/auth/useAuth";
import ProtectedRoute from "../components/ProtectedRoute";
import { createBackup } from "../services/backUpService";

function DashboardContent() {
  const { handleLogout } = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      {/*Botón de prueba para hacer el backUp de la base de datos*/}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={createBackup}
      >
        Crear Backup
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
