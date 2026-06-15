"use client";

import { useEffect, useState } from "react";
import { alertasService } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { StatusDot } from "@/components/ui/StatusDot";
import { Bell, BellOff, Trash2, CheckCheck } from "lucide-react";

const tipoConfig = {
  stock_bajo: { label: "Stock Bajo", variant: "warning" },
  vencimiento: { label: "Vencimiento", variant: "danger" },
  default: { label: "General", variant: "info" },
};

export default function AlertasPage() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const res = await alertasService.getAll(filter);
        setAlertas(res.data);
      } catch (e) {
        console.error("Error fetching alertas:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAlertas();
  }, [filter]);

  const marcarLeida = async (id) => {
    try {
      await alertasService.marcarLeida(id);
      setAlertas(alertas.map((a) => (a.id === id ? { ...a, leida: true } : a)));
    } catch (e) {
      console.error("Error marking alert:", e);
    }
  };

  const marcarTodas = async () => {
    try {
      await alertasService.marcarTodasLeidas();
      setAlertas(alertas.map((a) => ({ ...a, leida: true })));
    } catch (e) {
      console.error("Error marking all alerts:", e);
    }
  };

  const eliminarAlerta = async (id) => {
    try {
      await alertasService.delete(id);
      setAlertas(alertas.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Error deleting alert:", e);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  if (loading) return <LoadingState type="default" />;

  const noLeidas = alertas.filter((a) => !a.leida).length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader
        title="Alertas"
        description={noLeidas > 0 ? `${noLeidas} alerta${noLeidas !== 1 ? "s" : ""} sin leer` : "No hay alertas pendientes"}
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="false">No leídas</option>
              <option value="true">Leídas</option>
            </Select>
            {noLeidas > 0 && (
              <Button variant="secondary" size="sm" onClick={marcarTodas}>
                <CheckCheck className="w-4 h-4" />
                Marcar todas
              </Button>
            )}
          </div>
        }
      />

      <div className="space-y-3">
        {alertas.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <EmptyState
                icon={<BellOff className="w-10 h-10" />}
                title="No hay alertas"
                description={filter ? "No hay alertas con ese filtro" : "Todo está en orden"}
              />
            </CardContent>
          </Card>
        ) : (
          alertas.map((alerta) => {
            const tipo = tipoConfig[alerta.tipo] || tipoConfig.default;
            return (
              <Card
                key={alerta.id}
                className={alerta.leida ? "opacity-60" : ""}
              >
                <CardContent className="flex items-start justify-between gap-4 py-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="mt-0.5">
                      {alerta.leida ? (
                        <Bell className="w-5 h-5 text-zinc-600" />
                      ) : (
                        <Bell className="w-5 h-5 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!alerta.leida && <StatusDot active pulse variant="info" />}
                        <Badge variant={tipo.variant} size="sm">
                          {tipo.label}
                        </Badge>
                      </div>
                      <p className="text-white text-sm leading-relaxed">{alerta.mensaje}</p>
                      <p className="text-zinc-600 text-xs mt-1.5">{formatDate(alerta.fecha_creacion)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!alerta.leida && (
                      <Button variant="ghost" size="sm" onClick={() => marcarLeida(alerta.id)}>
                        Marcar leída
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarAlerta(alerta.id)}
                      className="!text-red-400 hover:!text-red-300 hover:!bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
