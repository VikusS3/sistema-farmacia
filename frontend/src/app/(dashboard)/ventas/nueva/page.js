"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { productosService, clientesService, cajaService, ventasService } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Search, Plus, Minus, Trash2, ShoppingCart,
  Tag, Sparkles, Package, Pill, Box, X, Barcode,
} from "lucide-react";

const UNIDADES = [
  { value: "unidad", label: "Unidad", icon: Pill, color: "emerald" },
  { value: "blister", label: "Blister", icon: Package, color: "amber" },
  { value: "caja", label: "Caja", icon: Box, color: "violet" },
];

function calcularPrecio(producto, unidad) {
  switch (unidad) {
    case "unidad":
      return Number(producto.precio_unidad) || 0;
    case "blister":
      return Number(producto.precio_blister)
        || (Number(producto.precio_unidad) * Number(producto.unidades_por_blister))
        || 0;
    case "caja":
      return Number(producto.precio_caja)
        || (Number(producto.precio_unidad) * Number(producto.unidades_por_blister) * Number(producto.blisters_por_caja))
        || 0;
    default:
      return Number(producto.precio_unidad) || 0;
  }
}

function mostrarPrecios(producto) {
  const precios = [];
  const pu = Number(producto.precio_unidad) || 0;
  precios.push({ label: "Und", value: pu });
  const pb = Number(producto.precio_blister) || (pu * Number(producto.unidades_por_blister)) || 0;
  if (pb > 0 && pb !== pu) precios.push({ label: "Blister", value: pb });
  const pc = Number(producto.precio_caja) || (pb * Number(producto.blisters_por_caja)) || 0;
  if (pc > 0 && pc !== pb) precios.push({ label: "Caja", value: pc });
  return precios;
}

