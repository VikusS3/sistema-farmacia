"use client";
import { useClientes } from "@/app/hooks/clientes/useClientes";
import Modal from "@/app/components/Modal";
import ClienteForm from "@/app/components/clientes/ClientesForm";
import { useCrudForm } from "@/app/hooks/useCrudForm";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ClientesList from "@/app/components/clientes/ClientesList";

function ClientesPage() {
  const {
    loading,
    error,
    clientes,
    addCliente,
    actualizarCliente,
    borrarCliente,
    fetchCliente,
  } = useClientes();

  const form = useCrudForm({
    initialValues: {
      nombre: "",
      email: "",
      direccion: "",
      telefono: "",
    },
    add: addCliente,
    update: actualizarCliente,
    fetchById: fetchCliente,
  });

  return (
    <div className="p-6 bg-background-100 text-text-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-primary-200">Clientes</h1>
      {loading && <p className="text-primary-300">Cargando...</p>}
      {error && <p className="text-accent-100">{error}</p>}
      <div className="mb-4">
        <button
          onClick={form.openModalForCreate}
          className="bg-primary-100 text-text-100 py-2 px-4 rounded-md hover:bg-primary-200 transition-all focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          + Agregar Cliente
        </button>
      </div>

      <Modal
        title={form.editingId ? "Editar Cliente" : "Agregar Cliente"}
        isOpen={form.modalOpen}
        onClose={form.closeModal}
      >
        <ClienteForm
          values={form.values}
          handleChange={form.handleChange}
          handleSubmit={form.handleSubmit}
          loading={loading}
          editingClienteId={form.editingId}
          closeModal={form.closeModal}
        />
      </Modal>

      <ClientesList
        clientes={clientes}
        handleEdit={form.handleEdit}
        borrarCliente={borrarCliente}
      />
    </div>
  );
}

export default function ClientesPageWrapper() {
  return (
    <ProtectedRoute>
      <ClientesPage />
    </ProtectedRoute>
  );
}
