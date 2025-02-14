import { z } from "zod";

export const createInventarioSchema = z.object({
  producto_id: z.number().int().positive(),
  movimiento: z.enum(["compra", "venta", "ajuste"]),
  cantidad: z.number().int().positive(),
  motivo: z.string().optional(),
  fecha_movimiento: z.string().optional(), // Formato YYYY-MM-DD
});

export const updateInventarioSchema = z.object({
  producto_id: z.number().int().positive().optional(),
  movimiento: z.enum(["compra", "venta", "ajuste"]).optional(),
  cantidad: z.number().int().positive().optional(),
  motivo: z.string().optional(),
  fecha_movimiento: z.string().optional(), // Formato YYYY-MM-DD
});
