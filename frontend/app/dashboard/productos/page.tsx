"use client";
import { useProductos } from "@/app/hooks/productos/useProductos";
import { useHookForm } from "@/app/hooks/useHookForm";
import { useState } from "react";
import Modal from "@/app/components/Modal";
import ProductosForm from "@/app/components/productos/ProductosForm";
import { useCategoria } from "@/app/hooks/categorias/useCategoria";
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
    <div>
      <h1>Productos</h1>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <button
        onClick={openModalForCreate}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Agregar Producto
      </button>

      <Modal
        title={editingProductoId ? "Editar Producto" : "Agregar Producto"}
        isOpen={modalOpen}
        onClose={closeModal}
      >
        <ProductosForm
          values={values}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          editingProductoId={editingProductoId}
          closeModal={closeModal}
          categorias={categorias}
        />
      </Modal>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id} className="flex justify-between">
            <p>{producto.nombre}</p>
            <p>{producto.descripcion}</p>
            <p>{producto.precio_compra}</p>
            <p>{producto.precio_venta}</p>
            <p>{producto.stock}</p>
            <p>{producto.stock_minimo}</p>
            <p>{producto.unidad_medida}</p>
            <p>{new Date(producto.fecha_vencimiento).toLocaleDateString()}</p>
            <p>{producto.conversion}</p>
            <button onClick={() => eliminarProducto(producto.id)}>
              Eliminar
            </button>
            <button onClick={() => handleEdit(producto.id)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
