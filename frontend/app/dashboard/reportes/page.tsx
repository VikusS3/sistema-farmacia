"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { months } from "@/app/constants/reportes";
import { useReportes } from "@/app/hooks/reportes/useReportes";

function ReportesPage() {
  const {
    handleDownloadVentas,
    handleDownloadVentasMes,
    handleDownloadVentasAnio,
    fecha_desde,
    fecha_hasta,
    mesReporte,
    anioReporteMes,
    anioReporte,
    handleDownloadInventario,
    setFecha_desde,
    setFecha_hasta,
    setMesReporte,
    setAnioReporteMes,
    setAnioReporte,
  } = useReportes();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">📄 Reportes</h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6 border">
        {/* Reporte por Rango de Fechas */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-gray-800">
            Por Rango de Fechas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={fecha_desde}
              onChange={(e) => setFecha_desde(e.target.value)}
              className="input-style"
              placeholder="Desde"
            />
            <input
              type="date"
              value={fecha_hasta}
              onChange={(e) => setFecha_hasta(e.target.value)}
              className="input-style"
              placeholder="Hasta"
            />
          </div>
          <button onClick={handleDownloadVentas} className="btn-primary">
            Descargar Reporte de Ventas
          </button>
        </div>

        {/* Reporte por Mes */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-gray-800">Por Mes y Año</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={mesReporte}
              onChange={(e) => setMesReporte(e.target.value)}
              className="input-style"
            >
              <option value="">Seleccionar Mes</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={anioReporteMes}
              onChange={(e) => setAnioReporteMes(e.target.value)}
              className="input-style"
            >
              <option value="">Seleccionar Año</option>
              {Array.from(
                { length: 10 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              console.log("Descargando Reporte por Mes");
              handleDownloadVentasMes();
            }}
            className="btn-secondary"
          >
            Descargar Reporte por Mes
          </button>
        </div>

        {/* Reporte por Año */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-gray-800">Solo Año</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={anioReporte}
              onChange={(e) => setAnioReporte(e.target.value)}
              className="input-style"
            >
              <option value="">Seleccionar Año</option>
              {Array.from(
                { length: 10 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleDownloadVentasAnio} className="btn-secondary">
            Descargar Reporte por Año
          </button>
        </div>

        {/* Reporte de Inventario */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-gray-800">Inventario</h2>
          <button onClick={handleDownloadInventario} className="btn-secondary">
            Descargar Reporte de Inventario
          </button>
        </div>
      </div>
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
