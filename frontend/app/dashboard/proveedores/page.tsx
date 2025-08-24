"use client";
import { useProveedores } from "@/app/hooks/proveedores/useProveedores";
import Modal from "@/app/components/Modal";
import ProveedorForm from "@/app/components/proveedores/ProveedoresForm";
import { useCrudForm } from "@/app/hooks/useCrudForm";
import ProovedoresList from "@/app/components/proveedores/ProveedoresList";
import ProtectedRoute from "@/app/components/ProtectedRoute";

function ProovedoresPage() {
  const {
    loading,
    error,
    proveedores,
    addProveedor,
    eliminarProveedor,
    fetchProveedor,
    actualizarProveedor,
  } = useProveedores();

  const form = useCrudForm({
    initialValues: {
      nombre: "",
      ruc: "",
      direccion: "",
      telefono: "",
    },
    add: addProveedor,
    update: actualizarProveedor,
    fetchById: fetchProveedor,
  });

  return (
    <div className="p-6 bg-background-100 text-text-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-primary-200">Proveedores</h1>
      {loading && <p className="text-primary-300">Cargando...</p>}
      {error && <p className="text-accent-100">{error}</p>}
      <div className="mb-4">
        <button
          onClick={form.openModalForCreate}
          className="bg-primary-50 text-white py-2 px-4 rounded-md shadow hover:bg-primary-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          + Agregar Proveedor
        </button>
      </div>

      <Modal
        title={form.editingId ? "Editar Proveedor" : "Agregar Proveedor"}
        isOpen={form.modalOpen}
        onClose={form.closeModal}
      >
        <ProveedorForm
          values={form.values}
          handleChange={form.handleChange}
          handleSubmit={form.handleSubmit}
          loading={loading}
          editingProveedorId={form.editingId}
          closeModal={form.closeModal}
        />
      </Modal>

      <ProovedoresList
        proveedores={proveedores}
        handleEdit={form.handleEdit}
        borrarProovedor={eliminarProveedor}
      />
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <ProovedoresPage />
    </ProtectedRoute>
  );
}
