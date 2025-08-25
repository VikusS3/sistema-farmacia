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

  // Validaciones para habilitar botones
  const isRangoFechasValid =
    fecha_desde && fecha_hasta && fecha_desde <= fecha_hasta;
  const isMesAnioValid = mesReporte && anioReporteMes;
  const isAnioValid = anioReporte;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            📊 Reportes
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Genera y descarga reportes de ventas e inventario
          </p>
        </div>

        {/* Grid de Reportes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card: Reporte por Rango de Fechas */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Ventas por Rango de Fechas
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Fecha desde
                    </label>
                    <input
                      type="date"
                      value={fecha_desde}
                      onChange={(e) => setFecha_desde(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Fecha hasta
                    </label>
                    <input
                      type="date"
                      value={fecha_hasta}
                      onChange={(e) => setFecha_hasta(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {!isRangoFechasValid && (fecha_desde || fecha_hasta) && (
                  <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex">
                      <svg
                        className="w-4 h-4 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Selecciona ambas fechas y verifica que la fecha inicial
                      sea anterior a la final
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDownloadVentas}
                  disabled={!isRangoFechasValid}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isRangoFechasValid
                    ? "Descargar Reporte"
                    : "Completa las fechas"}
                </button>
              </div>
            </div>
          </div>

          {/* Card: Reporte por Mes y Año */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Ventas por Mes y Año
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Mes
                    </label>
                    <select
                      value={mesReporte}
                      onChange={(e) => setMesReporte(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    >
                      <option value="">Seleccionar mes</option>
                      {months.map((month, index) => (
                        <option key={index} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Año
                    </label>
                    <select
                      value={anioReporteMes}
                      onChange={(e) => setAnioReporteMes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    >
                      <option value="">Seleccionar año</option>
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
                </div>

                {!isMesAnioValid && (mesReporte || anioReporteMes) && (
                  <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex">
                      <svg
                        className="w-4 h-4 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Selecciona tanto el mes como el año
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDownloadVentasMes}
                  disabled={!isMesAnioValid}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {isMesAnioValid
                    ? "Descargar Reporte"
                    : "Selecciona mes y año"}
                </button>
              </div>
            </div>
          </div>

          {/* Card: Reporte por Año */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Ventas por Año
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Año
                  </label>
                  <select
                    value={anioReporte}
                    onChange={(e) => setAnioReporte(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                  >
                    <option value="">Seleccionar año</option>
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

                {!isAnioValid && anioReporte && (
                  <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex">
                      <svg
                        className="w-4 h-4 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Selecciona un año
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDownloadVentasAnio}
                  disabled={!isAnioValid}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  {isAnioValid ? "Descargar Reporte" : "Selecciona un año"}
                </button>
              </div>
            </div>
          </div>

          {/* Card: Reporte de Inventario */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Reporte de Inventario
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Descarga el reporte completo del inventario actual con todos
                  los productos y sus cantidades.
                </p>

                <button
                  onClick={handleDownloadInventario}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Descargar Inventario
                </button>
              </div>
            </div>
          </div>
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
