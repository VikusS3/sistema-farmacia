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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div className="flex flex-col">
        <label htmlFor="nombre" className="text-text-100 font-medium">
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

      {/* Descripción */}
      <div className="flex flex-col">
        <label htmlFor="descripcion" className="text-text-100 font-medium">
          Descripción:
        </label>
        <input
          type="text"
          id="descripcion"
          name="descripcion"
          value={values.descripcion}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-100 text-text-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa la descripción"
          required
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 mt-2">
        <button
          type="button"
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={closeModal}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`py-2 px-4 rounded-md text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500"
          }`}
          disabled={loading}
        >
          {loading ? "Guardando..." : editingCategoriaId ? "Editar" : "Agregar"}
        </button>
      </div>
    </form>
  );
}
