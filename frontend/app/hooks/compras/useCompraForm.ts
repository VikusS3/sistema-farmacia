import { useState } from "react";
import { useCompras } from "./useCompras";
import { useProductos } from "../productos/useProductos";
import { useProveedores } from "../proveedores/useProveedores";
import { Compra, Productos } from "@/app/types";

export function useCompraForm() {
  const {
    addCompra,
    compras,
    eliminarCompra,
    fetchComprasConProductos,
    loading,
    error,
    actualizarCompra,
  } = useCompras();
  const { productos } = useProductos();
  const { proveedores } = useProveedores();
  const usuarioId = localStorage.getItem("usuario_id");

  const [proveedorId, setProveedorId] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [detalleCompra, setDetalleCompra] = useState<
    {
      producto_id: number;
      nombre: string;
      cantidad: number;
      precio_unitario: number;
      subtotal: number;
    }[]
  >([]);

  const total = detalleCompra.reduce((acc, item) => acc + item.subtotal, 0);

  const agregarProducto = (producto: Productos, cantidad: number) => {
    if (cantidad <= 0) return;
    setDetalleCompra([
      ...detalleCompra,
      {
        producto_id: producto.id,
        nombre: producto.nombre,
        cantidad,
        precio_unitario: producto.precio_compra,
        subtotal: producto.precio_compra * cantidad,
      },
    ]);
  };

  const eliminarProducto = (productoId: number) => {
    setDetalleCompra(
      detalleCompra.filter((item) => item.producto_id !== productoId)
    );
  };

  const handleProveedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProveedorId(Number(e.target.value));
  };

  const registrarCompra = async () => {
    const compra = {
      proveedor_id: proveedorId,
      usuario_id: Number(usuarioId),
      fecha: new Date().toISOString(),
      total,
      detalle_compra: detalleCompra.map((item) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal,
      })),
    };
    await addCompra(compra);
    setDetalleCompra([]);
    setModalOpen(false);
  };

  const updateCompra = async (id: number, compra: Partial<Compra>) => {
    await actualizarCompra(id, compra);
  };

  return {
    compras,
    productos,
    proveedores,
    proveedorId,
    setProveedorId,
    modalOpen,
    setModalOpen,
    detalleCompra,
    agregarProducto,
    eliminarProducto,
    handleProveedorChange,
    registrarCompra,
    total,
    fetchComprasConProductos,
    eliminarCompra,
    loading,
    error,
    updateCompra,
  };
}
