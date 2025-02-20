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
