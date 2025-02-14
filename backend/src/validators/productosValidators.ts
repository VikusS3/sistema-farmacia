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
  categoria: z
    .string()
    .min(3)
    .max(255, "La categoría debe tener menos de 255 caracteres"),
  fecha_vencimiento: z.string().optional(),
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
  cantidad: z.number().min(0, "La cantidad no puede ser negativa"),
  stock_minimo: z.number().min(0, "El stock mínimo no puede ser negativo"),
  categoria: z
    .string()
    .min(3)
    .max(255, "La categoría debe tener menos de 255 caracteres"),
  fecha_vencimiento: z.string().optional(),
});
