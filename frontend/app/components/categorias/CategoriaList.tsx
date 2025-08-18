/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Categorias } from "@/app/types";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash } from "lucide-react";

interface CategoriaListProps {
  categorias: Categorias[];
  handleEdit: (id: number) => void;
  borrarCategoria: (id: number) => void;
}

export default function CategoriaList({
  categorias,
  handleEdit,
  borrarCategoria,
}: CategoriaListProps) {
  const [globalFilter, setGlobalFilter] = useState(""); // Estado para la búsqueda
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 }); // Paginación

  // Definir columnas
  const columns = useMemo(
    () => [
      { accessorKey: "nombre", header: "Nombre" },
      { accessorKey: "descripcion", header: "Descripción" },
      {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }: { row: any }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row.original.id)}
              className="rounded-lg bg-primary-200 px-4 py-2 text-white hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
              aria-label="Editar categoría"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => borrarCategoria(row.original.id)}
              className="rounded-lg bg-accent-100 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              aria-label="Borrar categoría"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, borrarCategoria]
  );

  const table = useReactTable({
    data: categorias,
    columns,
    state: { globalFilter, pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 bg-background-200 rounded-2xl shadow-xl text-text-100">
      {/* Búsqueda global */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full p-3 border border-background-300 rounded-xl bg-background-100 text-text-100 placeholder:text-text-200 focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-background-300">
        <table className="w-full text-left">
          <thead className="bg-primary-100 text-white shadow">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    className="p-3 text-sm font-semibold uppercase tracking-wide"
                  >
                    {flexRender(
                      column.column.columnDef.header,
                      column.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <AnimatePresence>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, idx) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.1 }}
                    className={`border-t border-background-300 transition-all ${
                      idx % 2 === 0 ? "bg-background-100" : "bg-background-200"
                    } hover:bg-background-300`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td
                    colSpan={columns.length}
                    className="text-center p-5 text-text-200 italic"
                  >
                    No hay categorias disponibles.
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-primary-100 text-white rounded-lg disabled:opacity-50 hover:bg-primary-200 transition"
        >
          Anterior
        </button>
        <span className="text-sm text-text-200">
          Página {pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-primary-100 text-white rounded-lg disabled:opacity-50 hover:bg-primary-200 transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
