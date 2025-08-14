interface DetalleVentaProps {
  detalleVenta: Array<{
    unidad_seleccionada?: string;
    producto_id: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    unidad_venta: string;
    unidad_medida: string;
    factor_conversion: number;
  }>;
  total: number;
  eliminarProducto: (producto_id: number) => void;
  registrarVenta: () => void;
  descuento: number;
  setDescuento: (value: number) => void;
  adicional: number;
  setAdicional: (value: number) => void;
  metodoPago: string;
  setMetodoPago: (value: string) => void;
  montoPago: number;
  setMontoPago: (value: number) => void;
}

export default function DetalleVenta({
  detalleVenta,
  total,
  eliminarProducto,
  registrarVenta,
  descuento,
  setDescuento,
  adicional,
  setAdicional,
  metodoPago,
  setMetodoPago,
  montoPago,
  setMontoPago,
}: DetalleVentaProps) {
  const totalFinal = total + adicional - descuento;

  return (
    <div className="bg-background-300 p-5 rounded-lg shadow-md">
      <table className="w-full mb-5 border-collapse text-text-100">
        <thead>
          <tr className="bg-primary-100">
            <th className="border border-primary-200 px-4 py-3">Producto</th>
            <th className="border border-primary-200 px-4 py-3">Cantidad</th>
            <th className="border border-primary-200 px-4 py-3">
              Precio Unitario
            </th>
            <th className="border border-primary-200 px-4 py-3">Subtotal</th>
            <th className="border border-primary-200 px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalleVenta.map((item) => (
            <tr
              key={item.producto_id}
              className="hover:bg-background-200 transition"
            >
              <td className="border border-primary-200 px-4 py-3">
                {item.nombre}
              </td>
              <td className="border border-primary-200 px-4 py-3">
                {item.cantidad} {item.unidad_seleccionada}
              </td>
              <td className="border border-primary-200 px-4 py-3">
                S/{item.precio_unitario}
              </td>
              <td className="border border-primary-200 px-4 py-3">
                S/{item.subtotal.toFixed(2)}
              </td>
              <td className="border border-primary-200 px-4 py-3 text-center">
                <button
                  onClick={() => eliminarProducto(item.producto_id)}
                  className="px-3 py-2 bg-accent-100 text-white rounded-md hover:bg-red-600 transition-all hover:scale-105"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Campos adicionales */}
      <div className="mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-text-200">
            Descuento
          </label>
          <input
            type="number"
            value={descuento}
            onChange={(e) => setDescuento(Number(e.target.value))}
            className="w-full p-2 border rounded-md bg-background-200 text-text-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-200">
            Adicional
          </label>
          <input
            type="number"
            value={adicional}
            onChange={(e) => setAdicional(Number(e.target.value))}
            className="w-full p-2 border rounded-md bg-background-200 text-text-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-200">
            Método de Pago
          </label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full p-2 border rounded-md bg-background-200 text-text-100"
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="yape/plin">Yape/Plin</option>
          </select>
        </div>
      </div>

      {/* Total Final */}
      <h3 className="text-xl font-bold text-primary-300 mb-3">
        Total: S/{totalFinal.toFixed(2)}
      </h3>

      {/* Monto de pago y vuelto */}
      <div className="mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-text-200">
            Monto Recibido
          </label>
          <input
            type="number"
            value={montoPago || ""}
            onChange={(e) => setMontoPago(Number(e.target.value) || 0)}
            className="w-full p-2 border rounded-md bg-background-200 text-text-100"
            step="0.01"
            min="0"
          />
        </div>
        {montoPago > 0 && (
          <div className="p-3 bg-background-200 rounded-md">
            <p className="text-text-100">
              <span className="font-medium">Vuelto:</span> S/
              {(montoPago - totalFinal).toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Botón */}
      <button
        onClick={registrarVenta}
        className="px-4 py-2 bg-primary-100 text-white font-semibold rounded-md hover:bg-primary-200 transition-all hover:scale-105"
      >
        Confirmar Venta
      </button>
    </div>
  );
}
