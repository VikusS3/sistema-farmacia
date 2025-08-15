import { z } from "zod";

export const aperturaCajaSchema = z.object({
  usuario_id: z.number({
    required_error: "El ID de usuario es requerido",
    invalid_type_error: "El ID de usuario debe ser un número entero positivo",
  }),
  monto_apertura: z
    .number({
      required_error: "El monto de apertura es requerido",
      invalid_type_error: "El monto debe ser un número",
    })
    .nonnegative("El monto no puede ser negativo")
    .refine(
      (val) => val.toString().match(/^\d+(\.\d{1,2})?$/),
      "El monto debe tener máximo 2 decimales"
    ),
});

export const cierreCajaSchema = z.object({
  caja_id: z.number({
    required_error: "El ID de caja es requerido",
    invalid_type_error: "El ID de caja debe ser un número entero positivo",
  }),
  monto_cierre: z
    .number({
      required_error: "El monto de cierre es requerido",
      invalid_type_error: "El monto debe ser un número",
    })
    .nonnegative("El monto no puede ser negativo")
    .refine(
      (val) => val.toString().match(/^\d+(\.\d{1,2})?$/),
      "El monto debe tener máximo 2 decimales"
    ),
});

// Schema para obtener una caja abierta
export const getCajaAbiertaSchema = z.object({
  usuario_id: z.string({
    required_error: "El ID de usuario es requerido",
    invalid_type_error: "El ID de usuario debe ser un número entero positivo",
  }),
});
