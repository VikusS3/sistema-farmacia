"use client";

import { MetricasCard } from "../components/dashboard/MetricasCard";
import { PopularMedications } from "../components/dashboard/PopularMedications";
import { SalesChart } from "../components/dashboard/VentasChart";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  DollarSign,
  Package,
  FileText,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
function DashboardContent() {
  const metrics = [
    {
      title: "Ventas Totales",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Prescripciones",
      value: "2,350",
      change: "+180",
      changeType: "positive" as const,
      icon: FileText,
    },
    {
      title: "Inventario Activo",
      value: "12,234",
      change: "-19",
      changeType: "negative" as const,
      icon: Package,
    },
    {
      title: "Pacientes",
      value: "3,456",
      change: "+201",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Margen de Ganancia",
      value: "24.5%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Stock Bajo",
      value: "23",
      change: "+5",
      changeType: "warning" as const,
      icon: AlertTriangle,
    },
  ];
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gray-50 min-h-screen">
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
        {metrics.map((metric, index) => (
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

      <div className="grid gap-4 md:grid-cols-2"></div>
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
