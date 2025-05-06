"use client";
import Modal from "@/app/components/Modal";
import DetalleVenta from "@/app/components/ventas/DetalleVenta";
import ProductosListVentas from "@/app/components/ventas/ProductosListVentas";
import SelectCliente from "@/app/components/ventas/SelectCliente";
import VentaEditando from "@/app/components/ventas/VentaEditando";
import VentaForm from "@/app/components/ventas/VentaForm";
import VentaList from "@/app/components/ventas/VentaList";
import VentaSeleccionada from "@/app/components/ventas/VentaSeleccionada";
import { useVentasForm } from "@/app/hooks/ventas/useVentasForm";
import { VentaProducto } from "@/app/types";
import { useState } from "react";

export default function VentasPage() {
  const {
    agregarProducto,
    ventas,
    detalleVenta,
    eliminarVenta,
    eliminarProducto,
    error,
    fetchVentasConProductos,
    handleClienteChange,
    loading,
    modalOpen,
    productos,
    clienteId,
    clientes,
    registrarVenta,
    setModalOpen,
    handleActualizarVenta,
    total,
    adicional,
    setAdicional,
    descuento,
    setDescuento,
    metodoPago,
    setMetodoPago,
    refetchProductos,
  } = useVentasForm();

  const [modalEdicionOpen, setModalEdicionOpen] = useState(false);
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [ventaEditantdo, setVentaEditantdo] = useState<VentaProducto | null>(
    null
  );

  const handleEditingCompra = async (ventaId: number) => {
    const venta = await fetchVentasConProductos(ventaId);
    setVentaEditantdo(venta);
    setModalEdicionOpen(true);
  };
  const [ventaSeleccionada, setVentaSeleccionada] =
    useState<VentaProducto | null>(null);

  const handleVerProductosCompra = async (ventaId: number) => {
    const venta = await fetchVentasConProductos(ventaId);
    setVentaSeleccionada(venta);
  };

  const showModalProductos = () => {
    setModalProductoOpen(true);
  };

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto bg-background-200 shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-text-100 mb-6 border-b border-primary-200 pb-2">
        Registrar Venta
      </h1>

      {loading && <p className="text-primary-300 animate-pulse">Cargando...</p>}
      {error && <p className="text-accent-100 font-semibold">{error}</p>}

      <div className="mb-6">
        <SelectCliente
          clientes={clientes}
          clienteId={clienteId}
          handleClienteChange={handleClienteChange}
        />
      </div>

      {/* Lista de productos */}
      <button
        onClick={showModalProductos}
        className="w-full p-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200 transition-all font-semibold mb-5"
      >
        Agrega productos a la venta
      </button>
      <Modal
        isOpen={modalProductoOpen}
        onClose={() => setModalProductoOpen(false)}
        title="Agregar Productos"
        className="max-w-6xl"
      >
        <ProductosListVentas
          productos={productos}
          refetchProductos={refetchProductos}
          agregarProducto={agregarProducto}
        />
      </Modal>

      {/* Botón para abrir modal */}
      <button
        onClick={() => setModalOpen(true)}
        className="w-full p-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200 transition-all font-semibold"
      >
        Ver Detalle y Registrar
      </button>

      {/* Modal con el detalle de la venta */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalle de la Venta"
        className="max-w-2xl"
      >
        <VentaForm
          adicional={adicional}
          descuento={descuento}
          metodoPago={metodoPago}
          setAdicional={setAdicional}
          setDescuento={setDescuento}
          setMetodoPago={setMetodoPago}
        />
        {detalleVenta.length > 0 ? (
          <DetalleVenta
            detalleVenta={detalleVenta}
            total={total}
            eliminarProducto={eliminarProducto}
            registrarVenta={registrarVenta}
          />
        ) : (
          <p className="text-text-200 italic text-center mt-4">
            No hay productos agregados.
          </p>
        )}
      </Modal>

      {/* Lista de ventas */}
      <div className="mt-6">
        <VentaList
          ventas={ventas}
          handleEdit={handleEditingCompra}
          borrarVenta={eliminarVenta}
          handleVerProductosVenta={handleVerProductosCompra}
        />
      </div>

      {/* Modal con el detalle de la venta */}
      {ventaSeleccionada && (
        <Modal
          isOpen={Boolean(ventaSeleccionada)}
          onClose={() => setVentaSeleccionada(null)}
          title={ventaSeleccionada.venta.cliente_nombre}
          className="max-w-4xl"
        >
          <VentaSeleccionada
            ventaSeleccionada={ventaSeleccionada}
            setVentaSeleccionada={setVentaSeleccionada}
          />
        </Modal>
      )}

      {ventaEditantdo && (
        <Modal
          isOpen={modalEdicionOpen}
          onClose={() => setModalEdicionOpen(false)}
          title="Editar Compra"
        >
          <VentaEditando
            clientes={clientes}
            ventaEditando={ventaEditantdo}
            setVentaEditando={setVentaEditantdo}
            handleActualizarVenta={handleActualizarVenta}
            setModalEdicionOpen={setModalEdicionOpen}
          />
        </Modal>
      )}
    </div>
  );
}
