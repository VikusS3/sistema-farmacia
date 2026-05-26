import { z } from "zod";

export const createInventarioSchema = z.object({
  producto_id: z.number().int().positive(),
  lote_id: z.number().int().positive().optional(),
  usuario_id: z.number().int().positive().optional(),
  movimiento: z.enum(["compra", "venta", "ajuste", "vencido", "devolucion"]),
  tipo_referencia: z.enum(["compra", "venta", "manual"]).default("manual"),
  referencia_id: z.number().int().positive().optional(),
  cantidad: z.number().int(),
  stock_anterior: z.number().int(),
  stock_nuevo: z.number().int(),
  motivo: z.string().optional(),
  fecha_movimiento: z.string().optional(),
});

export const updateInventarioSchema = z.object({
  producto_id: z.number().int().positive().optional(),
  lote_id: z.number().int().positive().optional().nullable(),
  usuario_id: z.number().int().positive().optional(),
  movimiento: z.enum(["compra", "venta", "ajuste", "vencido", "devolucion"]).optional(),
  tipo_referencia: z.enum(["compra", "venta", "manual"]).optional(),
  referencia_id: z.number().int().positive().optional(),
  cantidad: z.number().int().optional(),
  stock_anterior: z.number().int().optional(),
  stock_nuevo: z.number().int().optional(),
  motivo: z.string().optional(),
  fecha_movimiento: z.string().optional(),
});
