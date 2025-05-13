import { useState, useRef } from "react";
import { Productos } from "@/app/types";
import { Minus, Plus, RefreshCcw, Search } from "lucide-react";
import { fieldTypes } from "@/app/constants/productos";

type FilterableField = keyof typeof fieldTypes;

interface ProductosListVentasProps {
  productos: Productos[];
  agregarProducto: (producto: Productos, cantidad: number) => void;
  refetchProductos: () => void;
}

export default function ProductosListCompra({
  productos,
  agregarProducto,
  refetchProductos,
}: ProductosListVentasProps) {
  const [searchField, setSearchField] =
    useState<FilterableField>("descripcion");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productosPorPagina = 20;

  const cantidadRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const filteredProductos = productos.filter((producto) => {
    const fieldValue = producto[searchField];
    return String(fieldValue).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const paginatedProductos = filteredProductos.slice(
    (currentPage - 1) * productosPorPagina,
    currentPage * productosPorPagina
  );

  return (
    <div className="p-6 bg-background-100 rounded-xl shadow-lg h-full overflow-y-auto">
      <h2 className="text-3xl font-bold text-primary-400 mb-6">
        Productos disponibles
      </h2>

      {/* Header sticky con filtros */}
      <div className="sticky top-0 z-10 bg-background-100 py-4 mb-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Selector de campo */}
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as FilterableField)}
            className="p-3 border rounded-lg bg-background-200 text-text-100"
          >
            {Object.keys(fieldTypes).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>

          {/* Input de búsqueda */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder={`Buscar por ${searchField}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reinicia a la página 1
              }}
              className="w-full p-3 pl-12 border border-background-300 rounded-lg bg-background-200 text-text-100 placeholder-text-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <Search
              className="absolute left-4 top-3.5 text-text-300"
              size={20}
            />
          </div>

          {/* Botón de refrescar */}
          <button
            onClick={refetchProductos}
            className="flex items-center gap-2 px-4 py-2 bg-primary-200 text-white rounded-lg hover:bg-primary-100 transition"
          >
            <RefreshCcw size={18} /> Refrescar
          </button>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {paginatedProductos.length > 0 ? (
          paginatedProductos.map((producto) => (
            <div
              key={producto.id}
              className="flex flex-col justify-between p-4 border border-background-300 rounded-xl bg-background-200 shadow hover:shadow-lg transition"
            >
              <div className="space-y-1 mb-3">
                <h3 className="text-base font-semibold text-primary-300 truncate">
                  {producto.nombre}
                </h3>
                <p className="text-xs text-text-200 truncate">
                  {producto.descripcion}
                </p>
                <p className="text-sm text-text-200">
                  <strong>Precio:</strong> ${producto.precio_venta}
                </p>
                <p
                  className={`text-sm font-medium ${
                    producto.stock <= 0
                      ? "text-red-500"
                      : producto.stock < producto.stock_minimo
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  Stock: {producto.stock}
                </p>
              </div>

              {/* Selector de cantidad */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <button
                  onClick={() => {
                    const input = cantidadRefs.current[producto.id];
                    if (input && Number(input.value) > 1) {
                      input.value = String(Number(input.value) - 1);
                    }
                  }}
                  className="p-2 bg-primary-100 text-white rounded hover:bg-primary-200 transition"
                >
                  <Minus size={16} />
                </button>

                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  ref={(el) => {
                    cantidadRefs.current[producto.id] = el;
                  }}
                  className="w-14 p-2 text-center border border-background-300 rounded bg-background-100 text-text-100"
                />

                <button
                  onClick={() => {
                    const input = cantidadRefs.current[producto.id];
                    if (input) {
                      input.value = String(Number(input.value) + 1);
                    }
                  }}
                  className="p-2 bg-primary-100 text-white rounded hover:bg-primary-200 transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => {
                  const cantidad = Number(
                    cantidadRefs.current[producto.id]?.value || 1
                  );
                  agregarProducto(producto, cantidad);
                }}
                className="w-full py-2 bg-primary-100 text-white font-semibold rounded-lg hover:bg-primary-400 transition"
              >
                Agregar al carrito
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-accent-100 py-6">
            No se encontraron productos.
          </p>
        )}
      </div>

      {/* Paginación */}
      {filteredProductos.length > productosPorPagina && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({
            length: Math.ceil(filteredProductos.length / productosPorPagina),
          }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded font-medium ${
                currentPage === idx + 1
                  ? "bg-primary-300 text-white"
                  : "bg-background-300 text-text-200 hover:bg-background-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
