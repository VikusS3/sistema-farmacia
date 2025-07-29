import { z } from "zod";

export const productoSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  unidad_venta: z.string().min(1),
  unidad_medida: z.string().min(1),
  factor_conversion: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
  precio_compra: z.number().nonnegative(),
  precio_venta: z.number().nonnegative(),
});
