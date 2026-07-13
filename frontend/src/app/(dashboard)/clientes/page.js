"use client";

import { useEffect, useState, useCallback } from "react";
import { clientesService } from "@/lib/api";
import Swal from "sweetalert2";
import { useFieldErrors } from "@/lib/errorHandler";
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
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { UserPlus, Pencil, Trash2, Users, Search } from "lucide-react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [meta, setMeta] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { setErrors, getFieldError, clearFieldError, clearAllErrors, showGlobalAlertFromError } = useFieldErrors();

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (search) params.search = search;
        const res = await clientesService.getAll(params);
        setClientes(res.data.data);
        setMeta(res.data.meta);
      } catch (e) {
        console.error("Error fetching clientes:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, [page, search, refreshKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

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
        await clientesService.update(editingId, formData);
        setSuccess("Cliente actualizado correctamente");
      } else {
        await clientesService.create(formData);
        setSuccess("Cliente creado correctamente");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ nombre: "", email: "", telefono: "", direccion: "" });
      clearAllErrors();
      setRefreshKey(k => k + 1);
    } catch (e) {
      setErrors(e);
      showGlobalAlertFromError(e, "Error al guardar cliente");
      setError(e.response?.data?.message || "Error al guardar cliente");
    }
  };

  const handleEdit = (cliente) => {
    clearAllErrors();
    setFormData({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    });
    setEditingId(cliente.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar cliente?",
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
      await clientesService.delete(id);
      setRefreshKey(k => k + 1);
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar cliente",
        icon: "error",
        background: "#18181b",
        color: "#fafafa",
        confirmButtonColor: "#10b981",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader
        title="Clientes"
        description="Gestiona tus clientes"
        actions={
          <Button size="sm" onClick={() => {
            clearAllErrors();
            setShowForm(true);
            setEditingId(null);
            setFormData({ nombre: "", email: "", telefono: "", direccion: "" });
          }}>
            <UserPlus className="w-4 h-4" />
            Nuevo Cliente
          </Button>
        }
      />

      <AlertBanner variant="success" message={success} onDismiss={() => setSuccess("")} />
      <AlertBanner variant="error" message={error} onDismiss={() => setError("")} />

      <div className="max-w-md">
        <Input
          placeholder="Buscar por nombre, email o teléfono..."
          value={searchInput}
          onChange={handleSearch}
          icon={<Search className="w-4 h-4 text-zinc-500" />}
        />
      </div>

      {showForm && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-6">
              {editingId ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Nombre" placeholder="Nombre del cliente" value={formData.nombre} onChange={handleInputChange("nombre")} error={getFieldError("nombre")} required />
              <Input label="Email" type="email" placeholder="correo@ejemplo.com" value={formData.email} onChange={handleInputChange("email")} error={getFieldError("email")} />
              <Input label="Teléfono" placeholder="+52 555 123 4567" value={formData.telefono} onChange={handleInputChange("telefono")} error={getFieldError("telefono")} />
              <Input label="Dirección" placeholder="Calle, número, colonia" value={formData.direccion} onChange={handleInputChange("direccion")} error={getFieldError("direccion")} />
              <div className="md:col-span-2 flex gap-3 pt-2">
                <Button type="submit">{editingId ? "Actualizar" : "Guardar"}</Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card><LoadingState type="table" /></Card>
      ) : clientes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="w-10 h-10" />}
            title={search ? "Sin resultados" : "No hay clientes"}
            description={search ? "Intenta con otro término de búsqueda" : "Registra tu primer cliente"}
            action={
              !search && (
                <Button size="sm" onClick={() => { clearAllErrors(); setShowForm(true); }}>
                  <UserPlus className="w-4 h-4" />
                  Crear Cliente
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableHeader>
            <TableBody>
              {clientes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell><span className="font-medium text-white">{c.nombre}</span></TableCell>
                  <TableCell className="text-zinc-400">{c.email || "—"}</TableCell>
                  <TableCell className="text-zinc-400">{c.telefono || "—"}</TableCell>
                  <TableCell className="text-zinc-400 max-w-[200px] truncate">{c.direccion || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(c)} className="!text-sky-400 hover:!text-sky-300 hover:!bg-sky-500/10">
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="!text-red-400 hover:!text-red-300 hover:!bg-red-500/10">
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination meta={meta} onPageChange={setPage} />
        </Card>
      )}
    </div>
  );
}
