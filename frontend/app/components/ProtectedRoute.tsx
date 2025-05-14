// src/components/ProtectedRoute.tsx
"use client";

import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/"); // Redirigir a login si no está autenticado
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>; // Mostrar un "loading" mientras se verifica la autenticación
  }

  return <>{children}</>;
};

export default ProtectedRoute;
