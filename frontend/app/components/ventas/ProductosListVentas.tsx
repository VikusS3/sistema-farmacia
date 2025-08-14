import { useState, useRef } from "react";
import { Productos } from "@/app/types";
import {
  Minus,
  Plus,
  Search,
  RefreshCcw,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { fieldTypes } from "@/app/constants/productos";

type FilterableField = keyof typeof fieldTypes;

interface ProductosListVentasProps {
  productos: Productos[];
  agregarProducto: (
    producto: Productos,
    cantidad: number,
    unidad: string
  ) => void;
  refetchProductos: () => void;
}

export default function ProductosListVentas({
  productos,
  agregarProducto,
  refetchProductos,
}: ProductosListVentasProps) {
  const [searchField, setSearchField] =
    useState<FilterableField>("descripcion");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productosPorPagina = 4;

  // Add these refs with proper typing
  const unidadRefs = useRef<{ [key: string]: HTMLSelectElement | null }>({});
  const cantidadRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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
      <h2 className="text-3xl font-bold text-text-100 mb-6">
        Productos disponibles
      </h2>

      {/* Header sticky con filtros */}
      <div className="sticky top-0 z-10 bg-background-200 py-4 mb-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Selector de campo */}
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as FilterableField)}
            className="p-3 border rounded-lg bg-background-200 text-text-200"
          >
            {Object.keys(fieldTypes).map((key) => (
              <option
                key={key}
                value={key}
                className="text-text-200 font-semibold"
              >
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
            className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-white rounded-lg hover:bg-primary-200 transition"
          >
            <RefreshCcw size={18} /> Refrescar
          </button>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {paginatedProductos.length > 0 ? (
          paginatedProductos.map((producto) => (
            <div
              key={producto.id}
              className="flex flex-col justify-between p-6 border border-background-300 rounded-2xl bg-background-200 shadow-md hover:shadow-xl transition focus-within:ring-2 focus-within:ring-primary-300"
              role="region"
              aria-label={`Producto: ${producto.nombre}`}
            >
              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-bold text-text-100 truncate">
                  {producto.nombre}{" "}
                  <span className="text-xs text-text-300">
                    ({producto.unidad_medida})
                  </span>
                </h3>
                <p className="text-sm text-text-300">{producto.descripcion}</p>
                <p className="text-base text-text-200">
                  <strong>Precio:</strong> ${producto.precio_venta}
                </p>
                <p
                  className={`text-sm font-medium ${
                    producto.stock <= 0
                      ? "text-red-600"
                      : producto.stock < 10
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  Stock: {producto.stock}
                </p>
                <p className="text-xs text-text-300 italic">
                  1 {producto.unidad_venta} equivale a{" "}
                  {producto.factor_conversion} {producto.unidad_medida}
                </p>
              </div>
              {/* SELECTOR DE UNIDAD */}
              <div className="mb-3">
                <label className="block text-sm text-text-300 mb-1">
                  Unidad
                </label>
                <select
                  defaultValue={producto.unidad_medida}
                  ref={(el) => {
                    unidadRefs.current[producto.id] = el;
                  }}
                  className="w-full p-2 border border-background-300 rounded-lg bg-background-100 text-text-100"
                >
                  <option value={producto.unidad_medida}>
                    {producto.unidad_medida} (unidad mínima)
                  </option>
                  <option value={producto.unidad_venta}>
                    {producto.unidad_venta}
                  </option>
                  {producto.factor_caja > 0 && (
                    <option value="caja">Caja</option>
                  )}
                </select>
              </div>

              {/* CANTIDAD */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <button
                  aria-label="Disminuir cantidad"
                  onClick={() => {
                    const input = cantidadRefs.current[producto.id];
                    if (input && Number(input.value) > 1) {
                      input.value = String(Number(input.value) - 1);
                    }
                  }}
                  className="p-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <Minus size={18} />
                </button>

                <label htmlFor={`cantidad-${producto.id}`} className="sr-only">
                  Cantidad para {producto.nombre}
                </label>
                <input
                  id={`cantidad-${producto.id}`}
                  type="number"
                  min="1"
                  defaultValue="1"
                  ref={(el) => {
                    cantidadRefs.current[producto.id] = el;
                  }}
                  className="w-16 p-2 text-center border border-background-300 rounded-lg bg-background-100 text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />

                <button
                  aria-label="Aumentar cantidad"
                  onClick={() => {
                    const input = cantidadRefs.current[producto.id];
                    if (input) {
                      input.value = String(Number(input.value) + 1);
                    }
                  }}
                  className="p-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* BOTÓN AGREGAR */}
              <button
                onClick={() => {
                  const cantidad = Number(
                    cantidadRefs.current[producto.id]?.value || 1
                  );
                  const unidadSeleccionada =
                    unidadRefs.current[producto.id]?.value ||
                    producto.unidad_venta;
                  agregarProducto(producto, cantidad, unidadSeleccionada);
                }}
                className="w-full py-3 bg-primary-100 text-white font-bold rounded-lg hover:bg-primary-200 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
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
      {/* POSIBLEMENTE PASE A FELCHAS DE SIGUENTE */}
      {filteredProductos.length > productosPorPagina && (
        <div
          className="flex justify-center mt-8 gap-4 items-center"
          role="navigation"
          aria-label="Paginación de productos"
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            aria-label="Página anterior"
            className="p-3 bg-primary-100 text-white rounded-full hover:bg-primary-200 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </button>
          <span className="text-base text-text-100 font-medium">
            Página {currentPage} de{" "}
            {Math.ceil(filteredProductos.length / productosPorPagina)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredProductos.length / productosPorPagina)
                )
              )
            }
            aria-label="Página siguiente"
            className="p-3 bg-primary-100 text-white rounded-full hover:bg-primary-200 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
            disabled={
              currentPage >=
              Math.ceil(filteredProductos.length / productosPorPagina)
            }
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
