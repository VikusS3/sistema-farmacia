interface CategoriaFormProps {
  values: {
    nombre: string;
    descripcion: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  editingCategoriaId?: number | null;
  closeModal?: () => void;
}
export default function CategoriaForm({
  values,
  handleChange,
  handleSubmit,
  loading,
  editingCategoriaId,
  closeModal,
}: CategoriaFormProps) {
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
        <label htmlFor="descripcion">Descripción:</label>
        <input
          type="text"
          id="descripcion"
          name="descripcion"
          value={values.descripcion}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa la descripción"
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
          {editingCategoriaId ? "Editar" : "Agregar"}
        </button>
      </div>
    </form>
  );
}
