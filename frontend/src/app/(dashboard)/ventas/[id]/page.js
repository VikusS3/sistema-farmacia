"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ventasService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
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
import { AlertBanner } from "@/components/ui/AlertBanner";
import { ArrowLeft, FileText, XCircle } from "lucide-react";

export default function VentaDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [venta, setVenta] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [motivo, setMotivo] = useState("");
  const [cancelando, setCancelando] = useState(false);
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const [ventaRes, prodRes] = await Promise.all([
          ventasService.getById(params.id),
          ventasService.getVentaConProductos(params.id),
        ]);
        setVenta(ventaRes.data);
        setProductos(prodRes.data.productos || prodRes.data || []);
      } catch (e) {
        console.error("Error fetching venta:", e);
        setError("Error al cargar la venta");
      } finally {
        setLoading(false);
      }
    };
    fetchVenta();
  }, [params.id]);

  const handleCancel = async () => {
    setCancelando(true);
    try {
      await ventasService.cancel(params.id, {
        motivo,
        usuario_id: user.id,
      });
      Swal.fire({
        title: "Venta cancelada",
        text: "El stock ha sido devuelto",
        icon: "success",
        background: "#18181b",
        color: "#fafafa",
        confirmButtonColor: "#10b981",
      });
      const res = await ventasService.getById(params.id);
      setVenta(res.data);
      setMotivo("");
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.response?.data?.message || "Error al cancelar venta",
        icon: "error",
        background: "#18181b",
        color: "#fafafa",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setCancelando(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) return <LoadingState type="default" />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <AlertBanner variant="error" message={error} />
      </div>
    );
  }

  if (!venta) return null;

  const isCancelada = venta.estado === "cancelada";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader
        title={`Venta #${venta.id}`}
        description={`Registrada el ${formatDate(venta.fecha)}`}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/ventas")}
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Cliente
            </p>
            <p className="text-white font-medium">
              {venta.cliente?.nombre || "Sin cliente"}
            </p>
            {venta.cliente?.email && (
              <p className="text-zinc-400 text-sm">{venta.cliente.email}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Usuario
            </p>
            <p className="text-white font-medium">
              {venta.usuario?.nombre || "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Estado
            </p>
            <Badge variant={isCancelada ? "danger" : "success"} size="md" dot>
              {isCancelada ? "Cancelada" : "Completada"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Subtotal
            </p>
            <p className="text-xl font-bold text-white">
              ${Number(venta.subtotal || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Descuento
            </p>
            <p className="text-xl font-bold text-white">
              ${Number(venta.descuento || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Adicional
            </p>
            <p className="text-xl font-bold text-white">
              ${Number(venta.adicional || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Total
            </p>
            <p className="text-xl font-bold text-emerald-400">
              ${Number(venta.total || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableHead>Producto</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
          </TableHeader>
          <TableBody>
            {productos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-zinc-500"
                >
                  Sin productos
                </TableCell>
              </TableRow>
            ) : (
              (Array.isArray(productos) ? productos : []).map((item, i) => (
                <TableRow key={item.id || i}>
                  <TableCell className="text-white font-medium">
                    {item.producto_nombre || item.nombre || "—"}
                  </TableCell>
                  <TableCell className="text-zinc-400 capitalize">
                    {item.unidad_venta || "—"}
                  </TableCell>
                  <TableCell className="text-right text-zinc-300">
                    {item.cantidad}
                  </TableCell>
                  <TableCell className="text-right text-zinc-300">
                    ${Number(item.precio_unitario || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-emerald-400 font-medium">
                    ${Number(item.subtotal || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={async () => {
            setDescargando(true);
            try {
              const res = await ventasService.generarTicket(params.id);
              const blob = new Blob([res.data], { type: "application/pdf" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `boleta-${params.id}.pdf`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            } catch (e) {
              setError(e.response?.data?.message || "Error al descargar ticket");
            } finally {
              setDescargando(false);
            }
          }}
          disabled={descargando}
        >
          <FileText className="w-4 h-4" /> {descargando ? "Descargando..." : "Descargar Ticket"}
        </Button>
      </div>

      {!isCancelada && (
        <Card id="cancel-section" className="border-red-500/20">
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-2">
              Cancelar Venta
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              Al cancelar la venta se devolverá el stock de todos los productos.
            </p>
            <div className="max-w-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Motivo de cancelación
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 resize-none"
                  rows={3}
                  placeholder="Describe el motivo de la cancelación..."
                />
                <p className="text-xs mt-1.5 text-zinc-500">
                  {motivo.length < 10
                    ? `Mínimo 10 caracteres (${motivo.length}/10)`
                    : `✓ ${motivo.length} caracteres`}
                </p>
              </div>
              <Button
                variant="danger"
                onClick={handleCancel}
                disabled={cancelando || motivo.length < 10}
              >
                {cancelando ? "Cancelando..." : "Confirmar Cancelación"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
