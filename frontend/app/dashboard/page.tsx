"use client";

import { useAuth } from "../hooks/auth/useAuth";
import ProtectedRoute from "../components/ProtectedRoute";

function DashboardContent() {
  const { handleLogout } = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      {/*Botón de prueba para hacer el backUp de la base de datos*/}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={async () => {
          const response = await fetch("http://localhost:5000/api/backup", {
            method: "POST",
          });
          if (response.ok) {
            alert("Backup creado correctamente");
          } else {
            alert("Error al crear el backup");
          }
        }}
      >
        Crear Backup
      </button>
      <button onClick={handleLogout}>Logout</button>
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
