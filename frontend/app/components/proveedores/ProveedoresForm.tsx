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
        <label htmlFor="nombre" className="text-text-100 font-medium mb-1">
          Nombre:
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
          placeholder="Ingresa el nombre"
          required
        />
      </div>

      {/* RUC */}
      <div className="flex flex-col">
        <label htmlFor="ruc" className="text-text-100 font-medium mb-1">
          RUC:
        </label>
        <input
          type="text"
          id="ruc"
          name="ruc"
          maxLength={11}
          pattern="[0-9]{11}"
          value={values.ruc}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
          placeholder="Ingresa el RUC (11 dígitos)"
          required
        />
      </div>

      {/* Dirección */}
      <div className="flex flex-col">
        <label htmlFor="direccion" className="text-text-100 font-medium mb-1">
          Dirección:
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={values.direccion}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
          placeholder="Ingresa la dirección"
          required
        />
      </div>

      {/* Teléfono */}
      <div className="flex flex-col">
        <label htmlFor="telefono" className="text-text-100 font-medium mb-1">
          Teléfono:
        </label>
        <input
          type="text"
          id="telefono"
          name="telefono"
          maxLength={9}
          pattern="[0-9]{9}"
          value={values.telefono}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
          placeholder="Ingresa el teléfono (9 dígitos)"
          required
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-6">
        {closeModal && (
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 rounded-md text-white transition ${
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
