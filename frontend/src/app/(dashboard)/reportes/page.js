"use client";

import { useState, useEffect } from "react";
import { ventasService } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { BarChart3, TrendingUp, DollarSign, Receipt } from "lucide-react";

export default function ReportesPage() {
  const [fechaInicio, setFechaInicio] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [fechaFin, setFechaFin] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [numVentas, setNumVentas] = useState(0);

  useEffect(() => {
    const fetchReporte = async () => {
      setLoading(true);
      try {
        const res = await ventasService.getByDateRange(fechaInicio, fechaFin);
        setVentas(res.data);
        setTotalVentas(
          res.data.reduce((sum, v) => sum + Number(v.total || 0), 0),
        );
        setNumVentas(res.data.length);
      } catch (e) {
        console.error("Error fetching reporte:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchReporte();
  }, [fechaInicio, fechaFin]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });

  const stats = [
    {
      title: "Total Ventas",
      value: `$${totalVentas.toFixed(2)}`,
      icon: DollarSign,
      variant: "success",
    },
    {
      title: "Número de Ventas",
      value: numVentas,
      icon: Receipt,
      variant: "info",
    },
    {
      title: "Ticket Promedio",
      value: numVentas > 0 ? `$${(totalVentas / numVentas).toFixed(2)}` : "$0.00",
      icon: TrendingUp,
      variant: "warning",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader
        title="Reportes"
        description="Análisis de ventas por período"
      />

      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <Input
              label="Fecha Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              wrapperClassName="w-full sm:w-auto"
            />
            <Input
              label="Fecha Fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              wrapperClassName="w-full sm:w-auto"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorMap = {
            success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          };
          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorMap[stat.variant]}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16">
                  <LoadingState />
                </TableCell>
              </TableRow>
            ) : ventas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16">
                  <EmptyState
                    icon={<BarChart3 className="w-10 h-10" />}
                    title="Sin datos"
                    description="No hay ventas en este período"
                  />
                </TableCell>
              </TableRow>
            ) : (
              ventas.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono text-xs text-zinc-500">#{v.id}</TableCell>
                  <TableCell className="text-zinc-300">{formatDate(v.fecha)}</TableCell>
                  <TableCell className="text-zinc-300">{v.cliente?.nombre || "—"}</TableCell>
                  <TableCell className="text-zinc-400">{v.usuario?.nombre || "—"}</TableCell>
                  <TableCell className="text-zinc-400 capitalize">{v.metodo_pago}</TableCell>
                  <TableCell className="text-emerald-400 font-medium">${Number(v.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={v.estado === "cancelada" ? "danger" : "success"} dot>
                      {v.estado === "cancelada" ? "Cancelada" : "Completada"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
