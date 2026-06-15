"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { productosService } from "@/lib/api";
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
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Plus, Search, Pencil, Trash2, Pill } from "lucide-react";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await productosService.getAll();
        setProductos(res.data);
      } catch (e) {
        console.error("Error fetching productos:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
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
      await productosService.delete(id);
      setProductos(productos.filter((p) => p.id !== id));
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar producto",
        icon: "error",
        background: "#18181b",
        color: "#fafafa",
        confirmButtonColor: "#10b981",
      });
    }
  };

  const filteredProductos = productos.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <LoadingState type="table" />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      <PageHeader
        title="Productos"
        description="Gestiona tu catálogo de productos"
        actions={
          <Link href="/productos/nuevo">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Nuevo Producto
            </Button>
          </Link>
        }
      />

      <div className="max-w-md">
        <Input
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4 text-zinc-500" />}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Precio Venta</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableHeader>
          <TableBody>
            {filteredProductos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16">
                  <EmptyState
                    icon={<Pill className="w-10 h-10" />}
                    title={searchTerm ? "Sin resultados" : "No hay productos"}
                    description={searchTerm ? "Intenta con otro término de búsqueda" : "Agrega tu primer producto"}
                    action={
                      !searchTerm && (
                        <Link href="/productos/nuevo">
                          <Button size="sm">
                            <Plus className="w-4 h-4" />
                            Nuevo Producto
                          </Button>
                        </Link>
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredProductos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>
                    <div>
                      <span className="font-medium text-white">{producto.nombre}</span>
                      {producto.descripcion && (
                        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{producto.descripcion}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {producto.categoria_nombre || (
                      <span className="text-zinc-600">Sin categoría</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={producto.stock <= producto.stock_minimo ? "warning" : "success"}
                      dot
                    >
                      {producto.stock} {producto.stock <= producto.stock_minimo ? "(mín)" : ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-emerald-400 font-medium">
                    ${Number(producto.precio_unidad).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/productos/${producto.id}`}>
                        <Button variant="ghost" size="sm" className="!text-sky-400 hover:!text-sky-300 hover:!bg-sky-500/10">
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(producto.id)}
                        className="!text-red-400 hover:!text-red-300 hover:!bg-red-500/10"
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
