interface ProveedoresFormProps {
  values: {
    nombre: string;
    ruc: string;
    direccion: string;
    telefono: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  editingProveedorId?: number | null;
  closeModal?: () => void;
}

export default function ProveedoresForm({
  values,
  handleChange,
  handleSubmit,
  loading,
  editingProveedorId,
  closeModal,
}: ProveedoresFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div className="flex flex-col">
        <label htmlFor="nombre" className="text-white font-medium">
          Nombre:
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa el nombre"
          required
        />
      </div>

      {/* Correo Electrónico */}
      <div className="flex flex-col">
        <label htmlFor="ruc" className="text-white font-medium">
          RUC:
        </label>
        <input
          type="text"
          id="ruc"
          name="ruc"
          value={values.ruc}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa el RUC"
          required
        />
      </div>

      {/* Dirección */}
      <div className="flex flex-col">
        <label htmlFor="direccion" className="text-white font-medium">
          Dirección:
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={values.direccion}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa la dirección"
          required
        />
      </div>

      {/* Teléfono */}
      <div className="flex flex-col">
        <label htmlFor="telefono" className="text-white font-medium">
          Teléfono:
        </label>
        <input
          type="text"
          id="telefono"
          name="telefono"
          maxLength={9}
          value={values.telefono}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa el teléfono"
          required
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-3">
        {closeModal && (
          <button
            type="button"
            onClick={closeModal}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 rounded-md text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500"
          }`}
        >
          {loading
            ? "Guardando..."
            : editingProveedorId
            ? "Actualizar"
            : "Agregar"}
        </button>
      </div>
    </form>
  );
}
