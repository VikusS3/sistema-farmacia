import { z } from "zod";

export const detalleVentaSchema = z.object({
  producto_id: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  unidad_venta: z.enum(["caja", "blister", "unidad", "pastilla"]),
  precio_unitario: z.number().nonnegative(),
  subtotal: z.number().nonnegative(),
});

export const ventaSchema = z.object({
  cliente_id: z.number().int().positive(),
  usuario_id: z.number().int().positive(),
  caja_id: z.number().int().nullable(),
  adicional: z.number().nonnegative().optional().default(0),
  descuento: z.number().nonnegative().optional().default(0),
  metodo_pago: z.enum(["efectivo", "tarjeta", "yape/plin"]),
  fecha: z.string().optional(),
  total: z.number().nonnegative(),
  detalle_venta: z.array(detalleVentaSchema).min(1),
});
