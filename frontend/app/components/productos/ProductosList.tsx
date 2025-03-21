/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Productos } from "@/app/types";

interface ProovedoresListProps {
  productos: Productos[];
  handleEdit: (id: number) => void;
  borrarProductos: (id: number) => void;
}

export default function ProductosList({
  productos,
  handleEdit,
  borrarProductos,
}: ProovedoresListProps) {
  const [globalFilter, setGlobalFilter] = useState(""); // Estado para la búsqueda
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 }); // Paginación

  // Definir columnas
  const columns = useMemo(
    () => [
      { accessorKey: "nombre", header: "Nombre" },
      { accessorKey: "descripcion", header: "Descripcion" },
      { accessorKey: "precio_compra", header: "Precio Compra" },
      { accessorKey: "precio_venta", header: "Precio Venta" },
      { accessorKey: "stock", header: "Stock" },
      { accessorKey: "stock_minimo", header: "Stock Minimo" },
      { accessorKey: "unidad_medida", header: "Unidad Medida" },
      {
        accessorKey: "fecha_vencimiento",
        header: "Fecha Vencimiento",
        cell: ({ cell }: { cell: any }) => {
          const date = new Date(cell.getValue());
          return date.toLocaleDateString();
        },
      },
      { accessorKey: "conversion", header: "Conversion de Unidad" },
      {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }: { row: any }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row.original.id)}
              className="bg-primary-200 text-white py-1 px-3 rounded-lg hover:bg-primary-100 transition-all focus:ring-2 focus:ring-primary-300"
              aria-label="Editar categoría"
            >
              Editar
            </button>
            <button
              onClick={() => borrarProductos(row.original.id)}
              className="bg-accent-100 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition-all focus:ring-2 focus:ring-red-400"
              aria-label="Borrar categoría"
            >
              Borrar
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, borrarProductos]
  );

  const table = useReactTable({
    data: productos,
    columns,
    state: { globalFilter, pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 bg-background-200 rounded-lg shadow-lg text-text-100">
      {/* Búsqueda global */}
      <input
        type="text"
        placeholder="Buscar producto..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-full p-2 mb-4 border border-background-300 rounded-md bg-background-300 text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-200"
      />

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border border-background-300 rounded-lg text-left">
          <thead className="bg-background-300 text-text-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-background-300"
              >
                {headerGroup.headers.map((column) => (
                  <th key={column.id} className="p-3">
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
                  className="border-b border-background-300 hover:bg-background-100 transition-all"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
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
                <td colSpan={columns.length} className="text-center p-4">
                  No hay productos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-background-100 text-text-200 rounded-md disabled:opacity-50 hover:bg-primary-100 transition-all"
        >
          Anterior
        </button>
        <span className="text-text-200">
          Página {pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-background-100 text-text-200 rounded-md disabled:opacity-50 hover:bg-primary-100 transition-all"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
