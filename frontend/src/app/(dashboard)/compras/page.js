"use client";

import { useEffect, useState } from "react";
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
import { Plus, Package, Minus, Plus as PlusIcon, ShoppingCart } from "lucide-react";

export default function ComprasPage() {
  const { user } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const fetchData = async () => {
    try {
      const [comprasRes, proveedoresRes, productosRes] = await Promise.all([
        comprasService.getAll(),
        proveedoresService.getAll(),
        productosService.getAll(),
      ]);
      setCompras(comprasRes.data);
      setProveedores(proveedoresRes.data);
      setProductos(productosRes.data);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      fetchData();
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
  }, [user]);

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
          precio: Number(producto.precio_unidad) || 0,
          tipo_compra: "unidad",
          require_lote: producto.require_lote || false,
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
      fetchData();
    } catch (e) {
      setError(e.response?.data?.message || "Error al registrar compra");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("es-ES");

  if (loading) return <LoadingState type="table" />;

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
                  <div
                    key={item.producto_id}
                    className="p-3 bg-zinc-800/30 rounded-xl border border-zinc-800/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">{item.nombre}</span>
                      <div className="flex items-center gap-2">
                        <Select
                          value={item.tipo_compra}
                          onChange={(e) => actualizarCampo(item.producto_id, "tipo_compra", e.target.value)}
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
                        <span className="text-emerald-400 text-sm font-medium tabular-nums">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {item.require_lote && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/50">
                        <Input
                          label="N° de Lote"
                          placeholder="Ej: LOTE-001"
                          value={item.numero_lote}
                          onChange={(e) => actualizarCampo(item.producto_id, "numero_lote", e.target.value)}
                        />
                        <Input
                          label="Fecha de Vencimiento"
                          type="date"
                          value={item.fecha_vencimiento}
                          onChange={(e) => actualizarCampo(item.producto_id, "fecha_vencimiento", e.target.value)}
                        />
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
                    <Input
                      label="Descuento"
                      type="number"
                      step="0.01"
                      value={descuento}
                      onChange={(e) => setDescuento(Number(e.target.value) || 0)}
                      wrapperClassName="w-40"
                    />
                  </div>
                  <div className="flex justify-end items-center gap-4">
                    <span className="text-zinc-400 text-sm">Total:</span>
                    <span className="text-lg font-bold text-emerald-400">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <Input
                label="Observaciones"
                placeholder="Notas adicionales..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSubmit} disabled={saving || carrito.length === 0}>
                {saving ? "Guardando..." : (
                  <><ShoppingCart className="w-4 h-4" /> Guardar Compra</>
                )}
              </Button>
              <Button variant="secondary" onClick={() => { setShowForm(false); setCarrito([]); }}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableHeader>
          <TableBody>
            {compras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-16">
                  <EmptyState
                    icon={<Package className="w-10 h-10" />}
                    title="No hay compras"
                    description="Registra tu primera compra"
                    action={
                      <Button size="sm" onClick={() => setShowForm(true)} disabled={!cajaId}>
                        <Plus className="w-4 h-4" /> Nueva Compra
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              compras.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs text-zinc-500">#{c.id}</TableCell>
                  <TableCell className="text-zinc-300">{formatDate(c.fecha)}</TableCell>
                  <TableCell className="text-white font-medium">{c.proveedor?.nombre}</TableCell>
                  <TableCell className="text-right text-emerald-400 font-medium">
                    ${Number(c.total).toFixed(2)}
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
