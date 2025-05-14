// src/hooks/useAuth.tsx
import { useAuth as useAuthContext } from "@/app/context/AuthContext";
import api from "@/app/lib/axiosConfig";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const useAuth = () => {
  const { login, logout, isAuthenticated } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
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

      MySwal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `Hola ${response.data.usuario.nombres}`,
        confirmButtonText: "Aceptar",
      });

      router.push("/dashboard/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response?.data?.message || "Error de login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout(); // Usar el contexto para cambiar el estado de autenticación
    localStorage.removeItem("token");
    localStorage.removeItem("usuario_id");
    router.push("/");
  };

  return { loading, error, isAuthenticated, handleLogin, handleLogout };
};
