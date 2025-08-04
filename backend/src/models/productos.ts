import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Producto } from "../types";

export const ProductoModel = {
  async getAll(): Promise<Producto[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM productos");
    return rows as Producto[];
  },

  async findById(id: number): Promise<Producto | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM productos WHERE id = ?",
      [id]
    );
    return rows.length ? (rows[0] as Producto) : null;
  },

  async create(producto: Omit<Producto, "id">): Promise<number> {
    const [result] = await pool.query(
      `INSERT INTO productos 
        (nombre, descripcion, unidad_venta, unidad_medida, factor_conversion, factor_caja, stock, precio_compra, precio_venta, fecha_vencimiento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        producto.nombre,
        producto.descripcion,
        producto.unidad_venta,
        producto.unidad_medida,
        producto.factor_conversion,
        producto.factor_caja,
        producto.stock,
        producto.precio_compra,
        producto.precio_venta,
        producto.fecha_vencimiento,
      ]
    );
    return (result as any).insertId;
  },

  async update(id: number, producto: Partial<Producto>): Promise<boolean> {
    const [result] = await pool.query(`UPDATE productos SET ? WHERE id = ?`, [
      producto,
      id,
    ]);
    return (result as any).affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query(`DELETE FROM productos WHERE id = ?`, [
      id,
    ]);
    return (result as any).affectedRows > 0;
  },

  // Método auxiliar para actualizar stock tras compra o venta
  async updateStockCompra(
    id: number,
    cantidadEnUnidadVenta: number,
    conn?: any
  ): Promise<void> {
    const connection = conn || (await pool.getConnection());
    const producto = await this.findById(id);
    if (!producto) throw new Error("Producto no encontrado");

    const cantidadMinima = cantidadEnUnidadVenta * producto.factor_conversion;
    await connection.query(
      `UPDATE productos SET stock = stock + ? WHERE id = ?`,
      [cantidadMinima, id]
    );

    if (!conn) connection.release();
  },

  async updateStockVenta(producto_id: number, cantidad: number, conn?: any) {
    const connection = conn || (await pool.getConnection());
    try {
      const query = `UPDATE productos SET stock = stock - ? WHERE id = ?`;
      await connection.query(query, [cantidad, producto_id]);
    } finally {
      if (!conn) connection.release();
    }
  },
};
