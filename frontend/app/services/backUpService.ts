import api from "../lib/axiosConfig";

export const createBackup = async () => {
    try {
        await api.post("/backup");
        alert("Backup creado correctamente");
    } catch (error) {
        console.error("Error al crear el backup:", error);
        alert("Error al crear el backup");
    }
};
