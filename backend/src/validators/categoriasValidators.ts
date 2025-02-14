import { z } from "zod";

export const createCategoriasSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .max(255, "El nombre debe tener menos de 255 caracteres"),
  descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
});

export const updateCategoriasSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .max(255, "El nombre debe tener menos de 255 caracteres")
    .optional(),
  descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .optional(),
});
