"use client";
import { useCategoria } from "@/app/hooks/categorias/useCategoria";
import Modal from "@/app/components/Modal";
import CategoriaForm from "@/app/components/categorias/CategoriasForm";
import { useCrudForm } from "@/app/hooks/useCrudForm";

export default function CategoriasPage() {
  const {
    loading,
    error,
    categorias,
    actualizarCategoria,
    addCategoria,
    borrarCategoria,
    fetchCategoria,
  } = useCategoria();

  const form = useCrudForm({
    initialValues: {
      nombre: "",
      descripcion: "",
    },
    add: addCategoria,
    update: actualizarCategoria,
    fetchById: fetchCategoria,
  });
  return (
    <div>
      <h1>Categorias</h1>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      <button
        onClick={form.openModalForCreate}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Agregar Categoria
      </button>

      <Modal
        title={form.editingId ? "Editar Categoria" : "Agregar"}
        isOpen={form.modalOpen}
        onClose={form.closeModal}
      >
        <CategoriaForm
          values={form.values}
          handleChange={form.handleChange}
          handleSubmit={form.handleSubmit}
          loading={loading}
          editingCategoriaId={form.editingId}
          closeModal={form.closeModal}
        />
      </Modal>
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria.id}>
            {categoria.nombre} -{categoria.descripcion}
            <button onClick={() => form.handleEdit(categoria.id)}>
              Editar
            </button>
            <button onClick={() => borrarCategoria(categoria.id)}>
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
