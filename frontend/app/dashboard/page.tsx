"use client";

import { MetricasCard } from "../components/dashboard/MetricasCard";
import { PopularMedications } from "../components/dashboard/PopularMedications";
import { SalesChart } from "../components/dashboard/VentasChart";
import ProtectedRoute from "../components/ProtectedRoute";
import { useMetricasDashboard } from "../hooks/dashboard/useEstadisticas";
import {
  DollarSign,
  Package,
  FileText,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
function DashboardContent() {
  const { data: metrics, isLoading, error } = useMetricasDashboard();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error al cargar las métricas</div>;
  }

  const mappedMetrics = [
    {
      title: "Ganancias Totales",
      value: metrics?.ventasTotales?.value
        ? `$${parseFloat(metrics?.ventasTotales?.value as string).toFixed(2)}`
        : "$0.00",
      change: `${
        metrics?.ventasTotales?.change === undefined
          ? ""
          : metrics?.ventasTotales.change > 0
          ? "+"
          : ""
      }${metrics?.ventasTotales?.change.toFixed(1)}%`,
      changeType: metrics?.ventasTotales?.changeType,
      icon: DollarSign,
    },
    {
      title: "Ventas",
      value: metrics?.prescripciones?.value
        ? metrics?.prescripciones?.value.toLocaleString()
        : "0",
      change: `${
        metrics?.prescripciones?.change === undefined
          ? ""
          : metrics?.prescripciones.change > 0
          ? "+"
          : ""
      }${metrics?.prescripciones?.change}`,
      changeType: metrics?.prescripciones?.changeType,
      icon: FileText,
    },
    {
      title: "Inventario Activo",
      value: metrics?.inventarioActivo?.value.toLocaleString(),
      change: `${
        metrics?.inventarioActivo?.change === undefined
          ? ""
          : metrics?.inventarioActivo.change > 0
          ? "+"
          : ""
      }${metrics?.inventarioActivo?.change}`,
      changeType: metrics?.inventarioActivo?.changeType,
      icon: Package,
    },
    {
      title: "Valor Inventario",
      value: `S/.${metrics?.valorInventarioTotal?.value.toLocaleString()}`,
      change: `${
        metrics?.valorInventarioTotal?.change === undefined
          ? ""
          : metrics?.valorInventarioTotal.change > 0
          ? "+"
          : ""
      }${metrics?.valorInventarioTotal?.change}`,
      changeType: metrics?.valorInventarioTotal?.changeType,
      icon: DollarSign,
    },

    {
      title: "Margen de Ganancia",
      value: `${metrics?.margenGanancia?.value.toFixed(1)}%`,
      change: `${
        metrics?.margenGanancia?.change === undefined
          ? ""
          : metrics?.margenGanancia.change > 0
          ? "+"
          : ""
      }${metrics?.margenGanancia?.change.toFixed(1)}%`,
      changeType: metrics?.margenGanancia?.changeType,
      icon: TrendingUp,
    },
    {
      title: "Stock Bajo",
      value: metrics?.stockBajo?.value.toString(),
      change: `${
        metrics?.stockBajo?.change === undefined
          ? ""
          : metrics?.stockBajo.change > 0
          ? "+"
          : ""
      }${metrics?.stockBajo?.change}`,
      changeType: metrics?.stockBajo?.changeType,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gray-50 min-h-screen rounded-lg">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard de Farmacia
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Última actualización: hace 5 min
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mappedMetrics?.map((metric, index) => (
          <MetricasCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-white rounded-lg shadow-md p-4">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Ventas Mensuales
            </h2>
          </header>
          <div className="mt-4">
            <SalesChart />
          </div>
        </div>
        <div className="col-span-3 bg-white rounded-lg shadow-md p-4">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Medicamentos Populares
            </h2>
          </header>
          <div className="mt-4">
            <PopularMedications />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
