"use client";
import { useProveedores } from "@/app/hooks/proveedores/useProveedores";
import Modal from "@/app/components/Modal";
import ProveedorForm from "@/app/components/proveedores/ProveedoresForm";
import { useCrudForm } from "@/app/hooks/useCrudForm";

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

  const form = useCrudForm({
    initialValues: {
      nombre: "",
      email: "",
      direccion: "",
      telefono: "",
    },
    add: addProveedor,
    update: actualizarProveedor,
    fetchById: fetchProveedor,
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
        Agregar Proveedor
      </button>

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
                onClick={() => form.handleEdit(proveedor.id)}
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
