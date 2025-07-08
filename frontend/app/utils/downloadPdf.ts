import api from "@/app/lib/axiosConfig";

export const downloadPdf = async (
  endpoint: string,
  params: Record<string, string>,
  filename: string
) => {
  try {
    const response = await api.get(endpoint, {
      params,
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar el PDF:", error);
    alert("Ocurrió un error al descargar el PDF.");
  }
};
