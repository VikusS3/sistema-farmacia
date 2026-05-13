import { z } from "zod";

export const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  
  // Base pricing
  precio_compra: z.number().nonnegative("Precio de compra debe ser positivo"),
  precio_venta: z.number().nonnegative("Precio de venta debe ser positivo"),
  
  // Multi-unit pricing
  precio_unidad: z.number().nonnegative().optional(),
  precio_blister: z.number().nonnegative().optional(),
  precio_caja: z.number().nonnegative().optional(),
  
  // Conversion factors
  unidades_por_blister: z.number().int().positive().min(1).default(1),
  unidades_por_caja: z.number().int().positive().min(1).default(1),
  
  // Stock settings
  stock: z.number().int().nonnegative().default(0),
  stock_minimo: z.number().int().nonnegative().default(10),
  
  // Other fields
  require_lote: z.boolean().default(false),
  categoria_id: z.number().int().positive().optional(),
  fecha_vencimiento: z.string().optional(),
});

export const productoUpdateSchema = productoSchema.partial();

export const loteSchema = z.object({
  producto_id: z.number().int().positive("ID de producto inválido"),
  numero_lote: z.string().min(1, "Número de lote requerido"),
  fecha_vencimiento: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date > new Date();
  }, { message: "La fecha de vencimiento debe ser futura" }),
  cantidad_inicial: z.number().int().positive("Cantidad inicial debe ser mayor a 0"),
  cantidad_disponible: z.number().int().positive("Cantidad disponible debe ser mayor a 0"),
  precio_unitario: z.number().nonnegative("Precio debe ser positivo"),
});

export const parseProducto = (data: unknown) => productoSchema.safeParse(data);
export const parseProductoPartial = (data: unknown) => productoUpdateSchema.safeParse(data);
export const parseLote = (data: unknown) => loteSchema.safeParse(data);