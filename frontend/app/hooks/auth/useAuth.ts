/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAuth.tsx
import { useAuth as useAuthContext } from "@/app/context/AuthContext";
import api from "@/app/lib/axiosConfig";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ROLES_AUTH } from "@/app/constants/roles";

export const useAuth = () => {
  const { login, logout, isAuthenticated, loading } = useAuthContext();
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError("");
    try {
      const response = await api.post("/usuarios/login", {
        email,
        password,
      });

      const token = response.data.token;
      login(token); // Usar el contexto para setear el estado de autenticación

      localStorage.setItem("token", token);
      localStorage.setItem("usuario_id", response.data.usuario.id);
      localStorage.setItem("usuario", response.data.usuario.nombre);
      localStorage.setItem("rol", response.data.usuario.rol);

      MySwal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `Hola ${response.data.usuario.nombre}`,
        confirmButtonText: "Aceptar",
      });

      if (response.data.usuario.rol === ROLES_AUTH.EMPLEADO) {
        router.push("/dashboard-empleado/");
      } else {
        router.push("/dashboard/");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Error de login");
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error de login",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleLogout = () => {
    logout(); // Usar el contexto para cambiar el estado de autenticación
    localStorage.removeItem("token");
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    router.push("/");
  };

  return { loading, error, isAuthenticated, handleLogin, handleLogout };
};
