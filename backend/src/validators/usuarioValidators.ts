import { z } from "zod";

export const createUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre debe tener menos de 255 caracteres"),
  email: z.string().email("El email no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rol: z.enum(["admin", "empleado"]).optional(),
});

export const updateUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre debe tener menos de 255 caracteres")
    .optional(),
  email: z.string().email("El email no es válido").optional(),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional(),
  rol: z.enum(["admin", "empleado"]).optional(),
});
