/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompraProducto } from "@/app/types";

interface CompraSeleccionadaProps {
  compraSeleccionada: CompraProducto;
  setCompraSeleccioanda: (compra: CompraProducto | null) => void;
}
export default function CompraSeleccionada({
  compraSeleccionada,
  setCompraSeleccioanda,
}: CompraSeleccionadaProps) {
  return (
    <div className="p-6 bg-background-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-primary-300 mb-4">
        Detalles de Compra
      </h2>

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="w-full border border-background-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-primary-100 text-text-100">
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-center">Cantidad</th>
              <th className="p-3 text-center">Precio Unitario</th>
              <th className="p-3 text-center">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {compraSeleccionada.compra.detalles.map(
              (producto: any, index: number) => (
                <tr
                  key={producto.producto_id}
                  className={
                    index % 2 === 0 ? "bg-background-200" : "bg-background-300"
                  }
                >
                  <td className="p-3 border border-background-300 text-text-100">
                    {producto.producto_nombre}
                  </td>
                  <td className="p-3 text-center border border-background-300 text-text-100">
                    {producto.cantidad} {producto.unidad_compra}(s)
                  </td>
                  <td className="p-3 text-center border border-background-300 text-text-100">
                    ${producto.precio_unitario}
                  </td>
                  <td className="p-3 text-center border border-background-300 text-text-100">
                    ${producto.subtotal}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Botón de cerrar */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setCompraSeleccioanda(null)}
          className="px-4 py-2 bg-accent-100 text-text-100 font-semibold rounded-lg hover:bg-accent-200 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
