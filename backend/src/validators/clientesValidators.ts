import { z } from "zod";

export const createClientesSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .max(255, "El nombre debe tener menos de 255 caracteres"),
  email: z.string().email("El email no es válido").optional(),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener al menos 9 caracteres")
    .max(9, "El teléfono debe tener como máximo 9 caracteres")
    .optional(),
  direccion: z
    .string()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .optional(),
});

export const updateClientesSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .max(255, "El nombre debe tener menos de 255 caracteres")
    .optional(),
  email: z.string().email("El email no es válido").optional(),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener al menos 9 caracteres")
    .max(9, "El teléfono debe tener como máximo 9 caracteres")
    .optional(),
  direccion: z
    .string()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .optional(),
});
