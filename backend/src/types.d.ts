export type Usuario = {
  id?: number;
  nombres: string;
  email: string;
  password: string;
  rol?: "admin" | "empleado";
  creado_en?: Date;
  actualizado_en?: Date;
};

export type Categoria = {
  id?: number;
  nombre: string;
  descripcion?: string;
  creado_en?: Date;
  actualizado_en?: Date;
};

export type Producto = {
  id?: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  stock: number;
  stock_minimo: number;
  unidad_medida: string;
  conversion: number;
  categoria_id: number;
  fecha_vencimiento?: string;
  creado_en?: Date;
  actualizado_en?: Date;
};

export type Proovedor = {
  id?: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  creado_en?: Date;
  actualizado_en?: Date;
};

export type Clientes = {
  id?: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  creado_en?: Date;
  actualizado_en?: Date;
};

export type Compras = {
  id?: number;
  proveedor_id: number;
  usuario_id: number;
  fecha: string;
  total: number;
  creado_en?: Date;
  actualizado_en?: Date;
};

export type DetalleCompra = {
  id: number;
  compra_id?: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
};

export type Ventas = {
  id?: number;
  cliente_id: number;
  usuario_id: number;
  fecha: string;
  total: number;
  descuento?: number;
  adicional?: number;
  metodo_pago?: string;
  creado_en?: Date;
  actualizado_en?: Date;
};

export type DetalleVenta = {
  id?: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  descuento?: number;
  adicional?: number;
  subtotal: number;
  creado_en?: Date;
  actualizado_en?: Date;
};

export type Inventario = {
  id?: number;
  producto_id: number;
  movimiento: "compra" | "venta" | "ajuste";
  cantidad: number;
  motivo?: string;
  fecha_movimiento: string;
  creado_en?: Date;
  actualizado_en?: Date;
};

export type ResumenVentas = {
  id?: number;
  fecha: string;
  total_diario: number;
  creado_en?: Date;
  actualizado_en?: Date;
};
