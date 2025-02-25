import { useState } from "react";
import { useCompras } from "./useCompras";
import { useProductos } from "../productos/useProductos";
import { useProveedores } from "../proveedores/useProveedores";
import { CompraProducto, Productos } from "@/app/types";

export function useCompraForm() {
  const {
    addCompra,
    compras,
    eliminarCompra,
    fetchComprasConProductos,
    loading,
    error,
    fetchCompras,
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

  // Evita duplicados al agregar productos
  const agregarProducto = (producto: Productos, cantidad: number) => {
    if (cantidad <= 0) return;

    setDetalleCompra((prevDetalle) => {
      const existente = prevDetalle.find(
        (item) => item.producto_id === producto.id
      );
      if (existente) {
        return prevDetalle.map((item) =>
          item.producto_id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                subtotal: (item.cantidad + cantidad) * item.precio_unitario,
              }
            : item
        );
      } else {
        return [
          ...prevDetalle,
          {
            producto_id: producto.id,
            nombre: producto.nombre,
            cantidad,
            precio_unitario: producto.precio_compra,
            subtotal: producto.precio_compra * cantidad,
          },
        ];
      }
    });
  };

  const eliminarProducto = (productoId: number) => {
    setDetalleCompra((prevDetalle) =>
      prevDetalle.filter((item) => item.producto_id !== productoId)
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
    resetForm();
  };

  // Actualizar compra
  const handleActualizarCompra = async (
    compraEditando: CompraProducto | null
  ) => {
    if (!compraEditando) return;

    const compra = {
      proveedor_id: compraEditando.compra.proveedor_id,
      usuario_id: compraEditando.compra.usuario_id,
      fecha: new Date().toISOString(),
      //tiene que ser el total de la compra si se cambia los subtotales de los productos aun no lo hace
      total: compraEditando.productos.reduce(
        (acc, item) =>
          acc + Number(item.cantidad) * Number(item.precio_unitario || 0),
        0
      ),

      detalle_compra: compraEditando.productos.map((item) => ({
        id: item.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: Number(item.precio_unitario) || 0,
        subtotal: Number(item.cantidad) * Number(item.precio_unitario || 0),
      })),
    };

    await actualizarCompra(compraEditando.compra.id as number, compra);
    resetForm();
  };

  // Resetear formulario después de registrar o actualizar
  const resetForm = () => {
    setProveedorId(0);
    setDetalleCompra([]);
    setModalOpen(false);
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
    fetchCompras,
    error,
    handleActualizarCompra,
  };
}
