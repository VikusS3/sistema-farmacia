/* utils/errorHandler.ts */
import { AxiosError } from "axios";

interface BackendErrorResponse {
  error?: string;
  message?: string;
}

export const extractErrorMessage = (error: unknown): string => {
  if ((error as AxiosError)?.response?.data) {
    const axiosError = error as AxiosError;
    const backendError =
      (axiosError.response?.data as BackendErrorResponse)?.error ||
      (axiosError.response?.data as BackendErrorResponse)?.message;

    // Si el backend envía un array de errores, usa el primero
    if (Array.isArray(backendError)) {
      return backendError[0]?.message || "Error desconocido del servidor";
    }

    return backendError || "Error desconocido del servidor";
  }

  // Si el error no proviene de Axios
  return (error as Error)?.message || "Ocurrió un error inesperado";
};
