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
      categoria_id,
      fecha_vencimiento,
      unidad_venta,
      factor_conversion,
    } = producto;
    const [result] = await pool.query<any>(
      "INSERT INTO productos (nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, unidad_medida, categoria_id, fecha_vencimiento, unidad_venta, factor_conversion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        descripcion,
        precio_compra,
        precio_venta,
        stock,
        stock_minimo,
        unidad_medida,
        categoria_id,
        fecha_vencimiento,
        unidad_venta,
        factor_conversion,
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
    return result.affectedRows > 0;
  },

  async updateStockCompra(
    productoId: number,
    cantidad: number
  ): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT factor_conversion FROM productos WHERE id = ?",
      [productoId]
    );
    if (!rows.length) return false;

    const factorConversion = rows[0].factor_conversion || 1;

    const cantidadActualizada = cantidad * factorConversion;

    const [result] = await pool.query<RowDataPacket[]>(
      "UPDATE productos SET stock = stock + ? WHERE id = ?",
      [cantidadActualizada, productoId]
    );
    return result.length > 0; // Verifica si se realizó la actualización
  },

  async updateStockAjuste(
    productoId: number,
    diferencia: number
  ): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT factor_conversion FROM productos WHERE id = ?",
      [productoId]
    );
    if (!rows.length) return false;

    const factorConversion = rows[0].factor_conversion || 1;

    const cantidadActualizada = diferencia * factorConversion;

    const [result] = await pool.query<RowDataPacket[]>(
      "UPDATE productos SET stock = stock + ? WHERE id = ?",
      [cantidadActualizada, productoId]
    );
    return result.length > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<RowDataPacket[]>(
      "DELETE FROM productos WHERE id = ?",
      [id]
    );
    return result.length > 0;
  },

  //consulata para traer los productos con su fecha de vencimiento
  async findAllWithExpiration(): Promise<Producto[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT p.nombre,p.fecha_vencimiento FROM productos as p WHERE fecha_vencimiento IS NOT NULL"
    );
    return rows as Producto[];
  },
};
