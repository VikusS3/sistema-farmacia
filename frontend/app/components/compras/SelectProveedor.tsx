import { Proveedores } from "@/app/types";

interface SelectProveedorProps {
  proveedores: Proveedores[];
  proveedorId: number;
  handleProveedorChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectProveedor({
  proveedores,
  proveedorId,
  handleProveedorChange,
}: SelectProveedorProps) {
  return (
    <div>
      {/* Selector de cliente */}
      <label className="block font-semibold text-text-200 mb-2">
        Selecciona un proveedor:
      </label>
      <select
        value={proveedorId}
        onChange={handleProveedorChange}
        className="p-3 border border-primary-200 bg-background-300 text-text-100 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-primary-300 transition-all"
      >
        <option value={0}>Selecciona un proveedor</option>
        {proveedores.map((proveedor) => (
          <option
            key={proveedor.id}
            value={proveedor.id}
            className="text-white"
          >
            {proveedor.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
