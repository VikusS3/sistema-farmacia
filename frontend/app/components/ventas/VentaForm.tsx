interface VentaFormProps {
  metodoPago: string;
  setMetodoPago: (metodoPago: string) => void;
  descuento: number;
  setDescuento: (descuento: number) => void;
  adicional: number;
  setAdicional: (adicional: number) => void;
}

export default function VentaForm({
  metodoPago,
  setMetodoPago,
  descuento,
  setDescuento,
  adicional,
  setAdicional,
}: VentaFormProps) {
  return (
    <div className="mb-5">
      {/* Método de pago */}
      <label className="block font-semibold mb-2">Método de pago:</label>
      <select
        value={metodoPago}
        onChange={(e) => setMetodoPago(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-5 w-full text-black"
      >
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta">Tarjeta</option>
        <option value="transferencia">Transferencia</option>
      </select>

      {/* Descuento y Adicional en la misma fila */}
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block font-semibold mb-2">Descuento:</label>
          <input
            type="number"
            value={descuento}
            onChange={(e) => setDescuento(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded w-full text-black"
          />
        </div>

        <div className="w-1/2">
          <label className="block font-semibold mb-2">Adicional:</label>
          <input
            type="number"
            value={adicional}
            onChange={(e) => setAdicional(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded w-full text-black"
          />
        </div>
      </div>
    </div>
  );
}
