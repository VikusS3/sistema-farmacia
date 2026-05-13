import pool from "../config/db";
import { RowDataPacket, PoolConnection } from "mysql2";
import { Inventario } from "../types";

type ConnectionLike = PoolConnection | any;

export const InventarioModel = {
  async findAll(): Promise<Inventario[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT i.*, p.nombre as producto_nombre
       FROM inventario i
       JOIN productos p ON i.producto_id = p.id
       ORDER BY i.fecha_movimiento DESC, i.id DESC`
    );
    return rows as Inventario[];
  },

  async findById(id: number): Promise<Inventario | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT i.*, p.nombre as producto_nombre
       FROM inventario i
       JOIN productos p ON i.producto_id = p.id
       WHERE i.id = ?`,
      [id]
    );
    return rows[0] ? (rows[0] as Inventario) : null;
  },

  async findByProducto(producto_id: number): Promise<Inventario[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT i.*, p.nombre as producto_nombre
       FROM inventario i
       JOIN productos p ON i.producto_id = p.id
       WHERE i.producto_id = ?
       ORDER BY i.fecha_movimiento DESC`,
      [producto_id]
    );
    return rows as Inventario[];
  },

  async findByDateRange(fechaInicio: string, fechaFin: string): Promise<Inventario[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT i.*, p.nombre as producto_nombre
       FROM inventario i
       JOIN productos p ON i.producto_id = p.id
       WHERE DATE(i.fecha_movimiento) BETWEEN ? AND ?
       ORDER BY i.fecha_movimiento DESC`,
      [fechaInicio, fechaFin]
    );
    return rows as Inventario[];
  },

  async registrarMovimiento(
    inventario: Omit<Inventario, "id" | "creado_en" | "actualizado_en">, 
    conn?: ConnectionLike
  ): Promise<number> {
    const connection = conn || (await pool.getConnection());
    
    try {
      const { producto_id, lote_id, movimiento, cantidad, unidades_base, motivo, fecha_movimiento } =
        inventario;

      const [productoRows] = await connection.query(
        "SELECT stock FROM productos WHERE id = ?",
        [producto_id]
      ) as [any[], any];
      
      if (productoRows.length === 0) {
        throw new Error("Producto no encontrado");
      }

      const stockActual = productoRows[0].stock;
      const cantidadBase = unidades_base || cantidad;
      
      if (movimiento === "venta" && stockActual < cantidadBase) {
        throw new Error(`Stock insuficiente. Stock actual: ${stockActual}, requerido: ${cantidadBase}`);
      }

      const [result] = await connection.query(
        `INSERT INTO inventario 
          (producto_id, lote_id, movimiento, cantidad, unidades_base, motivo, fecha_movimiento) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [producto_id, lote_id || null, movimiento, cantidad, cantidadBase, motivo, fecha_movimiento]
      );

      if (movimiento === "compra") {
        await connection.query(
          "UPDATE productos SET stock = stock + ? WHERE id = ?",
          [cantidadBase, producto_id]
        );
      } else if (movimiento === "venta") {
        await connection.query(
          "UPDATE productos SET stock = stock - ? WHERE id = ?",
          [cantidadBase, producto_id]
        );
      } else if (movimiento === "ajuste") {
        await connection.query(
          "UPDATE productos SET stock = ? WHERE id = ?",
          [cantidadBase, producto_id]
        );
      }

      if (!conn) connection.release();
      return (result as any).insertId;
    } catch (error) {
      if (!conn) connection.release();
      throw error;
    }
  },

  async verificarStock(producto_id: number, cantidad: number): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT stock FROM productos WHERE id = ?",
      [producto_id]
    );

    if (rows.length === 0) {
      throw new Error("Producto no encontrado");
    }

    return rows[0].stock >= cantidad;
  },

  async getMovimientosResumen(
    fechaInicio: string, 
    fechaFin: string
  ): Promise<{
    total_compras: number;
    total_ventas: number;
    total_ajustes: number;
    productos_entrada: number;
    productos_salida: number;
  }> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
         COALESCE(SUM(CASE WHEN movimiento = 'compra' THEN cantidad ELSE 0 END), 0) as total_compras,
         COALESCE(SUM(CASE WHEN movimiento = 'venta' THEN cantidad ELSE 0 END), 0) as total_ventas,
         COALESCE(SUM(CASE WHEN movimiento = 'ajuste' THEN cantidad ELSE 0 END), 0) as total_ajustes,
         COALESCE(SUM(CASE WHEN movimiento IN ('compra', 'ajuste') THEN cantidad ELSE 0 END), 0) as productos_entrada,
         COALESCE(SUM(CASE WHEN movimiento = 'venta' THEN cantidad ELSE 0 END), 0) as productos_salida
       FROM inventario
       WHERE DATE(fecha_movimiento) BETWEEN ? AND ?`,
      [fechaInicio, fechaFin]
    );

    return rows[0] as any;
  },
};