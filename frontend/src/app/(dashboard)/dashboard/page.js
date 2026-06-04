"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Activity,
  Clock,
  Pill,
  Bell,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { StatusDot } from "@/components/ui/StatusDot";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  productosService,
  ventasService,
  cajaService,
  alertasService,
} from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    productos: 0,
    bajoStock: 0,
    ventasHoy: 0,
    alertasNoLeidas: 0,
  });
  const [cajaAbierta, setCajaAbierta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, bajoStockRes, alertasRes] = await Promise.all([
          productosService.getAll(),
          productosService.getLowStock(),
          alertasService.getContador(),
        ]);

        const hoy = new Date().toISOString().split("T")[0];
        const ventasRes = await ventasService.getByDateRange(hoy, hoy);

        setStats({
          productos: productosRes.data.length || 0,
          bajoStock: bajoStockRes.data.length || 0,
          ventasHoy: ventasRes.data.reduce(
            (sum, v) => sum + Number(v.total || 0),
            0,
          ),
          alertasNoLeidas: alertasRes.data.count || 0,
        });
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
      }
      try {
        const cajaRes = user
          ? await cajaService.getAbierta(user.id)
          : { data: { hasOpenCaja: false } };
        setCajaAbierta(cajaRes.data);
      } catch (e) {
        console.warn("No hay caja abierta:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <LoadingState type="card" />;
  }

  const statCards = [
    {
      title: "Total Productos",
      value: stats.productos,
      icon: Pill,
      variant: "blue",
    },
    {
      title: "Bajo Stock",
      value: stats.bajoStock,
      icon: AlertTriangle,
      variant: "amber",
    },
    {
      title: "Ventas de Hoy",
      value: `$${stats.ventasHoy.toFixed(2)}`,
      icon: DollarSign,
      variant: "emerald",
    },
    {
      title: "Alertas",
      value: stats.alertasNoLeidas,
      icon: Bell,
      variant: "red",
    },
  ];

  const colorMap = {
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    red: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-zinc-500">
            Bienvenido de nuevo,{" "}
            <span className="text-emerald-400 font-medium">
              {user?.nombre || user?.email}
            </span>
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">
            Sincronizado
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          const colors = colorMap[card.variant];
          return (
            <Card key={card.title} hover>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                    {card.title}
                  </p>
                  <p
                    className={`text-2xl font-black tracking-tight ${colors.text}`}
                  >
                    {card.value}
                  </p>
                </div>
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${colors.bg} ${colors.border}`}
                >
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Clock className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Estado de Caja Operativa
              </h2>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              La gestión de caja permite registrar ingresos y egresos en tiempo
              real. Es indispensable para procesar ventas en el punto de cobro.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-950/50 p-5 rounded-2xl border border-zinc-800/50 backdrop-blur-sm w-full sm:w-auto">
            {cajaAbierta?.hasOpenCaja ? (
              <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <StatusDot active pulse variant="success" />
                <div className="flex flex-col">
                  <span className="font-bold uppercase text-[10px] tracking-widest text-emerald-400">
                    Caja abierta
                  </span>
                  <span className="text-[11px] text-emerald-400/70">
                    Sesión activa
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <StatusDot active pulse variant="warning" />
                <div className="flex flex-col">
                  <span className="font-bold uppercase text-[10px] tracking-widest text-amber-400">
                    Sin caja abierta
                  </span>
                  <span className="text-[11px] text-amber-400/70">
                    Acción requerida
                  </span>
                </div>
              </div>
            )}
            <Button
              variant={cajaAbierta?.hasOpenCaja ? "secondary" : "primary"}
              className="w-full sm:w-auto"
              onClick={() => router.push("/caja")}
            >
              {cajaAbierta?.hasOpenCaja ? "Cerrar Caja" : "Abrir Caja"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
