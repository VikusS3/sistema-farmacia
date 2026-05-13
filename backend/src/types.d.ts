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
  
  // Legacy fields (for backward compatibility)
  unidad_venta?: string;
  unidad_medida?: string;
  factor_conversion?: number;
  factor_caja?: number | null;
  stock: number;
  precio_compra: number;
  precio_venta: number;
  
  // Enhanced multi-unit pricing
  precio_unidad?: number | null;      // Price per single unit (pill)
  precio_blister?: number | null;     // Price per blister
  precio_caja?: number | null;        // Price per box
  unidades_por_blister?: number;      // How many pills per blister
  unidades_por_caja?: number;         // How many pills per box
  require_lote?: boolean;             // Requires lot/expiration tracking
  
  // Stock management
  stock_minimo: number;
  fecha_vencimiento?: string | null;
}

export interface Lote {
  id?: number;
  producto_id: number;
  numero_lote: string;
  fecha_vencimiento: string;
  cantidad_inicial: number;
  cantidad_disponible: number;
  precio_unitario: number;
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

export type Proovedor = {
  id?: number;
  nombre: string;
  ruc?: string;
  telefono?: string;
  direccion?: string;
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
  caja_id?: number | null;
  fecha?: string;
  total: number;
  detalles: DetalleCompra[];
}

export interface DetalleCompra {
  id?: number;
  compra_id?: number;
  producto_id: number;
  cantidad: number;
  unidad_compra: UnidadVenta;
  precio_unitario: number;
  subtotal: number;
}

export interface Inventario {
  id?: number;
  producto_id: number;
  lote_id?: number | null;
  movimiento: "compra" | "venta" | "ajuste";
  cantidad: number;
  unidades_base?: number;
  motivo?: string;
  fecha_movimiento: string;
  creado_en?: Date;
  actualizado_en?: Date;
}

export type ResumenVentas = {
  id?: number;
  fecha: string;
  total_diario: number;
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
  metodo_pago: "efectivo" | "tarjeta" | "yape/plin";
  total: string;
  usuario_id: number;
}

export interface Venta {
  id?: number;
  cliente_id: number;
  usuario_id: number;
  caja_id: number | null;
  adicional?: number;
  descuento?: number;
  metodo_pago: "efectivo" | "tarjeta" | "transferencia";
  fecha?: string;
  total: number;
  estado?: "completada" | "cancelada";
}

export interface DetalleVenta {
  id?: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  unidad_venta: UnidadVenta;
  precio_unitario: number;
  subtotal: number;
  ganancia: number;
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
  ventasTotales: {
    value: number;
    change: number;
    changeType: CambioType;
  };
  valorInventarioTotal: {
    value: number;
    change: number;
    changeType: CambioType;
  };
  prescripciones: {
    value: number;
    change: number;
    changeType: CambioType;
  };
  inventarioActivo: {
    value: number;
    change: number;
    changeType: CambioType;
  };
  pacientes: {
    value: number;
    change: number;
    changeType: CambioType;
  };
  margenGanancia: {
    value: number;
    change: number;
    changeType: CambioType;
  };
  stockBajo: {
    value: number;
    change: number;
    changeType: CambioType;
  };
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
  precio_unidad: number | null;
  precio_blister: number | null;
  precio_caja: number | null;
  unidades_por_blister: number;
  unidades_por_caja: number;
  tiene_lotes: boolean;
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