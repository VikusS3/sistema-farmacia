"use client";

import Modal from "@/app/components/Modal";
import { useCompraForm } from "@/app/hooks/compras/useCompraForm";
import { CompraProducto } from "@/app/types";
import { useState } from "react";

export default function ComprasPage() {
  const {
    agregarProducto,
    compras,
    detalleCompra,
    eliminarCompra,
    eliminarProducto,
    error,
    fetchComprasConProductos,
    handleProveedorChange,
    loading,
    modalOpen,
    productos,
    proveedorId,
    proveedores,
    registrarCompra,
    setModalOpen,
    handleActualizarCompra,
    total,
  } = useCompraForm();

  const [modalEdicionOpen, setModalEdicionOpen] = useState(false);
  const [compraEditando, setCompraEditando] = useState<CompraProducto | null>(
    null
  );

  const handleEditingCompra = async (compraId: number) => {
    const compra = await fetchComprasConProductos(compraId);
    setCompraEditando(compra);
    setModalEdicionOpen(true);
  };
  const [compraSeleccionada, setCompraSeleccionada] =
    useState<CompraProducto | null>(null);

  const handleVerProductosCompra = async (compraId: number) => {
    const compra = await fetchComprasConProductos(compraId);
    setCompraSeleccionada(compra);
  };

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-200 mb-5">
        Registrar Compra
      </h1>
      {loading && <p className="text-blue-500">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Selector de proveedor */}
      <label className="block font-semibold mb-2">
        Selecciona un proveedor:
      </label>
      <select
        value={proveedorId}
        onChange={handleProveedorChange}
        className="p-2 border border-gray-300 rounded mb-5 w-full text-black"
      >
        <option value={0}>Selecciona un proveedor</option>
        {proveedores.map((proveedor) => (
          <option key={proveedor.id} value={proveedor.id}>
            {proveedor.nombre}
          </option>
        ))}
      </select>

      {/* Lista de productos */}
      <h2 className="text-xl font-semibold mb-3">Productos disponibles</h2>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {productos.map((producto) => (
          <div key={producto.id} className="p-4 border rounded shadow-sm">
            <p className="font-semibold">{producto.nombre}</p>
            <p className="text-sm text-gray-500">
              Precio: ${producto.precio_compra}
            </p>
            <div className="flex items-center mt-2 text-black">
              <input
                type="number"
                min="1"
                placeholder="Cantidad"
                id={`cantidad-${producto.id}`}
                className="w-16 p-1 border border-gray-300 rounded"
              />
              <button
                onClick={() => {
                  const cantidad = Number(
                    (
                      document.getElementById(
                        `cantidad-${producto.id}`
                      ) as HTMLInputElement
                    ).value
                  );
                  agregarProducto(producto, cantidad);
                }}
                className="ml-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Agregar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botón para abrir modal */}
      <button
        onClick={() => setModalOpen(true)}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Ver Detalle y Registrar
      </button>

      {/* Modal con el detalle de la compra */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalle de la Compra"
      >
        {detalleCompra.length > 0 ? (
          <>
            <table className="w-full mb-5 border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Producto</th>
                  <th className="border p-2">Cantidad</th>
                  <th className="border p-2">Precio Unitario</th>
                  <th className="border p-2">Subtotal</th>
                  <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {detalleCompra.map((item) => (
                  <tr key={item.producto_id}>
                    <td className="border p-2">{item.nombre}</td>
                    <td className="border p-2">{item.cantidad}</td>
                    <td className="border p-2">${item.precio_unitario}</td>
                    <td className="border p-2">${item.subtotal}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => eliminarProducto(item.producto_id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-lg font-semibold mb-3">Total: ${total}</h3>
            <button
              onClick={registrarCompra}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Confirmar Compra
            </button>
          </>
        ) : (
          <p className="text-gray-500">No hay productos agregados.</p>
        )}
      </Modal>

      {/* Lista de compras */}
      <h2 className="text-xl font-semibold mt-6">Compras Registradas</h2>
      <ul className="mt-4 space-y-3">
        {compras.map((compra) => (
          <li
            key={compra.id}
            className="p-4 border rounded shadow-sm flex justify-between items-center"
          >
            <p>
              Compra #{compra.id} -{" "}
              <span className="font-semibold">${compra.total}</span>
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditingCompra(compra.id)}
                className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleVerProductosCompra(compra.id)}
                className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Ver productos
              </button>
              <button
                onClick={() => eliminarCompra(compra.id)}
                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal con el detalle de la compra */}
      {compraSeleccionada && (
        <Modal
          isOpen={Boolean(compraSeleccionada)}
          onClose={() => setCompraSeleccionada(null)}
          title={`${compraSeleccionada.compra.proveedor_nombre}`}
        >
          <table className="w-full mb-5 border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Producto</th>
                <th className="border p-2">Cantidad</th>
                <th className="border p-2">Precio Unitario</th>
                <th className="border p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {compraSeleccionada.productos.map((producto) => (
                <tr key={producto.producto_id}>
                  <td className="border p-2">{producto.producto_nombre}</td>
                  <td className="border p-2">{producto.cantidad}</td>
                  <td className="border p-2">${producto.precio_unitario}</td>
                  <td className="border p-2">${producto.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={() => setCompraSeleccionada(null)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Cerrar
          </button>
        </Modal>
      )}

      {compraEditando && (
        <Modal
          isOpen={modalEdicionOpen}
          onClose={() => setModalEdicionOpen(false)}
          title="Editar Compra"
        >
          <label className="block font-semibold mb-2">Proveedor:</label>
          <select
            value={compraEditando.compra.proveedor_id}
            onChange={(e) =>
              setCompraEditando({
                ...compraEditando,
                compra: {
                  ...compraEditando.compra,
                  proveedor_id: Number(e.target.value),
                },
              })
            }
            className="p-2 border border-gray-300 rounded mb-5 w-full text-black"
          >
            <option value={0}>Selecciona un proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>

          <h3 className="text-lg font-semibold mb-3">Modificar Cantidad</h3>
          {compraEditando.productos.map((producto, index) => (
            <div key={producto.producto_id} className="mb-3">
              <p>{producto.producto_nombre}</p>
              <input
                type="number"
                min="1"
                value={producto.cantidad}
                onChange={(e) => {
                  const nuevaCantidad = Number(e.target.value);
                  const nuevosProductos = [...compraEditando.productos];
                  nuevosProductos[index].cantidad = nuevaCantidad;
                  setCompraEditando({
                    ...compraEditando,
                    productos: nuevosProductos,
                  });
                }}
                className="w-16 p-1 border border-gray-300 rounded text-black"
              />
            </div>
          ))}

          <button
            onClick={() => setModalEdicionOpen(false)}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              handleActualizarCompra(compraEditando);
            }}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Guardar Cambios
          </button>
        </Modal>
      )}
    </div>
  );
}
