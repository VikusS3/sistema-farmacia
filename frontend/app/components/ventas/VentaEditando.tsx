import { Clientes, VentaProducto } from "@/app/types";

interface VentaEditandoProps {
  setModalEdicionOpen: (open: boolean) => void;
  ventaEditando: VentaProducto;
  setVentaEditando: (venta: VentaProducto) => void;
  handleActualizarVenta: (venta: VentaProducto) => void;
  clientes: Clientes[];
}

export default function VentaEditando({
  setModalEdicionOpen,
  ventaEditando,
  setVentaEditando,
  clientes,
  handleActualizarVenta,
}: VentaEditandoProps) {
  return (
    <div className="bg-background-200 p-1 rounded-lg shadow-lg">
      {/* Cliente */}
      <label className="block font-semibold mb-2 text-text-100">Cliente:</label>
      <select
        value={ventaEditando.venta.cliente_id}
        onChange={(e) =>
          setVentaEditando({
            ...ventaEditando,
            venta: {
              ...ventaEditando.venta,
              cliente_id: Number(e.target.value),
            },
          })
        }
        className="w-full p-3 border border-background-300 rounded-md bg-background-300 text-text-100 focus:ring-2 focus:ring-primary-200 transition-all"
      >
        <option value={0}>Selecciona un cliente</option>
        {clientes.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nombre}
          </option>
        ))}
      </select>

      {/* Método de pago */}
      <label className="block font-semibold mt-4 mb-2 text-text-100">
        Método de pago:
      </label>
      <select
        value={ventaEditando.venta.metodo_pago}
        onChange={(e) =>
          setVentaEditando({
            ...ventaEditando,
            venta: {
              ...ventaEditando.venta,
              metodo_pago: e.target.value,
            },
          })
        }
        className="w-full p-3 border border-background-300 rounded-md bg-background-300 text-text-100 focus:ring-2 focus:ring-primary-200 transition-all"
      >
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta">Tarjeta</option>
        <option value="transferencia">Transferencia</option>
      </select>

      {/* Modificar Cantidad */}
      <h3 className="text-lg font-semibold mt-6 mb-3 text-text-100">
        Modificar Cantidad
      </h3>
      <div className="space-y-4">
        {ventaEditando.productos.map((producto, index) => (
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
                const nuevosProductos = [...ventaEditando.productos];
                nuevosProductos[index].cantidad = nuevaCantidad;
                setVentaEditando({
                  ...ventaEditando,
                  productos: nuevosProductos,
                });
              }}
              className="w-20 p-2 border border-background-400 rounded-md text-text-100 bg-background-200 text-center focus:ring-2 focus:ring-primary-200 transition-all"
            />
          </div>
        ))}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setModalEdicionOpen(false)}
          className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            handleActualizarVenta(ventaEditando);
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
