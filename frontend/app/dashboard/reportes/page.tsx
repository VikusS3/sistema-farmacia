"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { downloadPdf } from "@/app/utils/downloadPdf";
import { useState } from "react";

function ReportesPage() {
  const [fecha_desde, setFecha_desde] = useState("");
  const [fecha_hasta, setFecha_hasta] = useState("");
  const [mesReporte, setMesReporte] = useState("");
  const [anioReporte, setAnioReporte] = useState("");
  const handleDownloadVentas = () => {
    const desde = fecha_desde;
    const hasta = fecha_hasta;
    downloadPdf(
      "/reportesPdf/reporte-ventas",
      { desde, hasta },
      `reporte-ventas-${desde}_al_${hasta}.pdf`
    );
  };

  const handleDownloadVentasMes = () => {
    const mes = mesReporte;
    const anio = anioReporte;
    downloadPdf(
      "/reportesPdf/reporte-ventas-mes",
      { mes, anio },
      `reporte-ventas-${mes}_al_${anio}.pdf`
    );
  };

  const handleDownloadVentasAnio = () => {
    const anio = anioReporte;
    downloadPdf(
      "/reportesPdf/reporte-ventas-anio",
      { anio },
      `reporte-ventas-${anio}.pdf`
    );
  };

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>

      <input
        type="date"
        value={fecha_desde}
        onChange={(e) => setFecha_desde(e.target.value)}
      />
      <input
        type="date"
        value={fecha_hasta}
        onChange={(e) => setFecha_hasta(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-2"
        onClick={handleDownloadVentas}
      >
        Descargar Reporte de Ventas
      </button>
      <select
        value={mesReporte}
        onChange={(e) => setMesReporte(e.target.value)}
      >
        <option value="">Seleccionar Mes</option>
        {months.map((month, index) => (
          <option key={index} value={index + 1}>
            {month}
          </option>
        ))}
      </select>
      <select
        value={anioReporte}
        onChange={(e) => setAnioReporte(e.target.value)}
      >
        <option value="">Seleccionar Año</option>
        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(
          (year) => (
            <option key={year} value={year}>
              {year}
            </option>
          )
        )}
      </select>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        onClick={handleDownloadVentasMes}
      >
        Descargar Reporte de Ventas por Mes
      </button>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        onClick={handleDownloadVentasAnio}
      >
        Descargar Reporte de Ventas por Anio
      </button>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <ReportesPage />
    </ProtectedRoute>
  );
}
