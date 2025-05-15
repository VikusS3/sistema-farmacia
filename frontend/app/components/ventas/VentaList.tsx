/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Venta } from "@/app/types";
import { Printer } from "lucide-react";
import { fetchVentaTicket } from "@/app/services/ventasServices";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface VentaListProps {
  ventas: Venta[];
  handleEdit: (id: number) => void;
  borrarVenta: (id: number) => void;
  handleVerProductosVenta: (id: number) => void;
}
export default function VentaList({
  ventas,
  handleVerProductosVenta,
}: VentaListProps) {
  const MySwal = withReactContent(Swal);
  const [globalFilter, setGlobalFilter] = useState(""); // Estado para la búsqueda
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 }); // Paginación

  const handleVerTicket = React.useCallback(
    async (id: number) => {
      try {
        const blob = await fetchVentaTicket(id);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } catch (error) {
        console.error("Error al generar ticket:", error);
        MySwal.fire({
          icon: "error",
          title: "Error al generar ticket",
          text: "No se pudo generar el ticket. Por favor, inténtelo de nuevo más tarde.",
        });
      }
    },
    [MySwal]
  );

  const columns = useMemo(
    () => [
      { accessorKey: "cliente_nombre", header: "Cliente" },
      {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ cell }: { cell: any }) => {
          const date = new Date(cell.getValue());
          return date.toLocaleDateString();
        },
      },
      { accessorKey: "total", header: "Total" },
      {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }: { row: any }) => (
          <div className="flex gap-3">
            <button
              onClick={() => handleVerProductosVenta(row.original.id)}
              className="bg-primary-200 text-white py-2 px-4 rounded-md shadow-sm hover:bg-primary-100 transition-all duration-200 focus:ring-2 focus:ring-primary-300 focus:outline-none"
              aria-label="Ver productos"
            >
              Ver productos
            </button>
            <button
              onClick={() => handleVerTicket(row.original.id)}
              className=" flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              aria-label="Ver boleta de venta"
            >
              <Printer size={16} />
              Ver boleta
            </button>

            {/* <button
              onClick={() => borrarVenta(row.original.id)}
              className="bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-600 transition-all duration-200 focus:ring-2 focus:ring-red-400 focus:outline-none"
              aria-label="Borrar categoría"
            >
              Borrar
            </button> */}
          </div>
        ),
      },
    ],
    [handleVerProductosVenta, handleVerTicket]
  );

  const table = useReactTable({
    data: ventas,
    columns,
    state: { globalFilter, pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 bg-background-300 rounded-xl shadow-lg text-text-100 mt-5">
      {/* Búsqueda global */}
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-full p-3 mb-5 border border-background-100 rounded-lg bg-background-200 text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
      />

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-background-100">
        <table className="w-full text-left">
          <thead className="bg-background-200 text-text-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-background-400"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    className="p-4 font-semibold uppercase tracking-wide"
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-background-100 hover:bg-background-100 transition-all duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-6 text-text-300"
                >
                  No hay ventas disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-5 py-2 bg-background-100 text-text-200 rounded-lg disabled:opacity-50 hover:bg-primary-200 transition-all duration-200"
        >
          Anterior
        </button>
        <span className="text-text-200 font-medium">
          Página {pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-5 py-2 bg-background-100 text-text-200 rounded-lg disabled:opacity-50 hover:bg-primary-200 transition-all duration-200"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
