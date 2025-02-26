import { useState } from "react";
import { useVentas } from "./useVentas";
import { useProductos } from "../productos/useProductos";
import { useClientes } from "../clientes/useClientes";
import { VentaProducto, Productos } from "@/app/types";

export function useVentasForm() {
  const {
    actualizarVenta,
    addVenta,
    ventas,
    eliminarVenta,
    fetchVentas,
    fetchVentasConProductos,
    loading,
    error,
  } = useVentas();
  const { productos } = useProductos();
  const { clientes } = useClientes();
  const usuarioId = localStorage.getItem("usuario_id");
  const [metodoPago, setMetodoPago] = useState<string>("efectivo");
  const [descuento, setDescuento] = useState(0);
  const [adicional, setAdicional] = useState(0);

  const [clienteId, setClienteId] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [detalleVenta, setDetalleVenta] = useState<
    {
      producto_id: number;
      nombre: string;
      cantidad: number;
      precio_unitario: number;
      subtotal: number;
    }[]
  >([]);

  const total = detalleVenta.reduce((acc, item) => acc + item.subtotal, 0);

  // Evita duplicados al agregar productos
  const agregarProducto = (producto: Productos, cantidad: number) => {
    if (cantidad <= 0) return;

    setDetalleVenta((prevDetalle) => {
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
            precio_unitario: producto.precio_venta,
            subtotal: producto.precio_venta * cantidad,
          },
        ];
      }
    });
  };

  const eliminarProducto = (productoId: number) => {
    setDetalleVenta((prevDetalle) =>
      prevDetalle.filter((item) => item.producto_id !== productoId)
    );
  };

  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClienteId(Number(e.target.value));
  };

  const resetForm = () => {
    setClienteId(0);
    setDetalleVenta([]);
    setModalOpen(false);
  };

  const registrarVenta = async () => {
    const venta = {
      cliente_id: clienteId,
      usuario_id: Number(usuarioId),
      fecha: new Date().toISOString(),
      total: total + adicional - descuento,
      descuento: descuento,
      adicional: adicional,
      metodo_pago: metodoPago,
      detalle_venta: detalleVenta.map((item) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: Number(item.precio_unitario),
        subtotal: Number(item.subtotal),
      })),
    };
    await addVenta(venta);
    resetForm();
  };

  const handleActualizarVenta = async (
    ventaEditando: VentaProducto | undefined
  ) => {
    if (!ventaEditando) return;
    const venta = {
      cliente_id: ventaEditando.venta.cliente_id,
      usuario_id: ventaEditando.venta.usuario_id,
      fecha: new Date().toISOString(),
      descuento: ventaEditando.venta.descuento,
      adicional: ventaEditando.venta.adicional,
      metodo_pago: ventaEditando.venta.metodo_pago,
      total:
        ventaEditando.productos.reduce(
          (acc, item) =>
            acc + Number(item.cantidad) * Number(item.precio_unitario || 0),
          0
        ) +
        ventaEditando.venta.adicional -
        ventaEditando.venta.descuento,

      detalle_venta: ventaEditando.productos.map((item) => ({
        id: item.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: Number(item.precio_unitario),
        subtotal: Number(item.subtotal),
      })),
    };

    await actualizarVenta(ventaEditando.venta.id as number, venta);
  };

  return {
    ventas,
    productos,
    clientes,
    loading,
    error,
    clienteId,
    setClienteId,
    modalOpen,
    setModalOpen,
    detalleVenta,
    setDetalleVenta,
    total,
    agregarProducto,
    eliminarProducto,
    handleClienteChange,
    resetForm,
    registrarVenta,
    handleActualizarVenta,
    fetchVentas,
    fetchVentasConProductos,
    eliminarVenta,
    metodoPago,
    setMetodoPago,
    descuento,
    setDescuento,
    adicional,
    setAdicional,
  };
}
