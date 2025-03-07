"use client";
import { useClientes } from "@/app/hooks/clientes/useClientes";
import Modal from "@/app/components/Modal";
import ClienteForm from "@/app/components/clientes/ClientesForm";
import { useCrudForm } from "@/app/hooks/useCrudForm";

export default function ClientesPage() {
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
    <div>
      <h1>Proovedores</h1>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      <button
        onClick={form.openModalForCreate}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Agregar Cliente
      </button>

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

      <ul>
        {clientes.map((cliente) => (
          <li
            key={cliente.id}
            className="mt-4 border-2 rounded-lg border-white w-fit"
          >
            <p>{cliente.nombre}</p>
            <p>{cliente.email}</p>
            <p>{cliente.direccion}</p>
            <p>{cliente.telefono}</p>
            <div>
              <button
                onClick={() => form.handleEdit(cliente.id)}
                className="bg-yellow-600 text-white py-1 px-2 rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => borrarCliente(cliente.id)}
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
