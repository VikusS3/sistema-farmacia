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
