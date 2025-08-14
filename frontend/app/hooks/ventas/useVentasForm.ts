/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useVentas } from "./useVentas";
import { useProductos } from "../productos/useProductos";
import { useClientes } from "../clientes/useClientes";
import { VentaProducto, Productos } from "@/app/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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
  const { productos, refetchProductos } = useProductos();
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
      unidad_seleccionada?: string;
      cantidad: number;
      precio_unitario: number;
      subtotal: number;
      unidad_venta: string;
      unidad_medida: string;
      factor_conversion: number;
      factor_caja?: number;
    }[]
  >([]);
  const MySwal = withReactContent(Swal);
  const total = detalleVenta.reduce((acc, item) => acc + item.subtotal, 0);

  // Evita duplicados al agregar productos
  const agregarProducto = (
    producto: Productos,
    cantidad: number,
    unidadSeleccionada: string
  ) => {
    if (cantidad <= 0) return;

    // Calcula el precio según la unidad seleccionada
    let precioVenta = producto.precio_venta;

    if (unidadSeleccionada !== producto.unidad_medida) {
      precioVenta = producto.precio_venta * producto.factor_conversion;
    }

    if (unidadSeleccionada === "caja") {
      precioVenta = producto.precio_venta * producto.factor_caja;
    }

    setDetalleVenta((prevDetalle) => {
      const existente = prevDetalle.find(
        (item) => item.producto_id === producto.id
      );
      if (existente) {
        const nuevoSubtotal = (existente.cantidad + cantidad) * precioVenta;

        MySwal.fire({
          title: "Producto Actualizado",
          text: `Se actualizó el producto ${
            producto.nombre
          } en el carrito. Nuevo subtotal: ${nuevoSubtotal.toFixed(2)}`,
          icon: "success",
        });

        return prevDetalle.map((item) =>
          item.producto_id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                precio_unitario: precioVenta,
                subtotal: nuevoSubtotal,
                unidad_venta: unidadSeleccionada,
              }
            : item
        );
      } else {
        MySwal.fire({
          title: "Producto Agregado",
          text: `Se agregó ${producto.nombre} al carrito`,
          icon: "success",
        });

        return [
          ...prevDetalle,
          {
            producto_id: producto.id,
            nombre: producto.nombre,
            unidad_seleccionada: unidadSeleccionada,
            cantidad,
            precio_unitario: precioVenta,
            subtotal: precioVenta * cantidad,
            unidad_venta: unidadSeleccionada,
            unidad_medida: producto.unidad_medida,
            factor_conversion: producto.factor_conversion,
          },
        ];
      }
    });
  };

  //?POSIBLE INTEGRACION A FUTURO
  const actualizarUnidadVenta = (productoId: number, nuevaUnidad: string) => {
    setDetalleVenta((prev) =>
      prev.map((item) => {
        if (item.producto_id === productoId) {
          // Precio base en unidad mínima (ya registrado al agregar producto)
          let precioUnitario = item.precio_unitario;
          let factor = 1;

          // Ajustar factor según unidad seleccionada
          if (nuevaUnidad === item.unidad_medida) {
            factor = 1; // unidad mínima
          } else if (nuevaUnidad === "blister") {
            factor = item.factor_conversion; // blister → unidades mínimas
          } else if (nuevaUnidad === "caja") {
            factor = item.factor_caja || 1; // caja → unidades mínimas
          }

          // Calcular nuevo precio
          precioUnitario = item.precio_unitario * factor;

          return {
            ...item,
            unidad_venta: nuevaUnidad,
            precio_unitario: precioUnitario,
            subtotal: precioUnitario * item.cantidad,
            ganancia: (precioUnitario - item.precio_unitario) * item.cantidad,
          };
        }
        return item;
      })
    );
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
    if (clienteId === 0) {
      MySwal.fire({
        title: "Error",
        text: "Debe seleccionar un cliente.",
        icon: "error",
      });
      return;
    }

    const venta = {
      cliente_id: clienteId,
      usuario_id: Number(usuarioId),
      caja_id: null, // 🔹 De momento sin caja abierta
      fecha: new Date().toISOString(),
      total: total + adicional - descuento,
      descuento,
      adicional,
      metodo_pago: metodoPago,
      detalle_venta: detalleVenta.map((item) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: Number(item.precio_unitario),
        subtotal: Number(item.subtotal),
        unidad_venta: item.unidad_venta,
        unidad_medida: item.unidad_medida,
        factor_conversion: item.factor_conversion,
      })),
    };

    await addVenta(venta as any);

    MySwal.fire({
      title: "Venta Registrada",
      text: "La venta ha sido registrada exitosamente.",
      icon: "success",
    });

    resetForm();
  };

  const handleActualizarVenta = async (
    ventaEditando: VentaProducto | undefined
  ) => {
    if (!ventaEditando) return;
    //Transformar los valores a números, No lo estaba haciendo y daba NaN XD
    const adicional = parseFloat(String(ventaEditando.venta.adicional)) || 0;
    const descuento = parseFloat(String(ventaEditando.venta.descuento)) || 0;
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
            acc + Number(item.cantidad) * Number(item.precio_unitario),
          0
        ) +
        adicional -
        descuento,

      detalle_venta: ventaEditando.productos.map((item) => ({
        id: item.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: Number(item.precio_unitario) || 0,
        subtotal: Number(item.cantidad) * Number(item.precio_unitario || 0),
        unidad_venta: item.unidad_venta,
        unidad_medida: item.unidad_medida,
        factor_conversion: item.factor_conversion,
      })),
    };

    await actualizarVenta(ventaEditando.venta.id as number, venta);
    resetForm();
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
    refetchProductos,
    actualizarUnidadVenta,
  };
}
