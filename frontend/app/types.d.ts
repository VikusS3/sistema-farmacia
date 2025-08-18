/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Login {
  token: string;
  usuario: Usuario;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: string;
  actualizado_en?: Date;
  creado_en?: Date;
}

export interface Proveedores {
  actualizado_en: Date;
  creado_en: Date;
  direccion: string;
  ruc: string;
  id: number;
  nombre: string;
  telefono: string;
}

export interface Categorias {
  actualizado_en: Date;
  creado_en: Date;
  id: number;
  nombre: string;
}
export interface Clientes {
  actualizado_en: Date;
  creado_en: Date;
  direccion: string;
  email: string;
  id: number;
  nombre: string;
  telefono: string;
}

export interface Productos {
  id: number;
  nombre: string;
  descripcion: string;
  unidad_venta: string;
  unidad_medida: string;
  factor_conversion: number;
  factor_caja: number;
  stock: number;
  precio_compra: number;
  precio_venta: number;
  fecha_vencimiento: string;
  ganancia: number;
}

export interface DetalleCompra {
  id?: number;
  compra_id?: number;
  producto_id: number;
  cantidad: number; // cantidad en la unidad de compra
  unidad_compra: "caja" | "blister" | "unidad"; // ✅ nuevo
  precio_unitario: number;
  subtotal: number;
}

export interface CompraProducto {
  compra: Compra;
  productos: Producto[];
  total?: number;
}

export interface Compra {
  [x: string]: any;
  actualizado_en: Date;
  creado_en: Date;
  fecha: string;
  id: number;
  proveedor_id: number;
  proveedor_nombre: string;
  total: number;
  usuario_id: number;
  detalle_compra: DetalleCompra[]; // ahora con unidad_compra
}

export type CompraCreate = {
  proveedor_id: number;
  usuario_id: number;
  total: number;
  detalle_compra: Omit<DetalleCompra, "id" | "compra_id">[];
};

export interface Producto {
  actualizado_en: Date;
  adicional: string;
  cantidad: number;
  creado_en: Date;
  descuento: string;
  id: number;
  precio_unitario: string;
  producto_id: number;
  producto_nombre: string;
  subtotal: string;
  venta_id: number;
  unidad_venta: "caja" | "blister" | "unidad";
  unidad_compra: "caja" | "blister" | "unidad";
  unidad_medida: string;
  factor_conversion: number;
}

//Tipos para las Compra
export interface CompraProductoC {
  productos: ProductoP[];
  venta: VentaP;
}

export interface ProductoP {
  actualizado_en: Date;
  adicional: string;
  cantidad: number;
  creado_en: Date;
  descuento: string;
  id: number;
  precio_unitario: string;
  producto_id: number;
  producto_nombre: string;
  subtotal: string;
  venta_id: number;
}

export interface CompraP {
  actualizado_en: Date;
  adicional: string;
  cliente_id: number;
  creado_en: Date;
  descuento: string;
  fecha: Date;
  id: number;
  metodo_pago: string;
  total: string;
  usuario_id: number;
}

//interfazes para las ventas
export interface Venta {
  actualizado_en: Date;
  adicional: number;
  cliente_id: number;
  creado_en: Date;
  descuento: number;
  fecha: string;
  id: number;
  cliente_nombre: string;
  metodo_pago: string;
  total: number;
  usuario_id: number;
  detalle_venta: DetalleVenta[];
  caja_id?: number;
}

export interface VentaV {
  productos: Producto[];
  venta: Venta;
}

export interface DetalleVenta {
  id?: number;
  venta_id?: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  descuento?: string;
  adicional?: string;
  subtotal: number;
  creado_en?: Date;
  actualizado_en?: Date;
}

export interface VentaProducto {
  venta: Venta;
  productos: Producto[];
  total?: number;
}

export interface VentaWhitProducts {
  venta: VentaModal;
}

export interface VentaModal {
  adicional: number;
  caja_id: null;
  cliente_id: number;
  cliente_nombre: string;
  descuento: number;
  fecha: Date;
  id: number;
  metodo_pago: string;
  productos: Producto[];
  total: string;
  usuario_id: number;
  usuario_nombre: string;
}

export interface ProductoModal {
  cantidad: number;
  id: number;
  precio_unitario: string;
  producto_id: number;
  producto_nombre: string;
  subtotal: string;
  unidad_medida: string;
  unidad_venta: string;
}

export interface Caja {
  id: number;
  usuario_id: number;
  apertura: string;
  cierre: string | null;
  monto_apertura: number;
  monto_cierre: number | null;
  total_sistema: number;
  diferencia: number;
  estado: "abierta" | "cerrada";
}

export interface AbrirCajaInput {
  usuario_id: number;
  monto_apertura: number;
}

export interface CerrarCajaInput {
  caja_id: number;
  monto_cierre: number;
}

export interface AbrirCajaResponse {
  message: string;
  caja: Caja;
}

export interface CajaActivaResponse {
  monto_apertura: number;
  id: number;
  fecha_apertura: string;
  caja: Caja;
}
