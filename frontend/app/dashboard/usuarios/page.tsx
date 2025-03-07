/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useUsuarios } from "@/app/hooks/usuarios/useUsuarios";
import Modal from "@/app/components/Modal";
import UsuarioForm from "@/app/components/usuario/UsuarioForm";
import { useCrudForm } from "@/app/hooks/useCrudForm";

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

  const form = useCrudForm({
    initialValues: {
      nombres: "",
      email: "",
      password: "",
    },
    add: addUsuario,
    update: updateUsuario,
    fetchById: fetchUser,
  });

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      <button
        onClick={form.openModalForCreate}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Agregar Usuario
      </button>

      <Modal
        title={form.editingId ? "Editar Usuario" : "Agregar Usuario"}
        isOpen={form.modalOpen}
        onClose={form.closeModal}
      >
        <UsuarioForm
          values={form.values}
          handleChange={form.handleChange as any}
          handleSubmit={form.handleSubmit}
          loading={loading}
          editingUserId={form.editingId}
          closeModal={form.closeModal}
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
                onClick={() => form.handleEdit(usuario.id)}
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
