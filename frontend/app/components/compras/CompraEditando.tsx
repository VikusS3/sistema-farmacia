import { Proveedores, CompraProducto } from "@/app/types";

interface CompraEditandoProps {
  setModalEdicionOpen: (open: boolean) => void;
  compraEditando: CompraProducto;
  setCompraEditando: (compra: CompraProducto) => void;
  handleActualizarCompra: (compra: CompraProducto) => void;
  proveedores: Proveedores[];
}

export default function CompraEditando({
  setModalEdicionOpen,
  compraEditando,
  setCompraEditando,
  proveedores,
  handleActualizarCompra,
}: CompraEditandoProps) {
  return (
    <div className="bg-background-200 p-1 rounded-lg shadow-lg">
      <label className="block font-semibold mb-2 text-text-100">
        Proveedor:
      </label>
      <select
        value={compraEditando.compra.proveedor_id}
        onChange={(e) =>
          setCompraEditando({
            ...compraEditando,
            compra: {
              ...compraEditando.compra,
              proveedor_id: Number(e.target.value),
            },
          })
        }
        className="w-full p-3 border border-background-300 rounded-md bg-background-300 text-text-100 focus:ring-2 focus:ring-primary-200 transition-all"
      >
        <option value={0}>Selecciona un proveedor</option>
        {proveedores.map((proveedor) => (
          <option key={proveedor.id} value={proveedor.id}>
            {proveedor.nombre}
          </option>
        ))}
      </select>

      <h3 className="text-lg font-semibold mt-6 mb-3 text-text-100">
        Modificar Cantidad
      </h3>
      <div className="space-y-4">
        {compraEditando.productos.map((producto, index) => (
          <div
            key={producto.producto_id}
            className="flex items-center justify-between bg-background-300 p-3 rounded-md"
          >
            <p className="text-text-100">{producto.producto_nombre}</p>
            <input
              type="number"
              min="1"
              value={producto.cantidad}
              onChange={(e) => {
                const nuevaCantidad = Number(e.target.value);
                const nuevosProductos = [...compraEditando.productos];
                nuevosProductos[index].cantidad = nuevaCantidad;
                setCompraEditando({
                  ...compraEditando,
                  productos: nuevosProductos,
                });
              }}
              className="w-20 p-2 border border-background-400 rounded-md text-text-100 bg-background-200 text-center focus:ring-2 focus:ring-primary-200 transition-all"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setModalEdicionOpen(false)}
          className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            handleActualizarCompra(compraEditando);
            setModalEdicionOpen(false);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:ring-2 focus:ring-green-400 transition-all"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
