import { useState, useRef } from "react";
import { Productos } from "@/app/types";
import { Minus, Plus, Search, RefreshCcw } from "lucide-react";

interface ProductosListVentasProps {
  productos: Productos[];
  agregarProducto: (producto: Productos, cantidad: number) => void;
  refetchProductos: () => void;
}

export default function ProductosListVentas({
  productos,
  agregarProducto,
  refetchProductos,
}: ProductosListVentasProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const cantidadRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const filteredProductos = productos.filter((producto) =>
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-background-100 rounded-xl shadow-lg h-full overflow-y-auto">
      <h2 className="text-3xl font-bold text-primary-400 mb-6">
        Productos disponibles
      </h2>

      {/* Campo de búsqueda */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-12 border border-background-300 rounded-lg bg-background-200 text-text-100 placeholder-text-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
        <Search className="absolute left-4 top-3.5 text-text-300" size={20} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={refetchProductos}
          className="flex items-center gap-2 px-4 py-2 bg-primary-200 text-white rounded-lg hover:bg-primary-100 transition"
        >
          <RefreshCcw size={18} /> Refrescar productos
        </button>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProductos.length > 0 ? (
          filteredProductos.map((producto) => (
            <div
              key={producto.id}
              className="flex flex-col justify-between p-5 border border-background-300 rounded-xl bg-background-200 shadow-md hover:shadow-lg transition"
            >
              <div className="space-y-1 mb-4">
                <h3 className="text-lg font-semibold text-primary-300">
                  {producto.nombre}
                </h3>
                <p className="text-sm text-text-200">
                  <strong>Precio:</strong> ${producto.precio_venta}
                </p>
                <p className="text-sm text-text-200">
                  <strong>Descripción:</strong> {producto.descripcion}
                </p>
                <p className="text-sm text-text-200">
                  <strong>Stock:</strong> {producto.stock}
                </p>
              </div>

              {/* Selector de cantidad */}
              <div className="flex items-center justify-center gap-2 mb-4">
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
                  className="w-16 p-2 text-center border border-background-300 rounded bg-background-100 text-text-100"
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
                className="w-full py-2 bg-primary-300 text-white font-semibold rounded-lg hover:bg-primary-400 transition"
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
    </div>
  );
}
