import { z } from "zod";

export const detalleVentaSchema = z.object({
  producto_id: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  unidad_venta: z.enum(["caja", "blister", "unidad"]),
  precio_unitario: z.number().nonnegative(),
  subtotal: z.number().nonnegative(),
  //ganancia: z.number().nonnegative(),
});

export const ventaSchema = z.object({
  cliente_id: z.number().int().positive(),
  usuario_id: z.number().int().positive(),
  caja_id: z.number().int().nullable(),
  adicional: z.string().optional(),
  descuento: z.string().optional(),
  metodo_pago: z.enum(["efectivo", "tarjeta", "transferencia"]),
  total: z.number().nonnegative(),
  detalles: z.array(detalleVentaSchema).min(1),
});
