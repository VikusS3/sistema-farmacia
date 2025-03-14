import { Clientes } from "@/app/types";

interface SelectClienteProps {
  clientes: Clientes[];
  clienteId: number;
  handleClienteChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectCliente({
  clientes,
  clienteId,
  handleClienteChange,
}: SelectClienteProps) {
  return (
    <div>
      {/* Selector de cliente */}
      <label className="block font-semibold text-text-200 mb-2">
        Selecciona un cliente:
      </label>
      <select
        value={clienteId}
        onChange={handleClienteChange}
        className="p-3 border border-primary-200 bg-background-300 text-text-100 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-primary-300 transition-all"
      >
        <option value={0} className="text-black">
          Selecciona un cliente
        </option>
        {clientes.map((cliente) => (
          <option key={cliente.id} value={cliente.id} className="text-white">
            {cliente.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
