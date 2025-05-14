"use client";

import CompraEditando from "@/app/components/compras/CompraEditando";
import CompraList from "@/app/components/compras/CompraList";
import CompraSeleccionada from "@/app/components/compras/CompraSeleccionada";
import DetalleCompra from "@/app/components/compras/DetalleCompra";
import ProductosListCompra from "@/app/components/compras/ProductosListCompras";
import SelectProveedor from "@/app/components/compras/SelectProveedor";
import Modal from "@/app/components/Modal";
import { useCompraForm } from "@/app/hooks/compras/useCompraForm";
import { CompraProducto } from "@/app/types";
import { useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

function ComprasPage() {
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
    refetchProductos,
  } = useCompraForm();

  const [modalEdicionOpen, setModalEdicionOpen] = useState(false);
  const [compraEditando, setCompraEditando] = useState<CompraProducto | null>(
    null
  );
  const [modalProductoOpen, setModalProductoOpen] = useState(false);

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

  const showModalProductos = () => {
    setModalProductoOpen(true);
  };
  return (
    <div className="p-6 font-sans max-w-4xl mx-auto bg-background-200 shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-text-100 mb-6 border-b border-primary-200 pb-2">
        Registrar Compra
      </h1>
      {loading && <p className="text-primary-300 animate-pulse">Cargando...</p>}
      {error && <p className="text-accent-100 font-semibold">{error}</p>}

      {/* Selector de proveedor */}
      <div className="mb-6">
        <SelectProveedor
          proveedores={proveedores}
          proveedorId={proveedorId}
          handleProveedorChange={handleProveedorChange}
        />
      </div>

      {/* Lista de productos */}

      <button
        onClick={showModalProductos}
        className="w-full p-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200 transition-all font-semibold mb-5"
      >
        Agrega productos a la compra
      </button>

      <Modal
        isOpen={modalProductoOpen}
        onClose={() => setModalProductoOpen(false)}
        title="Agregar Productos"
        className="max-w-6xl"
      >
        <ProductosListCompra
          productos={productos}
          agregarProducto={agregarProducto}
          refetchProductos={refetchProductos}
        />
      </Modal>

      {/* Botón para abrir modal */}
      <button
        onClick={() => setModalOpen(true)}
        className="w-full p-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200 transition-all font-semibold"
      >
        Ver Detalle de la compra y Registrar
      </button>

      {/* Modal con el detalle de la compra */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalle de la Compra"
        className="max-w-2xl"
      >
        {detalleCompra.length > 0 ? (
          <DetalleCompra
            detalleCompra={detalleCompra}
            total={total}
            eliminarProducto={eliminarProducto}
            registrarCompra={registrarCompra}
          />
        ) : (
          <p className="text-gray-500">No hay productos agregados.</p>
        )}
      </Modal>

      {/* Lista de compras */}
      <div className="mt-6">
        <CompraList
          compras={compras}
          handleVerProductosCompra={handleVerProductosCompra}
          handleEdit={handleEditingCompra}
          borrarCompra={eliminarCompra}
        />
      </div>

      {/* Modal con el detalle de la compra */}
      {compraSeleccionada && (
        <Modal
          isOpen={Boolean(compraSeleccionada)}
          onClose={() => setCompraSeleccionada(null)}
          title={`${compraSeleccionada.compra.proveedor_nombre}`}
          className="max-w-4xl"
        >
          <CompraSeleccionada
            compraSeleccionada={compraSeleccionada}
            setCompraSeleccioanda={setCompraSeleccionada}
          />
        </Modal>
      )}

      {compraEditando && (
        <Modal
          isOpen={modalEdicionOpen}
          onClose={() => setModalEdicionOpen(false)}
          title="Editar Compra"
        >
          <CompraEditando
            proveedores={proveedores}
            compraEditando={compraEditando}
            setCompraEditando={setCompraEditando}
            handleActualizarCompra={handleActualizarCompra}
            setModalEdicionOpen={setModalEdicionOpen}
          />
        </Modal>
      )}
    </div>
  );
}

export default function ComprasPageWrapper() {
  return (
    <ProtectedRoute>
      <ComprasPage />
    </ProtectedRoute>
  );
}
