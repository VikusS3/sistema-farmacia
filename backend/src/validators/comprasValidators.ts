import { z } from "zod";

export const detalleCompraSchema = z.object({
  producto_id: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  tipo_compra: z.enum(["unidad", "blister", "caja"]),
  subtotal: z.number().nonnegative(),
  numero_lote: z.string().optional(),
  fecha_vencimiento: z.string().optional(),
});

export const compraSchema = z.object({
  proveedor_id: z.number().int().positive(),
  usuario_id: z.number().int().positive(),
  caja_id: z.number().int().positive().optional(),
  subtotal: z.number().nonnegative().default(0),
  descuento: z.number().nonnegative().optional().default(0),
  total: z.number().nonnegative(),
  observaciones: z.string().optional(),
  detalles: z.array(detalleCompraSchema).min(1),
});
