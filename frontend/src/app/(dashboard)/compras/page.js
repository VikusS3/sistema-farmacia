"use client";

import { useEffect, useState, useCallback } from "react";
import {
  comprasService,
  proveedoresService,
  productosService,
  cajaService,
} from "@/lib/api";
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
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { Pagination } from "@/components/ui/Pagination";
import { Plus, Package, Minus, Plus as PlusIcon, ShoppingCart, Eye, X } from "lucide-react";

export default function ComprasPage() {
  const { user } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cajaId, setCajaId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [compraDetalle, setCompraDetalle] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const params = { page, limit: 10 };
        const res = await comprasService.getAll(params);
        setCompras(res.data.data);
        setMeta(res.data.meta);
      } catch (e) {
        console.error("Error fetching compras:", e);
      }
    };

    const init = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [proveedoresRes, productosRes] = await Promise.all([
          proveedoresService.getAll(),
          productosService.getAll(),
        ]);
        setProveedores(proveedoresRes.data.data || proveedoresRes.data);
        setProductos(productosRes.data.data || productosRes.data);
        await fetchCompras();
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
      try {
        const cajaRes = await cajaService.getAbierta(user.id);
        if (cajaRes.data.caja) {
          setCajaId(cajaRes.data.caja.id);
        }
      } catch (e) {
        console.warn("No hay caja abierta:", e);
      }
    };
    init();
  }, [user, page, refreshKey]);

  const getInitialPrice = (producto, tipoCompra) => {
    const upb = producto.unidades_por_blister || 1;
    const bpc = producto.blisters_por_caja || 1;
    if (tipoCompra === "blister") return Number(producto.precio_blister || (producto.precio_unidad || 0) * upb) || 0;
    if (tipoCompra === "caja") return Number(producto.precio_caja || (producto.precio_unidad || 0) * upb * bpc) || 0;
    return Number(producto.precio_unidad) || 0;
  };

  const agregarProducto = (producto) => {
    const existente = carrito.find((item) => item.producto_id === producto.id);
    if (existente) {
      setCarrito(
        carrito.map((item) =>
          item.producto_id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        ),
      );
    } else {
      setCarrito([
        ...carrito,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          cantidad: 1,
          precio: getInitialPrice(producto, "unidad"),
          tipo_compra: "unidad",
          require_lote: producto.require_lote || false,
          unidades_por_blister: producto.unidades_por_blister || 1,
          blisters_por_caja: producto.blisters_por_caja || 1,
          numero_lote: "",
          fecha_vencimiento: "",
        },
      ]);
    }
  };

  const actualizarCantidad = (producto_id, cantidad) => {
    if (cantidad <= 0) {
      setCarrito(carrito.filter((item) => item.producto_id !== producto_id));
    } else {
      setCarrito(
        carrito.map((item) =>
          item.producto_id === producto_id ? { ...item, cantidad } : item,
        ),
      );
    }
  };

  const actualizarCampo = (producto_id, campo, valor) => {
    setCarrito(
      carrito.map((item) =>
        item.producto_id === producto_id ? { ...item, [campo]: valor } : item,
      ),
    );
  };

  const actualizarTipoCompra = (producto_id, nuevoTipo) => {
    setCarrito(carrito.map((item) => {
      if (item.producto_id !== producto_id) return item;
      const upb = item.unidades_por_blister || 1;
      const bpc = item.blisters_por_caja || 1;
      const factorMap = { unidad: 1, blister: upb, caja: upb * bpc };
      const oldFactor = factorMap[item.tipo_compra] || 1;
      const newFactor = factorMap[nuevoTipo] || 1;
      const newPrice = oldFactor > 0 ? Number(((item.precio / oldFactor) * newFactor).toFixed(2)) : 0;
      return { ...item, tipo_compra: nuevoTipo, precio: newPrice };
    }));
  };

  const fetchCompraDetalle = async (compraId) => {
    setLoadingDetalle(true);
    setSelectedCompra(compraId);
    try {
      const res = await comprasService.getById(compraId);
      setCompraDetalle(res.data.compra || res.data);
    } catch (e) {
      console.error("Error al obtener detalle de compra:", e);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const subtotal = carrito.reduce(
    (sum, item) => sum + (item.precio || 0) * item.cantidad,
    0,
  );
  const total = Math.max(0, subtotal - Number(descuento));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (carrito.length === 0 || !proveedorId) {
      Swal.fire({
        title: "Advertencia",
        text: "Selecciona un proveedor y agrega productos",
        icon: "warning",
        background: "#18181b",
        color: "#fafafa",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    if (!cajaId) {
      setError("No hay una caja abierta. Abre una caja antes de registrar una compra.");
      return;
    }

    const detallesConLote = carrito.filter((item) => item.require_lote);
    const missingLote = detallesConLote.find(
      (item) => !item.numero_lote || !item.fecha_vencimiento,
    );
    if (missingLote) {
      setError(`El producto "${missingLote.nombre}" requiere número de lote y fecha de vencimiento`);
      return;
    }

    setSaving(true);
    try {
      await comprasService.create({
        proveedor_id: Number(proveedorId),
        usuario_id: user.id,
        caja_id: cajaId,
        subtotal: Number(subtotal.toFixed(2)),
        descuento: Number(descuento),
        total: Number(total.toFixed(2)),
        observaciones: observaciones || undefined,
        detalles: carrito.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          tipo_compra: item.tipo_compra,
          subtotal: Number((item.precio * item.cantidad).toFixed(2)),
          ...(item.require_lote
            ? {
                numero_lote: item.numero_lote,
                fecha_vencimiento: item.fecha_vencimiento,
              }
            : {}),
        })),
      });
      setShowForm(false);
      setCarrito([]);
      setProveedorId("");
      setDescuento(0);
      setObservaciones("");
      setRefreshKey(k => k + 1);
    } catch (e) {
      setError(e.response?.data?.message || "Error al registrar compra");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("es-ES");

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader
        title="Compras"
        description="Registro de compras a proveedores"
        actions={
          <Button size="sm" onClick={() => setShowForm(true)} disabled={!cajaId}>
            <Plus className="w-4 h-4" /> Nueva Compra
          </Button>
        }
      />

      <AlertBanner variant="error" message={error} onDismiss={() => setError("")} />

      {!cajaId && !loading && (
        <AlertBanner
          variant="warning"
          message="No hay caja abierta. Ve a la sección de Caja para abrir una antes de realizar compras."
        />
      )}

      {showForm && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-6">Nueva Compra</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <Select
                label="Proveedor"
                value={proveedorId}
                onChange={(e) => setProveedorId(e.target.value)}
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </Select>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-zinc-400 mb-3">Agregar productos:</p>
              <div className="flex flex-wrap gap-2">
                {productos.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => agregarProducto(p)}
                    className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 rounded-lg text-zinc-300 text-sm transition-all duration-200 hover:bg-zinc-800"
                  >
                    {p.nombre}
                  </button>
                ))}
              </div>
            </div>

            {carrito.length > 0 && (
              <div className="mb-6 space-y-3">
                <p className="text-sm font-medium text-zinc-400 mb-3">Productos seleccionados:</p>
                {carrito.map((item) => (
                  <div key={item.producto_id} className="p-3 bg-zinc-800/30 rounded-xl border border-zinc-800/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">{item.nombre}</span>
                      <div className="flex items-center gap-2">
                        <Select
                          value={item.tipo_compra}
                          onChange={(e) => actualizarTipoCompra(item.producto_id, e.target.value)}
                          wrapperClassName="w-28"
                        >
                          <option value="unidad">Unidad</option>
                          <option value="blister">Blister</option>
                          <option value="caja">Caja</option>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-0.5">
                          <button
                            onClick={() => actualizarCantidad(item.producto_id, item.cantidad - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-white text-sm font-medium w-8 text-center tabular-nums">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => actualizarCantidad(item.producto_id, item.cantidad + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                          >
                            <PlusIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.precio}
                            onChange={(e) => actualizarCampo(item.producto_id, "precio", Math.max(0, Number(e.target.value) || 0))}
                            className="w-20 pl-5 pr-2 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm tabular-nums text-right focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                          />
                        </div>
                        <span className="text-emerald-400 text-sm font-medium tabular-nums">
                          = ${(item.precio * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {item.require_lote && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/50">
                        <Input label="N° de Lote" placeholder="Ej: LOTE-001" value={item.numero_lote} onChange={(e) => actualizarCampo(item.producto_id, "numero_lote", e.target.value)} />
                        <Input label="Fecha de Vencimiento" type="date" value={item.fecha_vencimiento} onChange={(e) => actualizarCampo(item.producto_id, "fecha_vencimiento", e.target.value)} />
                      </div>
                    )}
                  </div>
                ))}
                <div className="space-y-3 pt-4 border-t border-zinc-800/50">
                  <div className="flex justify-end items-center gap-4">
                    <span className="text-zinc-400 text-sm">Subtotal:</span>
                    <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-end items-center gap-4">
                    <Input label="Descuento" type="number" step="0.01" value={descuento} onChange={(e) => setDescuento(Number(e.target.value) || 0)} wrapperClassName="w-40" />
                  </div>
                  <div className="flex justify-end items-center gap-4">
                    <span className="text-zinc-400 text-sm">Total:</span>
                    <span className="text-lg font-bold text-emerald-400">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <Input label="Observaciones" placeholder="Notas adicionales..." value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSubmit} disabled={saving || carrito.length === 0}>
                {saving ? "Guardando..." : (<><ShoppingCart className="w-4 h-4" /> Guardar Compra</>)}
              </Button>
              <Button variant="secondary" onClick={() => { setShowForm(false); setCarrito([]); }}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card><LoadingState type="table" /></Card>
      ) : compras.length === 0 ? (
        <Card>
          <EmptyState icon={<Package className="w-10 h-10" />} title="No hay compras" description="Registra tu primera compra" action={
            <Button size="sm" onClick={() => setShowForm(true)} disabled={!cajaId}><Plus className="w-4 h-4" /> Nueva Compra</Button>
          } />
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableHead>ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Detalle</TableHead>
            </TableHeader>
            <TableBody>
              {compras.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs text-zinc-500">#{c.id}</TableCell>
                  <TableCell className="text-zinc-300">{formatDate(c.fecha)}</TableCell>
                  <TableCell className="text-white font-medium">{c.proveedor_nombre || "—"}</TableCell>
                  <TableCell className="text-right text-emerald-400 font-medium">${Number(c.total).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => fetchCompraDetalle(c.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination meta={meta} onPageChange={setPage} />
        </Card>
      )}

      {selectedCompra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => { setSelectedCompra(null); setCompraDetalle(null); }}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {loadingDetalle ? "Cargando..." : `Compra #${selectedCompra}`}
                </h2>
                <p className="text-sm text-zinc-500 mt-0.5">Detalle completo de la compra</p>
              </div>
              <button onClick={() => { setSelectedCompra(null); setCompraDetalle(null); }} className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"><X className="w-5 h-5" /></button>
            </div>
            {loadingDetalle ? (
              <div className="p-12 flex justify-center"><LoadingState type="default" /></div>
            ) : compraDetalle ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1"><p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Proveedor</p><p className="text-white font-medium">{compraDetalle.proveedor_nombre || "—"}</p></div>
                  <div className="space-y-1"><p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Usuario</p><p className="text-white font-medium">{compraDetalle.usuario_nombre || "—"}</p></div>
                  <div className="space-y-1"><p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Fecha</p><p className="text-white font-medium">{formatDate(compraDetalle.fecha)}</p></div>
                  <div className="space-y-1"><p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Caja</p><p className="text-white font-medium">{compraDetalle.caja_id ? `#${compraDetalle.caja_id}` : "—"}</p></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-zinc-800/30 rounded-xl"><p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Subtotal</p><p className="text-lg font-bold text-white">${Number(compraDetalle.subtotal || 0).toFixed(2)}</p></div>
                  <div className="p-3 bg-zinc-800/30 rounded-xl"><p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Descuento</p><p className="text-lg font-bold text-white">-${Number(compraDetalle.descuento || 0).toFixed(2)}</p></div>
                  <div className="p-3 bg-zinc-800/30 rounded-xl"><p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Total</p><p className="text-lg font-bold text-emerald-400">${Number(compraDetalle.total || 0).toFixed(2)}</p></div>
                </div>
                {compraDetalle.observaciones && <div className="p-3 bg-zinc-800/30 rounded-xl"><p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Observaciones</p><p className="text-white text-sm">{compraDetalle.observaciones}</p></div>}
                <div>
                  <p className="text-sm font-semibold text-zinc-400 mb-3">Productos ({compraDetalle.detalles?.length || 0})</p>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableHead>Producto</TableHead>
                        <TableHead>Compra</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead className="text-right">Unds Base</TableHead>
                        <TableHead className="text-right">Costo Und</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="text-right">Lote</TableHead>
                        <TableHead className="text-right">Vence</TableHead>
                      </TableHeader>
                      <TableBody>
                        {(compraDetalle.detalles || []).length === 0 ? (
                          <TableRow><TableCell colSpan={8} className="py-8 text-center text-zinc-500">Sin productos</TableCell></TableRow>
                        ) : (compraDetalle.detalles || []).map((d, i) => (
                          <TableRow key={d.id || i}>
                            <TableCell className="text-white font-medium">{d.producto_nombre || "—"}</TableCell>
                            <TableCell className="text-zinc-400 capitalize">{d.tipo_compra || "—"}</TableCell>
                            <TableCell className="text-right text-zinc-300 tabular-nums">{d.cantidad}</TableCell>
                            <TableCell className="text-right text-zinc-500 tabular-nums text-xs">{d.unidades_totales ?? "—"}</TableCell>
                            <TableCell className="text-right text-zinc-300 tabular-nums">${Number(d.costo_unitario_compra || 0).toFixed(2)}</TableCell>
                            <TableCell className="text-right text-emerald-400 font-medium tabular-nums">${Number(d.subtotal || 0).toFixed(2)}</TableCell>
                            <TableCell className="text-right text-zinc-500 tabular-nums text-xs">{d.numero_lote || (d.lote_id ? `#${d.lote_id}` : "—")}</TableCell>
                            <TableCell className="text-right text-zinc-500 tabular-nums text-xs">{d.fecha_vencimiento ? formatDate(d.fecha_vencimiento) : "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
