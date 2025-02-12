export type Usuario = {
  id?: number;
  nombres: string;
  email: string;
  password: string;
  rol?: "admin" | "empleado";
  creado_en?: Date;
  actualizado_en?: Date;
};

export type Producto = {
  id?: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  cantidad: number;
  stock_minimo: number;
  categoria?: string;
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
