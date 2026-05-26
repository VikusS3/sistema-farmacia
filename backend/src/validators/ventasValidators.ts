import { z } from "zod";

export const detalleVentaSchema = z.object({
  producto_id: z.number().int().positive("ID de producto inválido"),
  cantidad: z.number().int().positive("La cantidad debe ser mayor a 0"),
  unidad_venta: z.enum(["unidad", "blister", "caja"], {
    errorMap: () => ({ message: "Unidad de venta inválida. Debe ser: unidad, blister o caja" }),
  }),
});

export const ventaSchema = z.object({
  cliente_id: z.number().int().positive("ID de cliente inválido"),
  usuario_id: z.number().int().positive("ID de usuario inválido"),
  caja_id: z.number().int().positive("ID de caja inválido"),
  adicional: z.number().nonnegative().optional().default(0),
  descuento: z.number().nonnegative().optional().default(0),
  metodo_pago: z.enum(["efectivo", "tarjeta", "transferencia"], {
    errorMap: () => ({ message: "Método de pago inválido" }),
  }),
  detalle_venta: z.array(detalleVentaSchema).min(1, "Debe incluir al menos un producto"),
});

export const ventaUpdateSchema = z.object({
  estado: z.enum(["completada", "cancelada"]).optional(),
  descuento: z.number().nonnegative().optional(),
  adicional: z.number().nonnegative().optional(),
  metodo_pago: z.enum(["efectivo", "tarjeta", "transferencia"]).optional(),
});

export const ventaCancelSchema = z.object({
  motivo: z.string().min(10, "Debe proporcionar un motivo de cancelación"),
  usuario_id: z.number().int().positive(),
});

export const parseVenta = (data: unknown) => ventaSchema.safeParse(data);
