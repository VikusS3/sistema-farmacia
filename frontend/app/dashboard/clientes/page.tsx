"use client";
import { useClientes } from "@/app/hooks/clientes/useClientes";
import { useHookForm } from "@/app/hooks/useHookForm";
import { useState } from "react";
import Modal from "@/app/components/Modal";
import ClienteForm from "@/app/components/clientes/ClientesForm";

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

  const [editingClienteId, setEditingClienteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { handleChange, handleSubmit, reset, setValues, values } = useHookForm({
    initialValues: {
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
    },
    onSubmit: async (values) => {
      if (editingClienteId) {
        await actualizarCliente(editingClienteId, values);
      } else {
        await addCliente(values);
      }
      reset();
      setEditingClienteId(null);
      setModalOpen(false);
    },
  });

  const handleEdit = async (id: number) => {
    const cliente = await fetchCliente(id);
    setValues(cliente);
    setEditingClienteId(id);
    setModalOpen(true);
  };

  const openModalForCreate = () => {
    reset();
    setEditingClienteId(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    reset();
    setEditingClienteId(null);
    setModalOpen(false);
  };

  return (
    <div>
      <h1>Proovedores</h1>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      <button
        onClick={openModalForCreate}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Agregar Cliente
      </button>

      <Modal
        title={editingClienteId ? "Editar Cliente" : "Agregar Cliente"}
        isOpen={modalOpen}
        onClose={closeModal}
      >
        <ClienteForm
          values={values}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          editingClienteId={editingClienteId}
          closeModal={closeModal}
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
                onClick={() => handleEdit(cliente.id)}
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
