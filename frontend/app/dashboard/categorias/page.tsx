"use client";
import { useCategoria } from "@/app/hooks/categorias/useCategoria";
import { useHookForm } from "@/app/hooks/useHookForm";
import Modal from "@/app/components/Modal";
import CategoriaForm from "@/app/components/categorias/CategoriasForm";
import { useState } from "react";

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

  const [editingCategoriaId, setEditingCategoriaId] = useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const { handleChange, handleSubmit, reset, setValues, values } = useHookForm({
    initialValues: {
      nombre: "",
      descripcion: "",
    },
    onSubmit: async (values) => {
      if (editingCategoriaId) {
        await actualizarCategoria(editingCategoriaId, values);
      } else {
        await addCategoria(values);
      }
      reset();
      setEditingCategoriaId(null);
      setModalOpen(false);
    },
  });

  const handleEdit = async (id: number) => {
    const categoria = await fetchCategoria(id);
    setValues(categoria);
    setEditingCategoriaId(id);
    setModalOpen(true);
  };

  const openModalForCreate = () => {
    reset();
    setEditingCategoriaId(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    reset();
    setEditingCategoriaId(null);
    setModalOpen(false);
  };
  return (
    <div>
      <h1>Categorias</h1>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      <button
        onClick={openModalForCreate}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Agregar Categoria
      </button>

      <Modal
        title={editingCategoriaId ? "Editar Categoria" : "Agregar"}
        isOpen={modalOpen}
        onClose={closeModal}
      >
        <CategoriaForm
          values={values}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          editingCategoriaId={editingCategoriaId}
          closeModal={closeModal}
        />
      </Modal>
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria.id}>
            {categoria.nombre} -{categoria.descripcion}
            <button onClick={() => handleEdit(categoria.id)}>Editar</button>
            <button onClick={() => borrarCategoria(categoria.id)}>
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
