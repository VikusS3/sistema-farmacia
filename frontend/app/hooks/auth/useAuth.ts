/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/app/lib/axiosConfig";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Usuario } from "@/app/types";

export const useAuth = () => {
  const [usuarioData, setUsuarioData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);

  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/usuarios/login", {
        email,
        password,
      });

      // Guardar todo el objeto del usuario
      const usuarioData = response.data.usuario.nombres;
      setUsuarioData(usuarioData);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.usuario.nombres)
      );
      localStorage.setItem("usuario_id", response.data.usuario.id);
      localStorage.setItem("token", response.data.token);

      MySwal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `Hola ${response.data.usuario.nombres}`,
        confirmButtonText: "Aceptar",
      });
      router.push("/dashboard/");
    } catch (error: any) {
      console.error(error.response.data.message);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuarioData(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  return { usuarioData, loading, error, login, logout };
};
