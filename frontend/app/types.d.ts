export interface Login {
  token: string;
  usuario: Usuario;
}

export interface Usuario {
  actualizado_en: Date;
  creado_en: Date;
  email: string;
  id: number;
  nombres: string;
  password: string;
  rol: string;
}
