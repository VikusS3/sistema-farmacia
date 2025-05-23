"use client";

import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/"); // Solo redirige si NO está cargando y NO autenticado
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Mostrar mientras verificamos el token
  }

  if (!isAuthenticated) {
    return null; // Evitar renderizar contenido protegido mientras redirige
  }

  return <>{children}</>;
};

export default ProtectedRoute;
