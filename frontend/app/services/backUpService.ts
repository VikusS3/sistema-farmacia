import api from "../lib/axiosConfig";
import Swal from "sweetalert2";

export const createBackup = async () => {
  try {
    await api.post("/backup");
    Swal.fire("Éxito", "Backup creado correctamente", "success");
  } catch (error) {
    console.error("Error al crear el backup:", error);
    Swal.fire("Error", "Error al crear el backup", "error");
  }
};
