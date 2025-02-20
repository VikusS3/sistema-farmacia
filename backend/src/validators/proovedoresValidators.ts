import { z } from "zod";

export const createProveedoresSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .max(255, "El nombre debe tener menos de 255 caracteres"),
  direccion: z
    .string()
    .min(3)
    .max(255, "La dirección debe tener menos de 255 caracteres"),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener más de 9 caracteres")
    .max(9, "El teléfono debe tener menos de 9 caracteres"),
  email: z.string().email("El email no es válido"),
});

export const updateProveedoresSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .max(255, "El nombre debe tener menos de 255 caracteres")
    .optional(),
  direccion: z
    .string()
    .min(3)
    .max(255, "La dirección debe tener menos de 255 caracteres")
    .optional(),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener más de 9 caracteres")
    .max(9, "El teléfono debe tener menos de 9 caracteres")
    .optional(),
  email: z.string().email("El email no es válido").optional(),
});
