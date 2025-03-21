import { useState, useRef } from "react";
import { Productos } from "@/app/types";
import { Minus, Plus, Search } from "lucide-react";

interface ProductosListVentasProps {
  productos: Productos[];
  agregarProducto: (producto: Productos, cantidad: number) => void;
}

export default function ProductosListCompra({
  productos,
  agregarProducto,
}: ProductosListVentasProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const cantidadRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const filteredProductos = productos.filter((producto) =>
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-background-100 rounded-lg shadow-md h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold text-primary-300 mb-4">
        Productos disponibles
      </h2>

      {/* Campo de búsqueda */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border border-background-300 rounded-lg bg-background-200 text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
        <Search className="absolute left-3 top-3 text-text-200" size={20} />
      </div>

      {/* Lista de productos */}
      <div className="flex flex-wrap gap-4">
        {filteredProductos.length > 0 ? (
          filteredProductos.map((producto) => (
            <div
              key={producto.id}
              className="p-4 border border-background-300 rounded-lg bg-background-200 shadow-sm flex flex-col justify-between w-64"
            >
              <div>
                <p className="font-semibold text-primary-300">
                  {producto.nombre}
                </p>
                <p className="text-sm text-text-200">
                  Precio: ${producto.precio_venta}
                </p>
                <p className="text-sm text-text-200">
                  Descripcion: ${producto.descripcion}
                </p>
              </div>

              <div className="flex items-center mt-3 gap-2">
                <button
                  onClick={() => {
                    const input = cantidadRefs.current[producto.id];
                    if (input && Number(input.value) > 1) {
                      input.value = String(Number(input.value) - 1);
                    }
                  }}
                  className="p-2 bg-primary-200 rounded hover:bg-primary-300 transition"
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
                  className="p-2 bg-primary-200 rounded hover:bg-primary-300 transition"
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
                className="mt-3 w-full p-2 bg-primary-100 text-text-100 font-semibold rounded-lg hover:bg-primary-200 transition"
              >
                Agregar al carrito
              </button>
            </div>
          ))
        ) : (
          <p className="text-accent-100 col-span-2 text-center py-6">
            No se encontraron productos.
          </p>
        )}
      </div>
    </div>
  );
}
