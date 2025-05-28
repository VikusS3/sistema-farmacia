interface DetalleCompraProps {
  detalleCompra: Array<{
    producto_id: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }>;
  total: number;
  eliminarProducto: (producto_id: number) => void;
  registrarCompra: () => void;
}

export default function DetalleCompra({
  detalleCompra,
  total,
  eliminarProducto,
  registrarCompra,
}: DetalleCompraProps) {
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
          {detalleCompra.map((item) => (
            <tr
              key={item.producto_id}
              className="hover:bg-background-200 transition"
            >
              <td className="border border-primary-200 px-4 py-3">
                {item.nombre}
              </td>
              <td className="border border-primary-200 px-4 py-3">
                {item.cantidad}
              </td>
              <td className="border border-primary-200 px-4 py-3">
                ${item.precio_unitario}
              </td>
              <td className="border border-primary-200 px-4 py-3">
                ${item.subtotal.toFixed(2)}
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
      <h3 className="text-xl font-bold text-primary-300 mb-3">
        Total: ${total.toFixed(2)}
      </h3>
      <button
        onClick={registrarCompra}
        className="px-4 py-2 bg-primary-100 text-white font-semibold rounded-md hover:bg-primary-200 transition-all hover:scale-105"
      >
        Confirmar Compra
      </button>
    </div>
  );
}
