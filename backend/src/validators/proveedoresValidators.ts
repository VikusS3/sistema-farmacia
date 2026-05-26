import { z } from "zod";

export const createProveedoresSchema = z.object({
  nombre: z.string().min(3).max(255, "El nombre debe tener menos de 255 caracteres"),
  email: z.string().email("Email inválido").optional(),
  telefono: z.string().min(9, "El teléfono debe tener al menos 9 caracteres").max(9).optional(),
  direccion: z.string().max(255).optional(),
});

export const updateProveedoresSchema = z.object({
  nombre: z.string().min(3).max(255).optional(),
  email: z.string().email("Email inválido").optional(),
  telefono: z.string().min(9).max(9).optional(),
  direccion: z.string().max(255).optional(),
});
