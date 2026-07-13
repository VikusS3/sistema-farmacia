"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { productosService } from "@/lib/api";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
import { Pagination } from "@/components/ui/Pagination";
import { Plus, Search, Pencil, Trash2, Pill } from "lucide-react";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [meta, setMeta] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (search) params.search = search;
        const res = await productosService.getAll(params);
        setProductos(res.data.data);
        setMeta(res.data.meta);
      } catch (e) {
        console.error("Error fetching productos:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [page, search, refreshKey]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

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
      setRefreshKey(k => k + 1);
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
          placeholder="Buscar por nombre..."
          value={searchInput}
          onChange={handleSearch}
          icon={<Search className="w-4 h-4 text-zinc-500" />}
        />
      </div>

      {loading ? (
        <Card><LoadingState type="table" /></Card>
      ) : productos.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Pill className="w-10 h-10" />}
            title={search ? "Sin resultados" : "No hay productos"}
            description={search ? "Intenta con otro término de búsqueda" : "Agrega tu primer producto"}
            action={
              !search && (
                <Link href="/productos/nuevo">
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                    Nuevo Producto
                  </Button>
                </Link>
              )
            }
          />
        </Card>
      ) : (
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
              {productos.map((producto) => (
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
                    <Badge variant={producto.stock <= producto.stock_minimo ? "warning" : "success"} dot>
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
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(producto.id)} className="!text-red-400 hover:!text-red-300 hover:!bg-red-500/10">
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
