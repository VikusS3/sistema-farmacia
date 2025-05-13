//import { Productos } from "../types";
export const fieldTypes: {
  [K in "nombre" | "precio_venta" | "stock" | "descripcion"]: "text" | "number";
} = {
  nombre: "text",
  descripcion: "text",
  precio_venta: "number",
  stock: "number",
};
