interface ClienteFormProps {
  values: {
    nombre: string;
    email: string;
    direccion: string;
    telefono: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  editingClienteId?: number | null;
  closeModal?: () => void;
}

export default function ClienteForm({
  values,
  handleChange,
  handleSubmit,
  loading,
  editingClienteId,
  closeModal,
}: ClienteFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-primary-200 mb-2">
          Nombre:
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          placeholder="Ingresa el nombre"
          required
        />
      </div>

      {/* Correo Electrónico */}
      <div>
        <label htmlFor="email" className="block text-primary-200 mb-2">
          Correo Electrónico:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          placeholder="Ingresa el correo electrónico"
          required
        />
      </div>

      {/* Dirección */}
      <div>
        <label htmlFor="direccion" className="block text-primary-200 mb-2">
          Dirección:
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={values.direccion}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          placeholder="Ingresa la dirección"
          required
        />
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="telefono" className="block text-primary-200 mb-2">
          Teléfono:
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          maxLength={9}
          pattern="[0-9]{9}"
          value={values.telefono}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          placeholder="Ejemplo: 987654321"
          required
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
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
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          disabled={loading}
        >
          {editingClienteId ? "Editar Cliente" : "Agregar Cliente"}
        </button>
      </div>
    </form>
  );
}
