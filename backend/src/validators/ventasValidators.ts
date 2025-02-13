import { z } from "zod";

export const createVentaSchema = z.object({
  cliente_id: z.number().int(),
  usuario_id: z.number().int(),
  fecha: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Fecha inválida",
  }),
  total: z.number().positive(),
  descuento: z.number().nonnegative(),
  adicional: z.number().nonnegative(),
  metodo_pago: z.enum(["efectivo", "tarjeta", "transferencia"]),
  detalles: z
    .array(
      z.object({
        producto_id: z.number().int(),
        cantidad: z.number().positive(),
        precio_unitario: z.number().positive(),
        descuento: z.number().nonnegative(),
        adicional: z.number().nonnegative(),
        subtotal: z.number().positive(),
      })
    )
    .optional(),
});

export const updateVentaSchema = z.object({
  cliente_id: z.number().int().optional(),
  usuario_id: z.number().int().optional(),
  fecha: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Fecha inválida",
    })
    .optional(),
  total: z.number().positive().optional(),
  descuento: z.number().nonnegative().optional(),
  adicional: z.number().nonnegative().optional(),
  metodo_pago: z.enum(["efectivo", "tarjeta", "transferencia"]).optional(),
});
