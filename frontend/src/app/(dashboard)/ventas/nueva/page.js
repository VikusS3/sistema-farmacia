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
  Tag, Sparkles, Package, Pill, Box,
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

  if (loading) return <LoadingState type="default" />;

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <PageHeader
        title="Nueva Venta"
        description="Registra una venta en el sistema"
      />

      <AlertBanner variant="error" message={error} onDismiss={() => setError("")} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o código..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {productosFiltrados.map((producto) => {
              const precios = mostrarPrecios(producto);
              return (
                <div
                  key={producto.id}
                  className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-200 hover:shadow-lg hover:shadow-black/10 flex flex-col"
                >
                  <p className="text-white font-medium text-sm truncate mb-2">
                    {producto.nombre}
                  </p>
                  <div className="space-y-0.5 mb-2">
                    {precios.map((p) => (
                      <p key={p.label} className="text-emerald-400 text-xs font-medium">
                        {p.label}: ${p.value.toFixed(2)}
                      </p>
                    ))}
                  </div>
                  <p className="text-zinc-600 text-xs mb-2">
                    Stock: {producto.stock} {producto.unidad_medida || "und"}
                  </p>
                  <div className="flex gap-1.5 mt-auto">
                    <button
                      onClick={() => agregarProducto(producto, "unidad")}
                      className="flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    >
                      + Und
                    </button>
                    {precios.some((p) => p.label === "Blister") && (
                      <button
                        onClick={() => agregarProducto(producto, "blister")}
                        className="flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                      >
                        + Blister
                      </button>
                    )}
                    {precios.some((p) => p.label === "Caja") && (
                      <button
                        onClick={() => agregarProducto(producto, "caja")}
                        className="flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
                      >
                        + Caja
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <ShoppingCart className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Carrito</h2>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto mb-5 pr-1">
                {carrito.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-8 h-8 mx-auto text-zinc-700 mb-2" />
                    <p className="text-zinc-600 text-sm">Carrito vacío</p>
                  </div>
                ) : (
                  carrito.map((item) => {
                    const unidadCfg = UNIDADES.find((u) => u.value === item.unidad_venta);
                    const badgeColor = unidadCfg?.color || "emerald";
                    const colorMap = {
                      emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                      violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
                    };

                    return (
                      <div
                        key={`${item.producto_id}-${item.unidad_venta}`}
                        className="p-3 bg-zinc-800/30 rounded-xl border border-zinc-800/50 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${colorMap[badgeColor]}`}>
                              {unidadCfg?.label || "Und"}
                            </span>
                            <p className="text-white text-sm font-medium truncate">
                              {item.nombre}
                            </p>
                          </div>
                          <button
                            onClick={() => eliminarProducto(item.producto_id, item.unidad_venta)}
                            className="w-6 h-6 flex items-center justify-center rounded text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <select
                              value={item.unidad_venta}
                              onChange={(e) => actualizarUnidadVenta(item.producto_id, item.unidad_venta, e.target.value)}
                              className="w-full appearance-none px-2.5 py-1.5 text-xs bg-zinc-900/80 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 cursor-pointer"
                            >
                              {UNIDADES.map((u) => (
                                <option key={u.value} value={u.value}>
                                  {u.label}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                              <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          <span className="text-xs text-zinc-500 whitespace-nowrap">
                            @ ${item.precio.toFixed(2)} /{unidadCfg?.label?.toLowerCase() || "und"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-zinc-900/80 rounded-lg p-0.5">
                            <button
                              onClick={() => actualizarCantidad(item.producto_id, item.unidad_venta, item.cantidad - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-white text-sm font-medium w-8 text-center tabular-nums">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => actualizarCantidad(item.producto_id, item.unidad_venta, item.cantidad + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-white text-sm font-semibold tabular-nums">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-zinc-800/50 pt-4 mb-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white font-medium tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {usarDescuento && descuento > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-red-400">Descuento</span>
                    <span className="text-red-400 font-medium tabular-nums">
                      -${Number(descuento).toFixed(2)}
                    </span>
                  </div>
                )}

                {usarAdicional && adicional > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-amber-400">Adicional</span>
                    <span className="text-amber-400 font-medium tabular-nums">
                      +${Number(adicional).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-zinc-800/50">
                  <span className="text-zinc-300 font-semibold">Total</span>
                  <span className="text-xl font-bold text-emerald-400 tabular-nums">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={usarDescuento}
                    onChange={(e) => setUsarDescuento(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer accent-emerald-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    Aplicar descuento
                  </span>
                </label>
                {usarDescuento && (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={descuento}
                    onChange={(e) => setDescuento(Number(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                )}

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={usarAdicional}
                    onChange={(e) => setUsarAdicional(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer accent-emerald-500"
                  />
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    Cargo adicional
                  </span>
                </label>
                {usarAdicional && (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={adicional}
                    onChange={(e) => setAdicional(Number(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  {saving ? "Procesando..." : "Completar Venta"}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
