import pool from "../config/db";
import { DetalleCompra } from "../types";

export const DetalleCompraModel = {
  async create(detalleCompra: Omit<DetalleCompra, "id">): Promise<number> {
    const {
      compra_id,
      producto_id,
      cantidad,
      unidad_compra,
      precio_unitario,
      subtotal,
    } = detalleCompra;
    const [result] = await pool.query<any>(
      "INSERT INTO detalle_compras (compra_id, producto_id, cantidad, unidad_compra, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
      [
        compra_id,
        producto_id,
        cantidad,
        unidad_compra,
        precio_unitario,
        subtotal,
      ]
    );
    return result.insertId;
  },

  async update(
    id: number,
    detalleCompra: Partial<DetalleCompra>
  ): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE detalle_compras SET ? WHERE id = ?",
      [detalleCompra, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM detalle_compras WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
