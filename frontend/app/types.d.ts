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
