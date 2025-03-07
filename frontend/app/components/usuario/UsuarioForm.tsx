import { ROLES } from "@/app/constants/roles";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div className="flex flex-col">
        <label htmlFor="nombres" className="text-text-100 font-medium">
          Nombre:
        </label>
        <input
          type="text"
          id="nombres"
          name="nombres"
          value={values.nombres}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa el nombre"
          required
        />
      </div>

      {/* Correo Electrónico */}
      <div className="flex flex-col">
        <label htmlFor="email" className="text-text-100 font-medium">
          Correo Electrónico:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa el correo electrónico"
          required
        />
      </div>

      {/* Contraseña */}
      <div className="flex flex-col">
        <label htmlFor="password" className="text-text-100 font-medium">
          Contraseña:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa la contraseña"
          required
        />
      </div>

      {/* Rol */}
      <div className="flex flex-col">
        <label htmlFor="rol" className="text-text-100 font-medium">
          Rol:
        </label>
        <select
          id="rol"
          name="rol"
          value={values.rol}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          required
        >
          <option value="">Selecciona un rol</option>
          {ROLES.map((rol) => (
            <option key={rol.value} value={rol.value}>
              {rol.alias}
            </option>
          ))}
        </select>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 mt-3">
        <button
          type="button"
          onClick={closeModal}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 rounded-md text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          }`}
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
