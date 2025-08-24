/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../lib/axiosConfig";
import Swal from "sweetalert2";

export const createBackup = async () => {
  try {
    // Mostrar loading
    Swal.fire({
      title: "Creando backup...",
      html: "Por favor espera mientras se genera el backup de la base de datos.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await api.post(
      "/backup",
      {},
      {
        responseType: "blob",
        timeout: 60000, // 60 segundos de timeout para backups grandes
      }
    );

    // Obtener el nombre del archivo desde los headers
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "backup.sql";

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      );
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1].replace(/['"]/g, "");
      }
    }

    // Crear blob y URL para descarga
    const blob = new Blob([response.data], {
      type: "application/sql",
    });
    const url = window.URL.createObjectURL(blob);

    // Crear elemento de descarga
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);

    // Agregar al DOM temporalmente y hacer click
    document.body.appendChild(link);
    link.click();

    // Limpiar
    link.remove();
    window.URL.revokeObjectURL(url);

    // Cerrar loading y mostrar éxito
    Swal.close();
    await Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "Backup creado y descargado correctamente",
      timer: 3000,
      showConfirmButton: false,
    });
  } catch (error: any) {
    // Cerrar loading
    Swal.close();

    console.error("Error al crear el backup:", error);

    let errorMessage = "Error desconocido al crear el backup";

    if (error.response) {
      // Error del servidor
      if (error.response.status === 500) {
        errorMessage = "Error interno del servidor al generar el backup";
      } else if (error.response.status === 404) {
        errorMessage = "Endpoint de backup no encontrado";
      } else {
        errorMessage = `Error del servidor: ${error.response.status}`;
      }
    } else if (error.request) {
      // Error de red
      errorMessage = "Error de conexión. Verifica tu conexión a internet.";
    } else if (error.code === "ECONNABORTED") {
      // Timeout
      errorMessage = "El backup está tomando mucho tiempo. Intenta nuevamente.";
    }

    await Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
      confirmButtonText: "Entendido",
    });
  }
};
