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
      <div>
        <label htmlFor="nombre" className="block text-white mb-2">
          Nombre:
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa el nombre"
          required
        />
        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa el correo electrónico"
          required
        />
        <label htmlFor="direccion">Dirección:</label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={values.direccion}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa la dirección"
          required
        />
        <label htmlFor="telefono">Teléfono:</label>
        <input
          type="text"
          id="telefono"
          name="telefono"
          maxLength={9}
          value={values.telefono}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa el teléfono"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={closeModal}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        >
          {editingClienteId ? "Editar" : "Agregar"}
        </button>
      </div>
    </form>
  );
}
