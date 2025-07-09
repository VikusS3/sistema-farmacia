import { downloadPdf } from "@/app/utils/downloadPdf";
import { useState } from "react";

export const useReportes = () => {
  const [fecha_desde, setFecha_desde] = useState<string>("");
  const [fecha_hasta, setFecha_hasta] = useState<string>("");
  const [mesReporte, setMesReporte] = useState<string>("");
  const [anioReporteMes, setAnioReporteMes] = useState<string>("");
  const [anioReporte, setAnioReporte] = useState<string>("");

  const handleDownloadVentas = () => {
    downloadPdf(
      "/reportesPdf/reporte-ventas",
      { desde: fecha_desde, hasta: fecha_hasta },
      `reporte-ventas-${fecha_desde}_al_${fecha_hasta}.pdf`
    );
  };

  const handleDownloadVentasMes = () => {
    downloadPdf(
      "/reportesPdf/reporte-ventas-mes",
      { mes: mesReporte, anio: anioReporteMes },
      `reporte-ventas-${mesReporte}_al_${anioReporteMes}.pdf`
    );
  };

  const handleDownloadVentasAnio = () => {
    downloadPdf(
      "/reportesPdf/reporte-ventas-anio",
      { anio: anioReporte },
      `reporte-ventas-${anioReporte}.pdf`
    );
  };

  const handleDownloadInventario = () => {
    downloadPdf(
      "/reportesPdf/reporte-inventario",
      {},
      `reporte-inventario-${new Date().toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}.pdf`
    );
  };

  return {
    fecha_desde,
    fecha_hasta,
    mesReporte,
    anioReporteMes,
    anioReporte,
    handleDownloadVentas,
    handleDownloadVentasMes,
    handleDownloadVentasAnio,
    handleDownloadInventario,
    setFecha_desde,
    setFecha_hasta,
    setMesReporte,
    setAnioReporteMes,
    setAnioReporte,
  };
};
