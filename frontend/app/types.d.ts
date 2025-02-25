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
  conversion: number;
  descripcion: string;
  fecha_vencimiento: string; //!capaz cambiar a string
  id: number;
  nombre: string;
  precio_compra: number;
  precio_venta: number;
  stock: number;
  stock_minimo: number;
  unidad_medida: string;
}

export interface Compra {
  id: number;
  proveedor_id: number;
  usuario_id: number;
  fecha: string; // Puede convertirse a Date si es necesario
  total: number; // Si total debería ser un número, conviértelo a `number`
  creado_en: string;
  actualizado_en: string;
  detalle_compra: DetalleCompra[];
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
  fecha: Date;
  id: number;
  proveedor_id: number;
  proveedor_nombre: string;
  total: string;
  usuario_id: number;
}

export interface Producto {
  cantidad: number;
  compra_id: number;
  id: number;
  precio_unitario: string;
  producto_id: number;
  producto_nombre: string;
  subtotal: string;
}
