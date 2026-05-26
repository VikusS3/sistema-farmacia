import { z } from "zod";

export const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  precio_unidad: z.number().nonnegative("Precio unitario debe ser positivo").default(0),
  precio_blister: z.number().nonnegative().optional(),
  precio_caja: z.number().nonnegative().optional(),
  unidades_por_blister: z.number().int().positive().min(1).default(1),
  blisters_por_caja: z.number().int().positive().min(1).default(1),
  stock: z.number().int().nonnegative().default(0),
  stock_minimo: z.number().int().nonnegative().default(10),
  require_lote: z.boolean().default(false),
  categoria_id: z.number().int().positive().optional(),
  unidad_medida: z.string().default("unidad"),
});

export const productoUpdateSchema = productoSchema.partial();

export const loteSchema = z.object({
  producto_id: z.number().int().positive("ID de producto inválido"),
  compra_id: z.number().int().positive().optional(),
  numero_lote: z.string().min(1, "Número de lote requerido"),
  fecha_vencimiento: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date > new Date();
  }, { message: "La fecha de vencimiento debe ser futura" }),
  cantidad_inicial: z.number().int().positive("Cantidad inicial debe ser mayor a 0"),
  cantidad_disponible: z.number().int().positive("Cantidad disponible debe ser mayor a 0").optional(),
  costo_unitario: z.number().nonnegative("Costo unitario debe ser positivo"),
});

export const parseProducto = (data: unknown) => productoSchema.safeParse(data);
export const parseProductoPartial = (data: unknown) => productoUpdateSchema.safeParse(data);
export const parseLote = (data: unknown) => loteSchema.safeParse(data);
