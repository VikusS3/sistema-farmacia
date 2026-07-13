"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ventasService, cajaService } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
import { AlertBanner } from "@/components/ui/AlertBanner";
import { Pagination } from "@/components/ui/Pagination";
import { Plus, ShoppingCart, Eye } from "lucide-react";

export default function VentasPage() {
  const { user } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [cajaAbierta, setCajaAbierta] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        const [ventasRes, cajaRes] = await Promise.all([
          ventasService.getAll(params),
          user ? cajaService.getAbierta(user.id) : Promise.resolve({ data: { hasOpenCaja: false } }),
        ]);
        setVentas(ventasRes.data.data);
        setMeta(ventasRes.data.meta);
        setCajaAbierta(cajaRes.data.hasOpenCaja);
      } catch (e) {
        console.warn("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, page]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader
        title="Ventas"
        description="Historial de ventas realizadas"
        actions={
          cajaAbierta ? (
            <Link href="/ventas/nueva">
              <Button size="sm">
                <Plus className="w-4 h-4" /> Nueva Venta
              </Button>
            </Link>
          ) : (
            <span className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              Abre la caja para vender
            </span>
          )
        }
      />

      {!cajaAbierta && (
        <AlertBanner
          variant="warning"
          message="No hay caja abierta. Ve a la sección de Caja para abrir una antes de realizar ventas."
        />
      )}

      {loading ? (
        <Card variant="glass"><LoadingState type="table" /></Card>
      ) : (
        <Card variant="glass" className="overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
          <Table>
            <TableHeader>
              <TableHead>ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableHeader>
            <TableBody>
              {ventas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16">
                    <EmptyState
                      icon={<ShoppingCart className="w-10 h-10" />}
                      title="No hay ventas"
                      description={cajaAbierta ? "Realiza tu primera venta" : "Abre la caja para empezar a vender"}
                      action={cajaAbierta && (
                        <Link href="/ventas/nueva"><Button size="sm"><Plus className="w-4 h-4" /> Nueva Venta</Button></Link>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                ventas.map((venta, i) => (
                  <TableRow key={venta.id} className="stagger-in" style={{ animationDelay: `${i * 25}ms` }}>
                    <TableCell className="font-mono text-xs text-zinc-500">#{venta.id}</TableCell>
                    <TableCell className="text-zinc-300">{formatDate(venta.fecha)}</TableCell>
                    <TableCell className="text-white">{venta.cliente_nombre || <span className="text-zinc-600">Sin cliente</span>}</TableCell>
                    <TableCell className="text-zinc-400">{venta.usuario_nombre || "—"}</TableCell>
                    <TableCell className="text-emerald-400 font-medium tabular-nums">${Number(venta.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={venta.estado === "cancelada" ? "danger" : "success"} dot>
                        {venta.estado === "cancelada" ? "Cancelada" : "Completada"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/ventas/${venta.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="w-3.5 h-3.5" /> Ver</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Pagination meta={meta} onPageChange={setPage} />
        </Card>
      )}
    </div>
  );
}
