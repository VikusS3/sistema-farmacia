import { z } from "zod";

export const detalleCompraSchema = z.object({
  producto_id: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  precio_unitario: z.number().nonnegative(),
  subtotal: z.number().nonnegative(),
});

export const compraSchema = z.object({
  proveedor_id: z.number().int().positive(),
  usuario_id: z.number().int().positive(),
  total: z.number().nonnegative(),
  detalles: z.array(detalleCompraSchema).min(1),
});
