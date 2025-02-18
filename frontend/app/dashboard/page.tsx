"use client";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { usuarioData, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {usuarioData?.nombres}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
