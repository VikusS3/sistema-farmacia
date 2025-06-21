export interface Login {
  token: string;
  usuario: Usuario;
}

export interface Usuario {
  id: number;
  nombres: string;
  email: string;
  password: string;
  rol: string;
  actualizado_en?: Date;
  creado_en?: Date;
  estado: 1 | 0;
}

export interface Proveedores {
  actualizado_en: Date;
  creado_en: Date;
  direccion: string;
  email: string;
  id: number;
  nombre: string;
  telefono: string;
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

export interface Categoria {
  actualizado_en: Date;
  creado_en: Date;
  descripcion: string;
  id: number;
  nombre: string;
}

export interface Productos {
  actualizado_en: Date;
  categoria_id: number;
  creado_en: Date;
  descripcion: string;
  fecha_vencimiento: string; //!capaz cambiar a string
  id: number;
  nombre: string;
  precio_compra: number;
  precio_venta: number;
  stock: number;
  stock_minimo: number;
  unidad_medida: string;
  factor_conversion: number;
  unidad_venta: string;
}

export interface DetalleCompra {
  id?: number; // Opcional si lo genera la BD
  compra_id?: number; // Opcional si se asigna después
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CompraProducto {
  compra: Compra;
  productos: Producto[];
  total?: number;
}

export interface Compra {
  actualizado_en: Date;
  creado_en: Date;
  fecha: string;
  id: number;
  proveedor_id: number;
  proveedor_nombre: string;
  total: number;
  usuario_id: number;
  detalle_compra: DetalleCompra[];
}

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
  unidad_venta: string;
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

export interface Caja {
  actualizado_en: string;
  creado_en: string;
  estado: "abierta" | "cerrada";
  fecha_apertura: string;
  fecha_cierre: string | null;
  id: number;
  monto_apertura: number;
  monto_cierre: number | null;
  usuario_id: number;
}

// cajaServices.ts o en un archivo de tipos aparte
export type AbrirCajaInput = {
  usuario_id: number;
  monto_apertura: number;
  fecha_apertura?: string;
};

export type CerrarCajaInput = {
  id: number;
  fecha_cierre?: string;
  monto_cierre: number;
};

export type AbrirCajaResponse = {
  id: number;
  message: string;
};

export interface CajaActivaResponse {
  id: number;
  message: string;
  fecha_apertura: string;
  monto_apertura: number;
  fecha_cierre: string | null;
  monto_cierre: number | null;
  estado: "abierta" | "cerrada";
  usuario_id: number;
}
