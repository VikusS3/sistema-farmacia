"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { cajaService } from "@/lib/api";
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
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { StatusDot } from "@/components/ui/StatusDot";
import {
  Banknote,
  History,
  ArrowRightFromLine,
  ArrowLeftToLine,
} from "lucide-react";

export default function CajaPage() {
  const { user } = useAuth();
  const [cajaAbierta, setCajaAbierta] = useState(null);
  const [cajasCerradas, setCajasCerradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [montoApertura, setMontoApertura] = useState("");
  const [montoCierre, setMontoCierre] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cajaRes = await cajaService.getAbierta(user.id);
        setCajaAbierta(cajaRes.data);
      } catch (e) {
        console.warn("No hay caja abierta:", e);
      }
      try {
        const cerradasRes = await cajaService.getCerradas(10);
        setCajasCerradas(cerradasRes.data);
      } catch (e) {
        console.error("Error al obtener cajas cerradas:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const abrirCaja = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await cajaService.abrir({
        usuario_id: user.id,
        monto_apertura: Number(montoApertura),
      });
      setSuccess("Caja abierta correctamente");
      setCajaAbierta({ hasOpenCaja: true, caja: { id: res.data.caja_id } });
      setMontoApertura("");
    } catch (e) {
      setError(e.response?.data?.message || "Error al abrir caja");
    } finally {
      setActionLoading(false);
    }
  };

  const cerrarCaja = async (e) => {
    e.preventDefault();
    if (!cajaAbierta?.caja) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await cajaService.cerrar({
        caja_id: cajaAbierta.caja.id,
        monto_cierre: Number(montoCierre),
        usuario_id: user.id,
      });
      setSuccess("Caja cerrada correctamente");
      setCajaAbierta(null);
      setMontoCierre("");
      setCajasCerradas([res.data.resumen, ...cajasCerradas]);
    } catch (e) {
      setError(e.response?.data?.message || "Error al cerrar caja");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <LoadingState type="default" />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader title="Caja" description="Gestión de caja registradora" />

      <AlertBanner
        variant="success"
        message={success}
        onDismiss={() => setSuccess("")}
      />
      <AlertBanner
        variant="error"
        message={error}
        onDismiss={() => setError("")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {!cajaAbierta?.hasOpenCaja ? (
          <Card className="lg:col-span-1">
            <CardContent>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <ArrowRightFromLine className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Abrir Caja
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Inicia la jornada laboral
                  </p>
                </div>
              </div>
              <form onSubmit={abrirCaja} className="space-y-4">
                <Input
                  label="Monto de Apertura"
                  type="number"
                  step="0.01"
                  value={montoApertura}
                  onChange={(e) => setMontoApertura(e.target.value)}
                  placeholder="0.00"
                  required
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Abriendo..." : "Abrir Caja"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-1 border-emerald-500/20">
            <CardContent>
              <div className="flex items-center gap-3 mb-6">
                <StatusDot active pulse variant="success" />
                <div>
                  <h2 className="text-lg font-semibold text-emerald-400">
                    Caja Abierta
                  </h2>
                  <p className="text-xs text-zinc-500">
                    ID: #{cajaAbierta.caja.id}
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-6 p-4 bg-zinc-800/30 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Apertura</span>
                  <span className="text-zinc-300">
                    {formatDate(cajaAbierta.caja.fecha_apertura)}
                  </span>
                </div>
              </div>
              <form onSubmit={cerrarCaja} className="space-y-4">
                <Input
                  label="Monto de Cierre"
                  type="number"
                  step="0.01"
                  value={montoCierre}
                  onChange={(e) => setMontoCierre(e.target.value)}
                  placeholder="0.00"
                  required
                />
                <Button
                  type="submit"
                  variant="danger"
                  className="w-full"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Cerrando..." : "Cerrar Caja"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="lg:col-span-2">
          <CardContent>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <History className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Cajas Cerradas
                </h2>
                <p className="text-xs text-zinc-500">Últimas 10 operaciones</p>
              </div>
            </div>
            {cajasCerradas.length === 0 ? (
              <EmptyState
                icon={<Banknote className="w-8 h-8" />}
                title="Sin historial"
                description="No hay cajas cerradas aún"
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Apertura</TableHead>
                    <TableHead className="text-right">Ventas</TableHead>
                    <TableHead className="text-right">Cierre</TableHead>
                    <TableHead className="text-right">Diferencia</TableHead>
                  </TableHeader>
                  <TableBody>
                    {cajasCerradas.map((caja, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-zinc-300">
                          {formatDate(caja.fecha_cierre)}
                        </TableCell>
                        <TableCell className="text-right text-white">
                          ${Number(caja.monto_apertura).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-emerald-400">
                          ${Number(caja.total_ventas || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-white">
                          ${Number(caja.monto_cierre).toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium tabular-nums ${Number(caja.diferencia) >= 0 ? "text-emerald-400" : "text-red-400"}`}
                        >
                          ${Number(caja.diferencia || 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
