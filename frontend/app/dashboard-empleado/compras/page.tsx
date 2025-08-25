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
import { Plus, Eye } from "lucide-react";
import GeneralSkeleton from "@/app/components/skeletons/GeneralSkeleton";

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
      <h1 className="text-3xl font-bold text-text-100 mb-4 border-b border-primary-200 pb-2">
        Registrar Compra
      </h1>
      {loading && <GeneralSkeleton />}
      {error && <p className="text-accent-100 font-semibold">{error}</p>}

      {/* Selector de proveedor */}
      <div className="mb-4">
        <SelectProveedor
          proveedores={proveedores}
          proveedorId={proveedorId}
          handleProveedorChange={handleProveedorChange}
        />
      </div>

      <div className="w-full flex flex-row gap-4">
        <button
          onClick={showModalProductos}
          className="w-full flex flex-row items-center justify-center gap-2 p-3 bg-primary-50 text-white rounded-lg hover:bg-primary-50/80 transition-all font-semibold "
        >
          <Plus className="w-4 h-4" /> Agrega productos
        </button>

        {/* Botón para abrir modal */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex flex-row items-center justify-center gap-2 p-3 bg-primary-50/80 text-white rounded-lg hover:bg-primary-50/90 transition-all font-semibold"
        >
          <Eye className="w-4 h-4" /> Ver Compra y Registrar
        </button>
      </div>

      {/* Lista de compras */}
      <div className="mt-6">
        <CompraList
          compras={compras}
          handleVerProductosCompra={handleVerProductosCompra}
          handleEdit={handleEditingCompra}
          borrarCompra={eliminarCompra}
        />
      </div>

      <Modal
        isOpen={modalProductoOpen}
        onClose={() => setModalProductoOpen(false)}
        title="Agregar Productos"
        className="max-w-6xl w-full"
      >
        <ProductosListCompra
          productos={productos}
          agregarProducto={agregarProducto}
          refetchProductos={refetchProductos}
        />
      </Modal>

      {/* Modal con el detalle de la compra */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalle de la Compra"
        className="max-w-4xl"
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

      {/* Modal con el detalle de la compra */}
      {compraSeleccionada && (
        <Modal
          isOpen={Boolean(compraSeleccionada)}
          onClose={() => setCompraSeleccionada(null)}
          title={`Proveedor: ${compraSeleccionada.compra.proveedor_nombre}`}
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
