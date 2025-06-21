import { z } from "zod";

export const createProductoSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .max(255, "El nombre debe tener menos de 255 caracteres"),
  descripcion: z
    .string()
    .min(3)
    .max(255, "La descripción debe tener menos de 255 caracteres"),
  precio_compra: z.number().min(0, "El precio de compra no puede ser negativo"),
  precio_venta: z.number().min(0, "El precio de venta no puede ser negativo"),
  stock: z.number().min(0, "La cantidad no puede ser negativa"),
  stock_minimo: z.number().min(0, "El stock mínimo no puede ser negativo"),
  unidad_medida: z.string().min(1).max(255, "La unidad de medida es requerida"),
  categoria_id: z.number().min(1, "La categoría es requerida"),
  fecha_vencimiento: z.string().optional(),
  unidad_venta: z.string().min(1).max(255, "La unidad de venta es requerida"),
  factor_conversion: z
    .number()
    .min(1, "El factor de conversión no puede ser menor a 1"),
});

export const updateProductoSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .max(255, "El nombre debe tener menos de 255 caracteres"),
  descripcion: z
    .string()
    .min(3)
    .max(255, "La descripción debe tener menos de 255 caracteres"),
  precio_compra: z.number().min(0, "El precio de compra no puede ser negativo"),
  precio_venta: z.number().min(0, "El precio de venta no puede ser negativo"),
  stock: z.number().min(0, "La cantidad no puede ser negativa"),
  stock_minimo: z.number().min(0, "El stock mínimo no puede ser negativo"),
  unidad_medida: z.string().min(1).max(255, "La unidad de medida es requerida"),
  categoria_id: z.number().min(1, "La categoría es requerida"),
  fecha_vencimiento: z.string().optional(),
  unidad_venta: z.string().min(1).max(255, "La unidad de venta es requerida"),
  factor_conversion: z
    .number()
    .min(1, "El factor de conversión no puede ser menor a 1"),
});
