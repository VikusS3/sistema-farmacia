"use client";

import { useAuth } from "../hooks/auth/useAuth";

export default function DashboardPage() {
  const { logout } = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      {/*Botn de prueba para hacer el backUp de la base de datos*/}

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
      <button onClick={logout}>Logout</button>
    </div>
  );
}
