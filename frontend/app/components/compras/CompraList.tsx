/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Compra } from "@/app/types";
import { motion, AnimatePresence } from "framer-motion";

interface CompraListProps {
  compras: Compra[];
  handleEdit: (id: number) => void;
  borrarCompra: (id: number) => void;
  handleVerProductosCompra: (id: number) => void;
}

export default function CompraList({
  compras,
  handleVerProductosCompra,
}: CompraListProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const columns = useMemo(
    () => [
      { accessorKey: "proveedor_nombre", header: "Proveedor" },
      {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ cell }: { cell: any }) => {
          const date = new Date(cell.getValue());
          return date.toLocaleDateString();
        },
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ cell }: { cell: any }) =>
          `S/ ${parseFloat(cell.getValue()).toFixed(2)}`,
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }: { row: any }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleVerProductosCompra(row.original.id)}
              className="px-3 py-1.5 bg-primary-200 text-white rounded-xl shadow hover:bg-primary-100 transition duration-200 text-sm"
            >
              Ver productos
            </button>
          </div>
        ),
      },
    ],
    [handleVerProductosCompra]
  );

  const table = useReactTable({
    data: compras,
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
          placeholder="Buscar compra..."
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
                    No hay compras disponibles.
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
