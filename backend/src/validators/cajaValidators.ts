import { z } from "zod";

export const aperturaCajaSchema = z.object({
  usuario_id: z.number().int().positive(),
  monto_apertura: z.number().nonnegative(),
});

export const cierreCajaSchema = z.object({
  caja_id: z.number().int().positive(),
  monto_cierre: z.number().nonnegative(),
});
