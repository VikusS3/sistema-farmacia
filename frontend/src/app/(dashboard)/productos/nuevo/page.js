'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { productosService, categoriasService } from '@/lib/api';
import { useFieldErrors } from '@/lib/errorHandler';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PageHeader } from '@/components/ui/PageHeader';
import { ArrowLeft, Save } from 'lucide-react';

export default function NuevoProductoPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria_id: '',
    precio_unidad: 0,
    precio_blister: 0,
    precio_caja: 0,
    unidades_por_blister: 1,
    blisters_por_caja: 1,
    stock: 0,
    stock_minimo: 10,
    require_lote: false,
    unidad_medida: 'unidad',
  });
  const { setErrors, getFieldError, hasError, clearFieldError, clearAllErrors, showGlobalAlertFromError } = useFieldErrors();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await categoriasService.getAll();
        setCategorias(res.data);
      } catch (e) {
        console.error('Error fetching categorias:', e);
      }
    };
    fetchCategorias();
  }, []);

  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
    clearFieldError(field);
  }, [formData, clearFieldError]);

  const buildPayload = () => ({
    nombre: formData.nombre,
    descripcion: formData.descripcion || undefined,
    categoria_id: formData.categoria_id ? Number(formData.categoria_id) : undefined,
    precio_unidad: Number(formData.precio_unidad) || 0,
    precio_blister: formData.precio_blister ? Number(formData.precio_blister) : undefined,
    precio_caja: formData.precio_caja ? Number(formData.precio_caja) : undefined,
    unidades_por_blister: Number(formData.unidades_por_blister) || 1,
    blisters_por_caja: Number(formData.blisters_por_caja) || 1,
    stock: Number(formData.stock) || 0,
    stock_minimo: Number(formData.stock_minimo) || 10,
    require_lote: formData.require_lote,
    unidad_medida: formData.unidad_medida,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearAllErrors();

    try {
      await productosService.create(buildPayload());
      Swal.fire({
        title: 'Éxito',
        text: 'Producto creado correctamente',
        icon: 'success',
        background: '#18181b',
        color: '#fafafa',
        confirmButtonColor: '#10b981',
      });
      router.push('/productos');
    } catch (e) {
      setErrors(e);
      showGlobalAlertFromError(e, 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader
        title="Nuevo Producto"
        description="Completa los datos para registrar un nuevo producto"
        actions={
          <Button variant="secondary" size="sm" onClick={() => router.push('/productos')}>
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Nombre"
                  placeholder="Nombre del producto"
                  value={formData.nombre}
                  onChange={handleInputChange("nombre")}
                  error={getFieldError("nombre")}
                  required
                />
                <Select
                  label="Categoría"
                  value={formData.categoria_id}
                  onChange={handleInputChange("categoria_id")}
                  error={getFieldError("categoria_id")}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </Select>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={handleInputChange("descripcion")}
                    className={`w-full px-3.5 py-2.5 bg-zinc-800/50 border rounded-xl text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 resize-none ${hasError("descripcion") ? "border-red-500/50" : "border-zinc-700 hover:border-zinc-600"}`}
                    rows={2}
                  />
                  {hasError("descripcion") && (
                    <p className="mt-1.5 text-xs text-red-400">{getFieldError("descripcion")}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800/50 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Precios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Precio por Unidad"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.precio_unidad}
                  onChange={handleInputChange("precio_unidad")}
                  error={getFieldError("precio_unidad")}
                />
                <Input
                  label="Precio por Blister"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.precio_blister}
                  onChange={handleInputChange("precio_blister")}
                  error={getFieldError("precio_blister")}
                />
                <Input
                  label="Precio por Caja"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.precio_caja}
                  onChange={handleInputChange("precio_caja")}
                  error={getFieldError("precio_caja")}
                />
              </div>
            </div>

            <div className="border-t border-zinc-800/50 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Inventario</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleInputChange("stock")}
                  error={getFieldError("stock")}
                />
                <Input
                  label="Stock Mínimo"
                  type="number"
                  placeholder="10"
                  value={formData.stock_minimo}
                  onChange={handleInputChange("stock_minimo")}
                  error={getFieldError("stock_minimo")}
                />
              </div>
            </div>

            <div className="border-t border-zinc-800/50 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Conversión de Unidades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Unidades por Blister"
                  type="number"
                  placeholder="1"
                  value={formData.unidades_por_blister}
                  onChange={handleInputChange("unidades_por_blister")}
                  error={getFieldError("unidades_por_blister")}
                />
                <Input
                  label="Blisters por Caja"
                  type="number"
                  placeholder="1"
                  value={formData.blisters_por_caja}
                  onChange={handleInputChange("blisters_por_caja")}
                  error={getFieldError("blisters_por_caja")}
                />
                <Select
                  label="Unidad de Medida"
                  value={formData.unidad_medida}
                  onChange={handleInputChange("unidad_medida")}
                  error={getFieldError("unidad_medida")}
                >
                  <option value="unidad">Unidad</option>
                  <option value="ml">Mililitro (ml)</option>
                  <option value="g">Gramo (g)</option>
                </Select>
              </div>
            </div>

            <div className="border-t border-zinc-800/50 pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="require_lote"
                  checked={formData.require_lote}
                  onChange={handleInputChange("require_lote")}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/30 focus:ring-2"
                />
                <label htmlFor="require_lote" className="text-sm text-zinc-300">Controlar por lotes y vencimiento</label>
              </div>
            </div>

            <div className="border-t border-zinc-800/50 pt-6 flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Guardar Producto
                  </>
                )}
              </Button>
              <Button type="button" variant="secondary" onClick={() => router.push('/productos')}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
