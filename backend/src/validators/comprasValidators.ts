import { z } from "zod";

export const createComprasSchema = z.object({
  proveedor_id: z.number(),
  usuario_id: z.number(),
  fecha: z.string(),
  total: z.number(),
});

export const updateComprasSchema = z.object({
  proveedor_id: z.number().optional(),
  usuario_id: z.number().optional(),
  fecha: z.string().optional(),
  total: z.number().optional(),
});