export default function NuevaVentaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cajaId, setCajaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [carrito, setCarrito] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [busqueda, setBusqueda] = useState("");

  const [usarDescuento, setUsarDescuento] = useState(false);
  const [usarAdicional, setUsarAdicional] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [adicional, setAdicional] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, clientesRes] = await Promise.all([
          productosService.getAll(),
          clientesService.getAll(),
        ]);
        setProductos(productosRes.data);
        setClientes(clientesRes.data);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
      try {
        const cajaRes = await cajaService.getAbierta(user.id);
        if (cajaRes.data.caja) {
          setCajaId(cajaRes.data.caja.id);
        }
      } catch (e) {
        console.warn("No hay caja abierta:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const agregarProducto = (producto, unidad = "unidad") => {
    const existente = carrito.find(
      (item) => item.producto_id === producto.id && item.unidad_venta === unidad,
    );
    if (existente) {
      setCarrito(
        carrito.map((item) =>
          item.producto_id === producto.id && item.unidad_venta === unidad
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        ),
      );
    } else {
      const precio = calcularPrecio(producto, unidad);
      setCarrito([
        ...carrito,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio,
          cantidad: 1,
          unidad_venta: unidad,
        },
      ]);
    }
  };

  const actualizarCantidad = (producto_id, unidad, cantidad) => {
    if (cantidad <= 0) {
      setCarrito(carrito.filter((item) => !(item.producto_id === producto_id && item.unidad_venta === unidad)));
    } else {
      setCarrito(
        carrito.map((item) =>
          item.producto_id === producto_id && item.unidad_venta === unidad
            ? { ...item, cantidad } : item,
        ),
      );
    }
  };

  const actualizarUnidadVenta = (producto_id, oldUnidad, newUnidad) => {
    const prod = productos.find((p) => p.id === producto_id);
    const precio = prod ? calcularPrecio(prod, newUnidad) : 0;
    setCarrito(
      carrito.map((item) =>
        item.producto_id === producto_id && item.unidad_venta === oldUnidad
          ? { ...item, unidad_venta: newUnidad, precio } : item,
      ),
    );
  };

  const eliminarProducto = (producto_id, unidad) => {
    setCarrito(carrito.filter((item) => !(item.producto_id === producto_id && item.unidad_venta === unidad)));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const subtotal = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0,
  );

  const total = Math.max(0, subtotal + Number(adicional) - Number(descuento));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (carrito.length === 0) {
      setError("Agrega productos al carrito");
      return;
    }
    if (!cajaId) {
      setError("No hay caja abierta");
      return;
    }

    setSaving(true);
    try {
      await ventasService.create({
        cliente_id: clienteId ? Number(clienteId) : null,
        usuario_id: user.id,
        metodo_pago: metodoPago,
        descuento: usarDescuento ? Number(descuento) : 0,
        adicional: usarAdicional ? Number(adicional) : 0,
        detalle_venta: carrito.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          unidad_venta: item.unidad_venta,
        })),
      });
      router.push("/ventas");
    } catch (e) {
      setError(e.response?.data?.message || "Error al registrar venta");
    } finally {
      setSaving(false);
    }
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const totalItems = carrito.reduce((s, i) => s + i.cantidad, 0);

  if (loading) return <LoadingState type="default" />;

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <PageHeader
        title="Nueva Venta"
        description="Registra una venta en el sistema"
      />

      <AlertBanner variant="error" message={error} onDismiss={() => setError("")} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* ── CATALOGO ── */}
        <div className="lg:col-span-2 space-y-5">
          <Card variant="glass" className="overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o código…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/60 border border-zinc-700/60 rounded-xl text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500/40"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1.5">
            {productosFiltrados.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mb-4">
                  <Barcode className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-zinc-400 text-sm font-medium mb-1">
                  {busqueda ? "Sin resultados" : "Catálogo vacío"}
                </p>
                <p className="text-zinc-600 text-xs">
                  {busqueda
                    ? `No se encontró "${busqueda}"`
                    : "No hay productos registrados"}
                </p>
              </div>
            ) : (
              productosFiltrados.map((producto, index) => {
                const precios = mostrarPrecios(producto);
                const stockMin = producto.stock_minimo || 0;
                const stockMax = producto.stock_maximo || producto.stock || 100;
                const stockPct = Math.min(100, (producto.stock / stockMax) * 100);
                const isLowStock = producto.stock <= stockMin;

                return (
                  <div
                    key={producto.id}
                    className="group relative p-5 rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/80 to-zinc-900/60 border border-zinc-800/60 hover:border-emerald-500/25 transition-all duration-300 hover:shadow-[0_0_25px_-8px_rgba(16,185,129,0.12)] hover:-translate-y-0.5 flex flex-col stagger-in"
                    style={{ animationDelay: `${index * 28}ms` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-start justify-between gap-2 mb-3.5">
                      <p className="text-sm font-semibold text-white leading-snug line-clamp-2 flex-1">
                        {producto.nombre}
                      </p>
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        isLowStock ? "bg-red-400" : "bg-emerald-500/40"
                      }`} />
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {precios.map((p) => (
                        <div key={p.label} className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                            {p.label}
                          </span>
                          <span className={`text-sm font-bold tabular-nums ${
                            p.label === "Und" ? "text-emerald-400" :
                            p.label === "Blister" ? "text-amber-400" : "text-violet-400"
                          }`}>
                            ${p.value.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-zinc-600 font-medium uppercase tracking-wider">Stock</span>
                        <span className={`font-semibold ${isLowStock ? "text-red-400" : "text-zinc-400"}`}>
                          {producto.stock} {producto.unidad_medida || "und"}
                        </span>
                      </div>
                      <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${stockPct}%`,
                            background: isLowStock
                              ? "linear-gradient(90deg, #ef4444, #f97316)"
                              : "linear-gradient(90deg, #10b981, #34d399)",
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => agregarProducto(producto, "unidad")}
                        className="flex-1 px-2.5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 active:scale-95 transition-all"
                      >
                        Und
                      </button>
                      {precios.some((p) => p.label === "Blister") && (
                        <button
                          onClick={() => agregarProducto(producto, "blister")}
                          className="flex-1 px-2.5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 active:scale-95 transition-all"
                        >
                          Blister
                        </button>
                      )}
                      {precios.some((p) => p.label === "Caja") && (
                        <button
                          onClick={() => agregarProducto(producto, "caja")}
                          className="flex-1 px-2.5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 hover:border-violet-500/40 active:scale-95 transition-all"
                        >
                          Caja
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── CARRITO ── */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 overflow-hidden border-zinc-800/60">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/15 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-emerald-400" />
                    {carrito.length > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-[9px] font-bold text-zinc-900 flex items-center justify-center leading-none">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white leading-tight">Carrito</h2>
                    <p className="text-[11px] text-zinc-500">
                      {carrito.length === 0
                        ? "Selecciona productos"
                        : `${carrito.length} ${carrito.length === 1 ? "producto" : "productos"}`}
                    </p>
                  </div>
                </div>
                {carrito.length > 0 && (
                  <button
                    onClick={vaciarCarrito}
                    className="text-[11px] font-medium text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    Vaciar
                  </button>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 mb-4">
                {carrito.length === 0 ? (
                  <div className="flex flex-col items-center py-10">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-800/40 border border-zinc-700/40 flex items-center justify-center mb-3">
                      <ShoppingCart className="w-6 h-6 text-zinc-700" />
                    </div>
                    <p className="text-zinc-500 text-sm font-medium mb-1">Carrito vacío</p>
                    <p className="text-zinc-700 text-xs text-center max-w-[180px]">
                      Agrega productos desde el catálogo
                    </p>
                  </div>
                ) : (
                  carrito.map((item) => {
                    const unidadCfg = UNIDADES.find((u) => u.value === item.unidad_venta);
                    const colorKey = unidadCfg?.color || "emerald";
                    const accentMap = {
                      emerald: "border-l-emerald-500/35 bg-emerald-500/[0.015]",
                      amber: "border-l-amber-500/35 bg-amber-500/[0.015]",
                      violet: "border-l-violet-500/35 bg-violet-500/[0.015]",
                    };
                    const badgeMap = {
                      emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                      violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
                    };

                    return (
                      <div
                        key={`${item.producto_id}-${item.unidad_venta}`}
                        className={`pl-3 p-2.5 rounded-xl border border-zinc-800/50 border-l-2 ${accentMap[colorKey]} transition-all duration-200 hover:border-zinc-700/80`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md border shrink-0 ${badgeMap[colorKey]}`}>
                              {unidadCfg?.label || "Und"}
                            </span>
                            <p className="text-sm font-medium text-white truncate">
                              {item.nombre}
                            </p>
                          </div>
                          <button
                            onClick={() => eliminarProducto(item.producto_id, item.unidad_venta)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/15 transition-all shrink-0 active:scale-90"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 bg-zinc-900/60 rounded-lg border border-zinc-800/50 p-0.5">
                            <button
                              onClick={() => actualizarCantidad(item.producto_id, item.unidad_venta, item.cantidad - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-zinc-700/80 transition-all active:scale-90"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-white text-sm font-semibold w-8 text-center tabular-nums">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => actualizarCantidad(item.producto_id, item.unidad_venta, item.cantidad + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-zinc-700/80 transition-all active:scale-90"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-sm font-bold tabular-nums">
                              ${(item.precio * item.cantidad).toFixed(2)}
                            </p>
                            <p className="text-[10px] text-zinc-600">
                              ${item.precio.toFixed(2)}/{unidadCfg?.label?.toLowerCase() || "und"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] text-zinc-700">Unidad:</span>
                          <select
                            value={item.unidad_venta}
                            onChange={(e) => actualizarUnidadVenta(item.producto_id, item.unidad_venta, e.target.value)}
                            className="appearance-none px-2 py-0.5 text-[10px] font-medium bg-zinc-900/60 border border-zinc-700/50 rounded-md text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 cursor-pointer"
                          >
                            {UNIDADES.map((u) => (
                              <option key={u.value} value={u.value}>
                                {u.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Summary */}
              <div className="border-t border-zinc-800/40 pt-4 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-white font-semibold tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {usarDescuento && descuento > 0 && (
                  <div className="flex items-center justify-between text-sm slide-in">
                    <span className="text-red-400">Descuento</span>
                    <span className="text-red-400 font-semibold tabular-nums">
                      -${Number(descuento).toFixed(2)}
                    </span>
                  </div>
                )}

                {usarAdicional && adicional > 0 && (
                  <div className="flex items-center justify-between text-sm slide-in">
                    <span className="text-amber-400">Adicional</span>
                    <span className="text-amber-400 font-semibold tabular-nums">
                      +${Number(adicional).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2.5 mt-1.5 border-t border-zinc-800/40">
                  <span className="text-zinc-300 font-semibold">Total</span>
                  <span className="text-lg font-bold text-emerald-400 tabular-nums">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Toggles */}
              <div className="border-t border-zinc-800/40 pt-4 mt-4 space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={usarDescuento}
                    onChange={(e) => setUsarDescuento(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-red-500 focus:ring-red-500/30 focus:ring-offset-0 cursor-pointer accent-red-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-red-400/80" />
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors font-medium">
                    Aplicar descuento
                  </span>
                </label>
                {usarDescuento && (
                  <div className="slide-in">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={descuento}
                      onChange={(e) => setDescuento(Number(e.target.value) || 0)}
                      placeholder="0.00"
                      className="!py-2 text-sm"
                    />
                  </div>
                )}

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={usarAdicional}
                    onChange={(e) => setUsarAdicional(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500/30 focus:ring-offset-0 cursor-pointer accent-amber-500"
                  />
                  <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors font-medium">
                    Cargo adicional
                  </span>
                </label>
                {usarAdicional && (
                  <div className="slide-in">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={adicional}
                      onChange={(e) => setAdicional(Number(e.target.value) || 0)}
                      placeholder="0.00"
                      className="!py-2 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="border-t border-zinc-800/40 pt-4 mt-4 space-y-3">
                <Select
                  label="Cliente"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  <option value="">Sin cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Método de Pago"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </Select>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={saving || carrito.length === 0}
                >
                  {saving ? "Procesando…" : "Completar Venta"}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => router.push("/ventas")}
                >
                  Cancelar
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
