"use client";

import { useEffect, useState, useCallback } from "react";
import { usuariosService } from "@/lib/api";
import Swal from "sweetalert2";
import { useFieldErrors } from "@/lib/errorHandler";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { UserPlus, Pencil, Trash2, Users } from "lucide-react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "empleado",
  });
  const {
    fieldErrors,
    setErrors,
    getFieldError,
    hasError,
    clearFieldError,
    clearAllErrors,
    showGlobalAlertFromError,
  } = useFieldErrors();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await usuariosService.getAll();
        setUsuarios(res.data);
      } catch (e) {
        console.error("Error fetching usuarios:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        const { password, ...dataSinPass } = formData;
        const data = password ? formData : dataSinPass;
        await usuariosService.update(editingId, data);
        setSuccess("Usuario actualizado correctamente");
      } else {
        await usuariosService.create(formData);
        setSuccess("Usuario creado correctamente");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ nombre: "", email: "", password: "", rol: "empleado" });
      clearAllErrors();
      const res = await usuariosService.getAll();
      setUsuarios(res.data);
    } catch (error) {
      setErrors(error);
      showGlobalAlertFromError(error);
      setError(error.response?.data?.message || "Error al guardar usuario");
    }
  };

  const handleEdit = (u) => {
    setFormData({ nombre: u.nombre, email: u.email, password: "", rol: u.rol });
    setEditingId(u.id);
    setShowForm(true);
    clearAllErrors();
  };

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (fieldErrors[field]) {
        clearFieldError(field);
      }
    },
    [fieldErrors, clearFieldError],
  );

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
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
      await usuariosService.delete(id);
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar usuario",
        icon: "error",
        background: "#18181b",
        color: "#fafafa",
        confirmButtonColor: "#10b981",
      });
    }
  };

  const openForm = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData({ nombre: "", email: "", password: "", rol: "empleado" });
    clearAllErrors();
  };

  if (loading) return <LoadingState type="table" />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader
        title="Usuarios"
        description="Gestiona los usuarios del sistema"
        actions={
          <Button onClick={openForm} size="sm">
            <UserPlus className="w-4 h-4" />
            Nuevo Usuario
          </Button>
        }
      />

      <AlertBanner variant="success" message={success} onDismiss={() => setSuccess("")} />
      <AlertBanner variant="error" message={error} onDismiss={() => setError("")} />

      {showForm && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-6">
              {editingId ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Nombre"
                placeholder="Nombre del usuario"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                error={getFieldError("nombre")}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={getFieldError("email")}
                required
              />
              <Input
                label={editingId ? "Nueva contraseña (opcional)" : "Contraseña"}
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={getFieldError("password")}
                required={!editingId}
              />
              <Select
                label="Rol"
                value={formData.rol}
                onChange={(e) => handleInputChange("rol", e.target.value)}
                error={getFieldError("rol")}
              >
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
              </Select>
              <div className="md:col-span-2 flex gap-3 pt-2">
                <Button type="submit">
                  {editingId ? "Actualizar" : "Guardar"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-16">
                  <EmptyState
                    icon={<Users className="w-10 h-10" />}
                    title="No hay usuarios"
                    description="Crea tu primer usuario para empezar"
                    action={
                      <Button size="sm" onClick={openForm}>
                        <UserPlus className="w-4 h-4" />
                        Crear Usuario
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <span className="font-medium text-white">{u.nombre}</span>
                  </TableCell>
                  <TableCell className="text-zinc-400">{u.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={u.rol === "admin" ? "purple" : "default"}
                      dot
                    >
                      {u.rol}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(u)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(u.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </Button>
                    </div>
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
