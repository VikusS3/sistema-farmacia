import pool from "../config/db";
import { DetalleVenta } from "../types";

export const DetalleVentaModel = {
  async create(detalleVenta: Omit<DetalleVenta, "id">): Promise<number> {
    const {
      venta_id,
      producto_id,
      cantidad,
      precio_unitario,
      descuento,
      adicional,
      subtotal,
    } = detalleVenta;
    const [result] = await pool.query<any>(
      "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, descuento, adicional, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        venta_id,
        producto_id,
        cantidad,
        precio_unitario,
        descuento,
        adicional,
        subtotal,
      ]
    );
    return result.insertId;
  },

  async update(
    id: number,
    detalleVenta: Partial<DetalleVenta>
  ): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE detalle_ventas SET ? WHERE id = ?",
      [detalleVenta, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM detalle_ventas WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
