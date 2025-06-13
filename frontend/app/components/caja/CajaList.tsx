/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Caja } from "@/app/types";
import dayjs from "dayjs";
import { CheckCircle, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CajaListProps {
  cajas: Caja[];
}

export default function CajaList({ cajas }: CajaListProps) {
  const [globalFilter, setGlobalFilter] = useState(""); // Búsqueda
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 }); // Paginación

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "monto_apertura", header: "Monto Apertura" },
      { accessorKey: "fecha_apertura", header: "Fecha Apertura" },
      { accessorKey: "monto_cierre", header: "Monto Cierre" },
      { accessorKey: "fecha_cierre", header: "Fecha Cierre" },
      {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ getValue }: any) => {
          const estado = getValue() as string;
          const isAbierto = estado.toLowerCase() === "abierta";
          const Icon = isAbierto ? CheckCircle : XCircle;
          const colorClass = isAbierto
            ? "text-green-600 bg-green-100 border border-green-400"
            : "text-red-600 bg-red-100 border border-red-400";

          return (
            <span
              className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium ${colorClass}`}
            >
              <Icon />
              {estado}
            </span>
          );
        },
      },
    ],
    []
  );

  // ✅ Procesar cajas solo una vez con useMemo
  const tableData = useMemo(() => {
    return cajas.map((caja) => ({
      ...caja,
      fecha_apertura: dayjs(caja.fecha_apertura).format("DD/MM/YYYY HH:mm"),
      fecha_cierre: caja.fecha_cierre
        ? dayjs(caja.fecha_cierre).format("DD/MM/YYYY HH:mm")
        : "",
    }));
  }, [cajas]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { globalFilter, pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 bg-background-200 rounded-2xl shadow-xl text-text-100">
      {/* Búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar caja..."
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
                    No hay cajas disponibles.
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
