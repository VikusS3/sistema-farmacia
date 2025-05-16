import { z } from "zod";

export const abrirCajaSchema = z.object({
  usuario_id: z.number().int().positive({ message: "ID de usuario inválido" }),
  fecha_apertura: z.string().min(10, "Formato de fecha inválido").optional(),
  monto_apertura: z
    .number()
    .nonnegative({ message: "El monto debe ser positivo" }),
});

export const cerrarCajaSchema = z.object({
  id: z.number().int().positive({ message: "ID de caja inválido" }),
  fecha_cierre: z.string().min(10, "Formato de fecha inválido").optional(),
  monto_cierre: z
    .number()
    .nonnegative({ message: "El monto debe ser positivo" }),
});

export const cajaIdSchema = z.object({
  id: z
    .string()
    .transform(Number)
    .pipe(
      z.number().int().positive({
        message: "ID de caja inválido",
      })
    ),
});
