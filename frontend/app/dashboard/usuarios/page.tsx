/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useUsuarios } from "@/app/hooks/usuarios/useUsuarios";
import { useState } from "react";
import Modal from "@/app/components/Modal";
import UsuarioForm from "@/app/components/usuario/UsuarioForm";
import { useHookForm } from "@/app/hooks/useHookForm";

export default function UsuariosPage() {
  const {
    error,
    loading,
    usuarios,
    addUsuario,
    deleteUsuario,
    fetchUser,
    updateUsuario,
  } = useUsuarios();

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { values, setValues, handleChange, handleSubmit, reset } = useHookForm({
    initialValues: {
      nombres: "",
      email: "",
      password: "",
      rol: "",
    },
    onSubmit: async (values) => {
      if (editingUserId) {
        await updateUsuario(editingUserId, values);
      } else {
        await addUsuario(values);
      }
      reset();
      setEditingUserId(null);
      setModalOpen(false); // ⬅️ Cierra el modal después de agregar o editar
    },
  });

  const handleEdit = async (id: number) => {
    const user = await fetchUser(id);
    setValues(user);
    setEditingUserId(id);
    setModalOpen(true);
  };

  const openModalForCreate = () => {
    reset();
    setEditingUserId(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    reset();
    setEditingUserId(null);
    setModalOpen(false);
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      <button
        onClick={openModalForCreate}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Agregar Usuario
      </button>

      <Modal
        title={editingUserId ? "Editar Usuario" : "Agregar Usuario"}
        isOpen={modalOpen}
        onClose={closeModal}
      >
        <UsuarioForm
          values={values}
          handleChange={handleChange as any}
          handleSubmit={handleSubmit}
          loading={loading}
          editingUserId={editingUserId}
          closeModal={closeModal}
        />
      </Modal>

      <ul className="mt-4">
        {usuarios.map((usuario) => (
          <li key={usuario.id} className="flex justify-between items-center">
            <span>
              {usuario.nombres} ({usuario.email})
            </span>
            <div>
              <button
                onClick={() => handleEdit(usuario.id)}
                className="bg-yellow-600 text-white py-1 px-2 rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => deleteUsuario(usuario.id)}
                className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
