interface UsuarioFormProps {
  values: {
    nombres: string;
    email: string;
    password: string;
    rol: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  editingUserId: number | null;
  closeModal: () => void;
}

export default function UsuarioForm({
  values,
  handleChange,
  handleSubmit,
  loading,
  editingUserId,
  closeModal,
}: UsuarioFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombres" className="block text-white mb-2">
          Nombre:
        </label>
        <input
          type="text"
          id="nombres"
          name="nombres"
          value={values.nombres}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa el nombre"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-white mb-2">
          Correo Electrónico:
        </label>
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
      </div>

      <div>
        <label htmlFor="password" className="block text-white mb-2">
          Contraseña:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa la contraseña"
          required
        />
      </div>

      <div>
        <label htmlFor="rol" className="block text-white mb-2">
          Rol:
        </label>
        <select
          id="rol"
          name="rol"
          value={values.rol}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Selecciona un rol</option>
          <option value="admin">Administrador</option>
          <option value="empleado">Empleado</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={closeModal}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading
            ? "Guardando..."
            : editingUserId
            ? "Actualizar Usuario"
            : "Agregar Usuario"}
        </button>
      </div>
    </form>
  );
}
