import { create } from "domain";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

export type Producto = {
  id?: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  cantidad: number;
  stock_minimo: number;
  categoria?: string;
  fecha_vencimiento?: string;
  creado_en?: Date;
  actualizado_en?: Date;
};

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
      cantidad,
      stock_minimo,
      categoria,
      fecha_vencimiento,
    } = producto;
    const [result] = await pool.query<any>(
      "INSERT INTO productos (nombre, descripcion, precio_compra, precio_venta, cantidad, stock_minimo, categoria, fecha_vencimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        descripcion,
        precio_compra,
        precio_venta,
        cantidad,
        stock_minimo,
        categoria,
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

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      "DELETE FROM productos WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};
