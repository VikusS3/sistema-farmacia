import { useState, useRef } from "react";
import { Productos } from "@/app/types";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RefreshCcw,
  Search,
} from "lucide-react";
import { fieldTypes } from "@/app/constants/productos";

type FilterableField = keyof typeof fieldTypes;

interface ProductosListCompraProps {
  productos: Productos[];
  agregarProducto: (
    producto: Productos,
    cantidad: number,
    unidad_compra: "caja" | "blister" | "unidad",
    precio_compra: number
  ) => void;
  refetchProductos: () => void;
}

export default function ProductosListCompra({
  productos,
  agregarProducto,
  refetchProductos,
}: ProductosListCompraProps) {
  const [searchField, setSearchField] =
    useState<FilterableField>("descripcion");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productosPorPagina = 4;

  const cantidadRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const unidadRefs = useRef<{ [key: number]: HTMLSelectElement | null }>({});
  const precioRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

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

      {/* Filtros */}
      <div className="sticky top-0 z-10 bg-background-200 py-4 mb-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as FilterableField)}
            className="p-3 border rounded-lg bg-background-200 text-text-200"
          >
            {Object.keys(fieldTypes).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>

          <div className="relative w-full">
            <input
              type="text"
              placeholder={`Buscar por ${searchField}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-3 pl-12 border border-background-300 rounded-lg bg-background-200 text-text-100 placeholder-text-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <Search
              className="absolute left-4 top-3.5 text-text-300"
              size={20}
            />
          </div>

          <button
            onClick={refetchProductos}
            className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-white rounded-lg hover:bg-primary-200 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
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
              className="flex flex-col justify-between p-6 border border-background-300 rounded-2xl bg-background-200 shadow-md hover:shadow-xl transition"
            >
              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-bold text-text-100 truncate">
                  {producto.nombre}{" "}
                  <span className="text-xs text-text-300">
                    ({producto.unidad_medida})
                  </span>
                </h3>
                <p className="text-sm text-text-300 truncate">
                  {producto.descripcion}
                </p>
                <div className="flex flex-col mb-2">
                  <label
                    htmlFor={`precio-${producto.id}`}
                    className="text-xs text-text-300"
                  >
                    Precio compra:
                  </label>
                  <input
                    id={`precio-${producto.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    ref={(el) => {
                      precioRefs.current[producto.id] = el;
                    }}
                    defaultValue={producto.precio_compra}
                    className="p-2 border border-background-300 rounded-lg bg-background-100 text-text-100 w-full"
                    placeholder="Precio compra"
                  />
                </div>
                <p
                  className={`text-base font-medium ${
                    producto.stock <= 0
                      ? "text-red-600"
                      : producto.stock < 20
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

              {/* Selector de unidad de compra */}
              <select
                ref={(el) => {
                  unidadRefs.current[producto.id] = el;
                }}
                defaultValue="unidad"
                className="mb-3 p-2 border border-background-300 rounded-lg bg-background-100 text-text-100"
              >
                <option value="unidad">Unidad</option>
                <option value="blister">Blister</option>
                <option value="caja">Caja</option>
              </select>

              {/* Cantidad */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <button
                  onClick={() => {
                    const input = cantidadRefs.current[producto.id];
                    if (input && Number(input.value) > 1) {
                      input.value = String(Number(input.value) - 1);
                    }
                  }}
                  className="p-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200"
                >
                  <Minus size={18} />
                </button>

                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  ref={(el) => {
                    cantidadRefs.current[producto.id] = el;
                  }}
                  className="w-16 p-2 text-center border border-background-300 rounded-lg bg-background-100 text-text-100"
                />

                <button
                  onClick={() => {
                    const input = cantidadRefs.current[producto.id];
                    if (input) {
                      input.value = String(Number(input.value) + 1);
                    }
                  }}
                  className="p-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Botón agregar */}
              <button
                onClick={() => {
                  const cantidad = Number(
                    cantidadRefs.current[producto.id]?.value || 1
                  );
                  const unidad_compra =
                    unidadRefs.current[producto.id]?.value || "unidad";
                  const precio_compra = Number(
                    precioRefs.current[producto.id]?.value ||
                      producto.precio_compra
                  );

                  agregarProducto(
                    producto,
                    cantidad,
                    unidad_compra as "caja" | "blister" | "unidad",
                    precio_compra
                  );
                }}
                className="w-full py-3 bg-primary-100 text-white font-bold rounded-lg hover:bg-primary-200"
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
        <div className="flex justify-center mt-8 gap-4 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-3 bg-primary-100 text-white rounded-full hover:bg-primary-200"
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
            disabled={
              currentPage >=
              Math.ceil(filteredProductos.length / productosPorPagina)
            }
            className="p-3 bg-primary-100 text-white rounded-full hover:bg-primary-200"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
