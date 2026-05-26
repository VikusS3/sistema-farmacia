export type Usuario = {
  id?: number;
  nombre: string;
  email: string;
  password: string;
  rol?: "admin" | "empleado";
  estado?: 1 | 0;
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

export type UnidadVenta = "unidad" | "blister" | "caja";

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  categoria_id?: number | null;
  categoria_nombre?: string;
  stock: number;
  stock_minimo: number;
  unidad_medida: string;
  unidades_por_blister: number;
  blisters_por_caja: number;
  precio_unidad?: number;
  precio_blister?: number;
  precio_caja?: number;
  require_lote: boolean;
  creado_en?: Date;
  actualizado_en?: Date;
}

export interface Lote {
  id?: number;
  producto_id: number;
  producto_nombre?: string;
  compra_id?: number | null;
  numero_lote: string;
  fecha_vencimiento: string;
  cantidad_inicial: number;
  cantidad_disponible: number;
  costo_unitario: number;
  estado: "activo" | "agotado" | "vencido";
  created_at?: Date;
  updated_at?: Date;
}

export type AlertaTipo = "bajo_stock" | "sin_stock" | "por_vencer" | "vencido";

export interface AlertaStock {
  id?: number;
  producto_id: number;
  producto_nombre?: string;
  tipo_alerta: AlertaTipo;
  mensaje: string;
  leida: boolean;
  created_at?: Date;
}

export type Proveedor = {
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

export interface Compra {
  id?: number;
  proveedor_id: number;
  proveedor_nombre?: string;
  usuario_id: number;
  usuario_nombre?: string;
  caja_id?: number | null;
  fecha?: string;
  subtotal: number;
  descuento: number;
  total: number;
  observaciones?: string;
  detalles: DetalleCompra[];
}

export interface DetalleCompra {
  id?: number;
  compra_id?: number;
  producto_id: number;
  producto_nombre?: string;
  lote_id?: number | null;
  tipo_compra: UnidadVenta;
  cantidad: number;
  factor_conversion?: number;
  unidades_totales?: number;
  costo_unitario_compra?: number;
  subtotal: number;
  numero_lote?: string;
  fecha_vencimiento?: string;
}

export interface Inventario {
  id?: number;
  producto_id: number;
  producto_nombre?: string;
  lote_id?: number | null;
  usuario_id?: number | null;
  movimiento: "compra" | "venta" | "ajuste" | "vencido" | "devolucion";
  tipo_referencia: "compra" | "venta" | "manual";
  referencia_id?: number | null;
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  motivo?: string;
  fecha_movimiento: string;
  created_at?: Date;
}

export type ResumenVentas = {
  id?: number;
  fecha: string;
  total_dia: number;
  creado_en?: Date;
  actualizado_en?: Date;
};

export interface VentaTicket {
  actualizado_en: Date;
  adicional?: number;
  cliente_id: number;
  cliente_nombre: string;
  creado_en: Date;
  descuento?: number;
  fecha: Date;
  id: number;
  metodo_pago: "efectivo" | "tarjeta" | "transferencia";
  total: string;
  usuario_id: number;
}

export interface Venta {
  id?: number;
  cliente_id: number;
  cliente_nombre?: string;
  usuario_id: number;
  usuario_nombre?: string;
  caja_id: number | null;
  fecha?: string;
  subtotal: number;
  descuento: number;
  adicional: number;
  total: number;
  metodo_pago: "efectivo" | "tarjeta" | "transferencia";
  estado?: "completada" | "cancelada";
}

export interface DetalleVenta {
  id?: number;
  venta_id: number;
  producto_id: number;
  producto_nombre?: string;
  lote_id?: number | null;
  unidad_venta: UnidadVenta;
  cantidad: number;
  unidades_base: number;
  precio_unitario: number;
  costo_real_unitario: number;
  descuento: number;
  adicional: number;
  subtotal: number;
  ganancia: number;
  creado_en?: Date;
  actualizado_en?: Date;
}

export interface Caja {
  id: number;
  usuario_id: number;
  usuario_nombre?: string;
  fecha_apertura: Date | string;
  monto_apertura: number;
  fecha_cierre?: Date | string | null;
  monto_cierre?: number | null;
  total_ventas?: number;
  diferencia?: number | null;
  estado: "abierta" | "cerrada";
  created_at?: Date;
  updated_at?: Date;
}

export type CambioType = "positive" | "negative" | "warning";

export interface MetricasDashboard {
  ventasTotales: { value: number; change: number; changeType: CambioType };
  valorInventarioTotal: { value: number; change: number; changeType: CambioType };
  prescripciones: { value: number; change: number; changeType: CambioType };
  inventarioActivo: { value: number; change: number; changeType: CambioType };
  pacientes: { value: number; change: number; changeType: CambioType };
  margenGanancia: { value: number; change: number; changeType: CambioType };
  stockBajo: { value: number; change: number; changeType: CambioType };
}

export interface VentasQueryResult {
  total: number | null;
  cantidad: number;
}

export interface ClientesQueryResult {
  total: number;
}

export interface InventarioQueryResult {
  total: number;
}

export interface GananciaQueryResult {
  ganancia: number | null;
  ingreso: number | null;
}

export interface StockBajoQueryResult {
  total: number;
}

export interface ProductoConStock {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  stock_minimo: number;
  precio_unidad?: number;
  precio_blister?: number;
  precio_caja?: number;
  unidades_por_blister: number;
  blisters_por_caja: number;
  require_lote: boolean;
  lotes_disponibles?: Lote[];
}

export interface VentaCreateInput {
  cliente_id: number;
  usuario_id: number;
  caja_id: number;
  descuento?: number;
  adicional?: number;
  metodo_pago: "efectivo" | "tarjeta" | "transferencia";
  detalle_venta: {
    producto_id: number;
    cantidad: number;
    unidad_venta: UnidadVenta;
  }[];
}

export interface MovimientoLote {
  id?: number;
  lote_id: number;
  tipo: "entrada" | "salida" | "ajuste" | "vencido";
  cantidad: number;
  motivo?: string;
  fecha?: Date;
}

export interface HistorialPrecio {
  id?: number;
  producto_id: number;
  tipo_precio: "precio_unidad" | "precio_blister" | "precio_caja";
  precio_anterior: number;
  precio_nuevo: number;
  fecha_cambio?: Date;
}
