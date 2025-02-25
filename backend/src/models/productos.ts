import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Producto } from "../types";

export const ProductoModel = {
  async findAll(): Promise<Producto[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM productos");
    return rows as Producto[];
  },

  async findById(id: number): Promise<Producto | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM productos WHERE id = ?",
      [id]
    );
    return rows[0] as Producto | null;
  },

  async create(producto: Producto): Promise<number> {
    const {
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock,
      stock_minimo,
      unidad_medida,
      conversion,
      categoria_id,
      fecha_vencimiento,
    } = producto;
    const [result] = await pool.query<any>(
      "INSERT INTO productos (nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, unidad_medida, conversion, categoria_id, fecha_vencimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        descripcion,
        precio_compra,
        precio_venta,
        stock,
        stock_minimo,
        unidad_medida,
        conversion,
        categoria_id,
        fecha_vencimiento,
      ]
    );
    return result.insertId;
  },

  async update(id: number, producto: Partial<Producto>): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE productos SET ? WHERE id = ?",
      [producto, id]
    );
    return result.affectedRows > 0;
  },

  async updateStockVenta(
    productoId: number,
    cantidad: number
  ): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?",
      [cantidad, productoId, cantidad]
    );
    return result.affectedRows > 0; // Verifica si se realizó la actualización
  },

  async updateStockCompra(
    productoId: number,
    cantidad: number
  ): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE productos SET stock = stock + ? WHERE id = ?",
      [cantidad, productoId]
    );
    return result.affectedRows > 0; // Verifica si se realizó la actualización
  },

  async updateStockAjuste(
    productoId: number,
    diferencia: number
  ): Promise<boolean> {
    const [result] = await pool.query<any>(
      "UPDATE productos SET stock = stock + ? WHERE id = ?",
      [diferencia, productoId]
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM productos WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
