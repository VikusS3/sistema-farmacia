"use client";

import { useEffect, useState, useCallback } from "react";
import { categoriasService } from "@/lib/api";
import Swal from "sweetalert2";
import { useFieldErrors } from "@/lib/errorHandler";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { setErrors, getFieldError, hasError, clearFieldError, clearAllErrors, showGlobalAlertFromError } = useFieldErrors();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await categoriasService.getAll();
        setCategorias(res.data);
      } catch (e) {
        console.error("Error fetching categorias:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  const handleInputChange = useCallback((field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    clearFieldError(field);
  }, [formData, clearFieldError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await categoriasService.update(editingId, formData);
        setSuccess("Categoría actualizada correctamente");
      } else {
        await categoriasService.create(formData);
        setSuccess("Categoría creada correctamente");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ nombre: "", descripcion: "" });
      clearAllErrors();
      const res = await categoriasService.getAll();
      setCategorias(res.data);
    } catch (e) {
      setErrors(e);
      showGlobalAlertFromError(e, "Error al guardar categoría");
      setError(e.response?.data?.message || "Error al guardar categoría");
    }
  };

  const handleEdit = (cat) => {
    clearAllErrors();
    setFormData({ nombre: cat.nombre, descripcion: cat.descripcion });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#27272a",
      background: "#18181b",
      color: "#fafafa",
    });
    if (!result.isConfirmed) return;
    try {
      await categoriasService.delete(id);
      setCategorias(categorias.filter((c) => c.id !== id));
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar categoría",
        icon: "error",
        background: "#18181b",
        color: "#fafafa",
        confirmButtonColor: "#10b981",
      });
    }
  };

  if (loading) return <LoadingState type="card" />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader
        title="Categorías"
        description="Organiza tus productos por categorías"
        actions={
          <Button size="sm" onClick={() => {
            clearAllErrors(); setShowForm(true); setEditingId(null);
            setFormData({ nombre: "", descripcion: "" });
          }}>
            <Plus className="w-4 h-4" /> Nueva Categoría
          </Button>
        }
      />

      <AlertBanner variant="success" message={success} onDismiss={() => setSuccess("")} />
      <AlertBanner variant="error" message={error} onDismiss={() => setError("")} />

      {showForm && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-6">
              {editingId ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
              <Input label="Nombre" placeholder="Nombre de la categoría" value={formData.nombre} onChange={handleInputChange("nombre")} error={getFieldError("nombre")} required />
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Descripción</label>
                <textarea
                  placeholder="Descripción de la categoría"
                  value={formData.descripcion}
                  onChange={handleInputChange("descripcion")}
                  className={`w-full px-3.5 py-2.5 bg-zinc-800/50 border rounded-xl text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 ${hasError("descripcion") ? "border-red-500/50" : "border-zinc-700 hover:border-zinc-600"}`}
                  rows={2}
                />
                {hasError("descripcion") && (
                  <p className="mt-1.5 text-xs text-red-400">{getFieldError("descripcion")}</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit">{editingId ? "Actualizar" : "Guardar"}</Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {categorias.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <EmptyState icon={<Tags className="w-10 h-10" />} title="No hay categorías" description="Crea tu primera categoría" action={
              <Button size="sm" onClick={() => { clearAllErrors(); setShowForm(true); }}>
                <Plus className="w-4 h-4" /> Crear Categoría
              </Button>
            } />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categorias.map((cat) => (
            <Card key={cat.id} hover className="p-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">{cat.nombre}</h3>
                </div>
                {cat.descripcion && (
                  <p className="text-zinc-500 text-sm leading-relaxed">{cat.descripcion}</p>
                )}
              </div>
              <div className="mt-5 pt-4 border-t border-zinc-800/50 flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(cat)}>
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
