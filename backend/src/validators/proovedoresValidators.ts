import { z } from "zod";

export const createProveedoresSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .max(255, "El nombre debe tener menos de 255 caracteres"),
  ruc: z
    .string()
    .min(11, "El RUC debe tener 11 caracteres")
    .max(11, "El RUC debe tener 11 caracteres"),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener más de 9 caracteres")
    .max(9, "El teléfono debe tener menos de 9 caracteres"),
  direccion: z
    .string()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(255, "La dirección debe tener menos de 255 caracteres"),
});

export const updateProveedoresSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .max(255, "El nombre debe tener menos de 255 caracteres")
    .optional(),
  ruc: z
    .string()
    .min(11, "El RUC debe tener 11 caracteres")
    .max(11, "El RUC debe tener 11 caracteres")
    .optional(),
  direccion: z
    .string()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(255, "La dirección debe tener menos de 255 caracteres")
    .optional(),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener más de 9 caracteres")
    .max(9, "El teléfono debe tener menos de 9 caracteres")
    .optional(),
});
