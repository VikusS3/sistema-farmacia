"use client";

import { useEffect, useState, useCallback } from "react";
import { inventarioService, productosService } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import Swal from "sweetalert2";
import { Package, Plus, ArrowUp, ArrowDown } from "lucide-react";

const movimientoConfig = {
  compra: { label: "Compra", variant: "success" },
  venta: { label: "Venta", variant: "info" },
  ajuste: { label: "Ajuste", variant: "warning" },
  vencido: { label: "Vencido", variant: "danger" },
  devolucion: { label: "Devolución", variant: "purple" },
};

export default function InventarioPage() {
  const [movements, setMovements] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [filterTipo, setFilterTipo] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ producto_id: "", cantidad: "", motivo: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (filterTipo) params.search = filterTipo;
        const [movRes, prodRes] = await Promise.all([
          inventarioService.getAll(params),
          productosService.getAll(),
        ]);
        setMovements(movRes.data.data);
        setMeta(movRes.data.meta);
        setProductos(prodRes.data.data || prodRes.data);
      } catch (e) {
        console.error("Error fetching inventory:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, filterTipo, refreshKey]);

  const filtered = movements;
  const resumen = {
    entradas: movements.filter((m) => ["compra", "devolucion"].includes(m.movimiento)).reduce((s, m) => s + Math.abs(m.stock_nuevo - m.stock_anterior), 0),
    salidas: movements.filter((m) => ["venta", "vencido"].includes(m.movimiento)).reduce((s, m) => s + Math.abs(m.stock_anterior - m.stock_nuevo), 0),
    ajustes: movements.filter((m) => m.movimiento === "ajuste").length,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.producto_id || !formData.cantidad) return;
    setSubmitting(true);
    try {
      const producto = productos.find((p) => p.id === Number(formData.producto_id));
      await inventarioService.registrar({
        producto_id: Number(formData.producto_id),
        movimiento: "ajuste",
        cantidad: Number(formData.cantidad),
        stock_anterior: producto?.stock ?? 0,
        stock_nuevo: Number(formData.cantidad),
        motivo: formData.motivo || undefined,
      });
      Swal.fire({ icon: "success", title: "Ajuste registrado", text: `Stock de "${producto?.nombre}" actualizado a ${formData.cantidad}`, timer: 2000, showConfirmButton: false });
      setFormData({ producto_id: "", cantidad: "", motivo: "" });
      setShowForm(false);
      setRefreshKey(k => k + 1);
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.error || "Error al registrar ajuste" });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader
        title="Inventario"
        description={meta ? `${meta.total} movimientos registrados` : "Sin movimientos"}
        actions={
          <div className="flex items-center gap-2">
            <Select value={filterTipo} onChange={(e) => { setFilterTipo(e.target.value); setPage(1); }} className="!w-36">
              <option value="">Todos</option>
              <option value="compra">Compras</option>
              <option value="venta">Ventas</option>
              <option value="ajuste">Ajustes</option>
              <option value="vencido">Vencidos</option>
              <option value="devolucion">Devoluciones</option>
            </Select>
            <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> Nuevo Ajuste</Button>
          </div>
        }
      />

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card><CardContent className="flex items-center justify-between py-5">
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Entradas</p><p className="text-2xl font-black text-emerald-400">{resumen.entradas}</p></div>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center border bg-emerald-500/10 border-emerald-500/20"><ArrowDown className="w-5 h-5 text-emerald-400" /></div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center justify-between py-5">
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Salidas</p><p className="text-2xl font-black text-red-400">{resumen.salidas}</p></div>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center border bg-red-500/10 border-red-500/20"><ArrowUp className="w-5 h-5 text-red-400" /></div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center justify-between py-5">
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Ajustes</p><p className="text-2xl font-black text-amber-400">{resumen.ajustes}</p></div>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center border bg-amber-500/10 border-amber-500/20"><Package className="w-5 h-5 text-amber-400" /></div>
          </CardContent></Card>
        </div>
      )}

      {showForm && (
        <Card><CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Registrar Ajuste de Stock</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <Select label="Producto" value={formData.producto_id} onChange={(e) => setFormData({ ...formData, producto_id: e.target.value })} required>
              <option value="">Seleccionar...</option>
              {productos.map((p) => (<option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock})</option>))}
            </Select>
            <Input label="Nuevo Stock" type="number" min="0" placeholder="0" value={formData.cantidad} onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })} required />
            <Input label="Motivo" placeholder="Razón del ajuste" value={formData.motivo} onChange={(e) => setFormData({ ...formData, motivo: e.target.value })} />
            <div className="flex gap-2"><Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : "Guardar"}</Button><Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancelar</Button></div>
          </form>
        </CardContent></Card>
      )}

      {loading ? (
        <Card><LoadingState type="table" /></Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableHead>Fecha</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Movimiento</TableHead>
              <TableHead className="text-right">Stock Anterior</TableHead>
              <TableHead className="text-right">Stock Nuevo</TableHead>
              <TableHead className="text-right">Variación</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Motivo</TableHead>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-16">
                  <EmptyState icon={<Package className="w-10 h-10" />} title="Sin movimientos" description="No hay movimientos de inventario registrados" />
                </TableCell></TableRow>
              ) : (
                filtered.map((m) => {
                  const config = movimientoConfig[m.movimiento] || movimientoConfig.venta;
                  const diff = m.stock_nuevo - m.stock_anterior;
                  return (
                    <TableRow key={m.id}>
                      <TableCell className="text-zinc-400 whitespace-nowrap">{formatDate(m.fecha_movimiento)}</TableCell>
                      <TableCell className="text-white font-medium">{m.producto_nombre}</TableCell>
                      <TableCell><Badge variant={config.variant} size="sm">{config.label}</Badge></TableCell>
                      <TableCell className="text-right text-zinc-400">{m.stock_anterior}</TableCell>
                      <TableCell className="text-right text-white font-semibold">{m.stock_nuevo}</TableCell>
                      <TableCell className={`text-right font-medium ${diff > 0 ? "text-emerald-400" : diff < 0 ? "text-red-400" : "text-zinc-500"}`}>{diff > 0 ? `+${diff}` : diff}</TableCell>
                      <TableCell className="text-zinc-400">{m.usuario_nombre || "-"}</TableCell>
                      <TableCell className="text-zinc-400 max-w-[160px] truncate" title={m.motivo}>{m.motivo || "-"}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <Pagination meta={meta} onPageChange={setPage} />
        </Card>
      )}
    </div>
  );
}
