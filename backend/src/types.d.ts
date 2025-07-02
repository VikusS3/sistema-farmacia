export type Usuario = {
  id?: number;
  nombres: string;
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

export type Producto = {
  id?: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  stock: number;
  stock_minimo: number;
  unidad_medida: string;
  categoria_id: number;
  fecha_vencimiento?: string;
  creado_en?: Date;
  actualizado_en?: Date;
  unidad_venta?: string;
  factor_conversion?: number;
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

  detalle_compra?: DetalleCompra[];
};

export type DetalleCompra = {
  id: number;
  compra_id?: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
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

export interface VentaTicket {
  actualizado_en: Date;
  adicional: string;
  cliente_id: number;
  cliente_nombre: string;
  creado_en: Date;
  descuento: string;
  fecha: Date;
  id: number;
  metodo_pago: string;
  total: string;
  usuario_id: number;
}

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

export type Caja = {
  id?: number;
  usuario_id: number;
  fecha_apertura: string;
  monto_apertura: number;
  fecha_cierre: string;
  monto_cierre: number;
  estado: "abierta" | "cerrada";
  creado_en?: Date;
  actualizado_en?: Date;
};

// Interface para las métricas del dashboard
export type CambioType = "positive" | "negative" | "warning";

export interface MetricasDashboard {
  ventasTotales: {
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
