"use client";
import { useProveedores } from "@/app/hooks/proveedores/useProveedores";
import { useHookForm } from "@/app/hooks/useHookForm";
import { useState } from "react";
import Modal from "@/app/components/Modal";
import ProveedorForm from "@/app/components/proveedores/ProveedoresForm";

export default function ProovedoresPage() {
  const {
    loading,
    error,
    proveedores,
    addProveedor,
    eliminarProveedor,
    fetchProveedor,
    actualizarProveedor,
  } = useProveedores();

  const [editingProveedorId, setEditingProveedorId] = useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const { handleChange, handleSubmit, reset, setValues, values } = useHookForm({
    initialValues: {
      nombre: "",
      email: "",
      direccion: "",
      telefono: "",
    },
    onSubmit: async (values) => {
      if (editingProveedorId) {
        await actualizarProveedor(editingProveedorId, values);
      } else {
        await addProveedor(values);
      }
      reset();
      setEditingProveedorId(null);
      setModalOpen(false);
    },
  });

  const handleEdit = async (id: number) => {
    const proveedor = await fetchProveedor(id);
    setValues(proveedor);
    setEditingProveedorId(id);
    setModalOpen(true);
  };

  const openModalForCreate = () => {
    reset();
    setEditingProveedorId(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    reset();
    setEditingProveedorId(null);
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
        Agregar Proveedor
      </button>

      <Modal
        title={editingProveedorId ? "Editar Proveedor" : "Agregar Proveedor"}
        isOpen={modalOpen}
        onClose={closeModal}
      >
        <ProveedorForm
          values={values}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          editingProveedorId={editingProveedorId}
          closeModal={closeModal}
        />
      </Modal>

      <ul>
        {proveedores.map((proveedor) => (
          <li
            key={proveedor.id}
            className="mt-4 border-2 rounded-lg border-white w-fit"
          >
            <p>{proveedor.nombre}</p>
            <p>{proveedor.email}</p>
            <p>{proveedor.direccion}</p>
            <p>{proveedor.telefono}</p>
            <div>
              <button
                onClick={() => handleEdit(proveedor.id)}
                className="bg-yellow-600 text-white py-1 px-2 rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarProveedor(proveedor.id)}
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
