/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useProductos } from "@/app/hooks/productos/useProductos";
import { useHookForm } from "@/app/hooks/useHookForm";
import { useState } from "react";
import Modal from "@/app/components/Modal";
import ProductosForm from "@/app/components/productos/ProductosForm";
import { useCategoria } from "@/app/hooks/categorias/useCategoria";
import ProductosList from "@/app/components/productos/ProductosList";
export default function ProductosPage() {
  const {
    loading,
    eliminarProducto,
    error,
    productos,
    actualizarProducto,
    addProducto,
    fetchProducto,
  } = useProductos();

  const [editingProductoId, setEditingProductoId] = useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const { categorias } = useCategoria();

  const { handleChange, handleSubmit, reset, setValues, values } = useHookForm({
    initialValues: {
      nombre: "",
      descripcion: "",
      precio_compra: 0,
      precio_venta: 0,
      stock: 0,
      stock_minimo: 0,
      unidad_medida: "",
      fecha_vencimiento: "",
      conversion: 0,
      categoria_id: 0,
    },
    onSubmit: async (values) => {
      const transformedValues = {
        ...values,
        precio_compra: Number(values.precio_compra),
        precio_venta: Number(values.precio_venta),
        stock: Number(values.stock),
        stock_minimo: Number(values.stock_minimo),
        conversion: Number(values.conversion),
        categoria_id: Number(values.categoria_id),
      };

      if (editingProductoId) {
        await actualizarProducto(editingProductoId, transformedValues);
      } else {
        await addProducto(transformedValues);
      }
      reset();
      setEditingProductoId(null);
      setModalOpen(false);
    },
  });
  const handleEdit = async (id: number) => {
    const producto = await fetchProducto(id);
    setValues(producto);
    setEditingProductoId(id);
    setModalOpen(true);
  };

  const openModalForCreate = () => {
    reset();
    setEditingProductoId(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    reset();
    setEditingProductoId(null);
    setModalOpen(false);
  };
  return (
    <div className="p-6 bg-background-100 text-text-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-primary-200">Productos</h1>
      {loading && <p className="text-primary-300">Cargando...</p>}
      {error && <p className="text-accent-100">{error}</p>}
      <div className="mb-4">
        <button
          onClick={openModalForCreate}
          className="bg-primary-100 text-text-100 py-2 px-4 rounded-md hover:bg-primary-200 transition-all focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          + Agregar Productos
        </button>
      </div>

      <Modal
        title={editingProductoId ? "Editar Producto" : "Agregar Producto"}
        isOpen={modalOpen}
        onClose={closeModal}
        className="max-w-2xl w-full"
      >
        <ProductosForm
          values={values}
          handleChange={handleChange as any}
          handleSubmit={handleSubmit}
          loading={loading}
          editingProductoId={editingProductoId}
          closeModal={closeModal}
          categorias={categorias}
        />
      </Modal>
      <ProductosList
        productos={productos}
        handleEdit={handleEdit}
        borrarProductos={eliminarProducto}
      />
    </div>
  );
}
