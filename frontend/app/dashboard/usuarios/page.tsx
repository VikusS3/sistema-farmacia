/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useUsuarios } from "@/app/hooks/usuarios/useUsuarios";
import Modal from "@/app/components/Modal";
import UsuarioForm from "@/app/components/usuario/UsuarioForm";
import { useCrudForm } from "@/app/hooks/useCrudForm";
import UsuarioList from "@/app/components/usuario/UsuarioList";
import ProtectedRoute from "@/app/components/ProtectedRoute";

function UsuariosPage() {
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
      rol: "",
    },
    add: addUsuario,
    update: updateUsuario,
    fetchById: fetchUser,
  });

  return (
    <div className="p-6 bg-background-100 text-text-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-primary-200">Usuarios</h1>
      {/* Mensajes de carga y error */}
      {loading && <p className="text-primary-300">Cargando...</p>}
      {error && <p className="text-accent-100">{error}</p>}

      <div className="mb-4">
        <button
          onClick={form.openModalForCreate}
          className="bg-primary-100 text-text-100 py-2 px-4 rounded-md hover:bg-primary-200 transition-all focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          + Agregar Usuarios
        </button>
      </div>

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

      <UsuarioList
        usuarios={usuarios}
        handleEdit={form.handleEdit}
        borrarUsuario={deleteUsuario}
      />
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <UsuariosPage />
    </ProtectedRoute>
  );
}
