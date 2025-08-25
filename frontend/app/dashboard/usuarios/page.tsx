/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useUsuarios } from "@/app/hooks/usuarios/useUsuarios";
import Modal from "@/app/components/Modal";
import UsuarioForm from "@/app/components/usuario/UsuarioForm";
import { useCrudForm } from "@/app/hooks/useCrudForm";
import UsuarioList from "@/app/components/usuario/UsuarioList";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { createBackup } from "@/app/services/backUpService";
import Swal from "sweetalert2";
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
      nombre: "",
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
      <h1 className="text-2xl font-bold mb-4 text-text-100">Usuarios</h1>
      {/* Mensajes de carga y error */}
      {loading && <p className="text-primary-300">Cargando...</p>}
      {error && <p className="text-accent-100">{error}</p>}

      <div className="mb-4 flex flex-row gap-2">
        <button
          onClick={form.openModalForCreate}
          className="bg-primary-50 text-white py-2 px-4 rounded-md hover:bg-primary-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          + Agregar Usuarios
        </button>
        <button
          onClick={() =>
            Swal.fire({
              title: "¿Confirmar creación de backup?",
              text: "Esta acción generará un backup de la base de datos.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Sí, crear backup",
            }).then((result) => {
              if (result.isConfirmed) {
                createBackup();
              }
            })
          }
          className="bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-yellow-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          Crear Backup Base de Datos
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
