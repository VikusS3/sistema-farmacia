import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Inventario } from "../types";

export const InventarioModel = {
  // Obtener todos los movimientos de inventario
  async findAll(): Promise<Inventario[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM inventario"
    );
    return rows as Inventario[];
  },

  // Obtener un movimiento de inventario por ID
  async findById(id: number): Promise<Inventario | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM inventario WHERE id = ?",
      [id]
    );
    return rows[0] ? (rows[0] as Inventario) : null;
  },

  // Registrar un movimiento de inventario
  async registrarMovimiento(inventario: Inventario): Promise<number> {
    const { producto_id, movimiento, cantidad, motivo, fecha_movimiento } =
      inventario;

    // Validar que el producto existe
    const [productoRows] = await pool.query<RowDataPacket[]>(
      "SELECT stock FROM productos WHERE id = ?",
      [producto_id]
    );
    if (productoRows.length === 0) {
      throw new Error("Producto no encontrado");
    }

    // Verificar el stock antes de registrar el movimiento
    const stockActual = productoRows[0].stock;
    if (movimiento === "venta" && stockActual < cantidad) {
      throw new Error("Stock insuficiente para realizar la venta");
    }

    // Insertar el movimiento en la tabla de inventario
    const [result] = await pool.query<any>(
      "INSERT INTO inventario (producto_id, movimiento, cantidad, motivo, fecha_movimiento) VALUES (?, ?, ?, ?, ?)",
      [producto_id, movimiento, cantidad, motivo, fecha_movimiento]
    );

    // Actualizar el stock del producto
    if (movimiento === "compra") {
      await pool.query<any>(
        "UPDATE productos SET stock = stock + ? WHERE id = ?",
        [cantidad, producto_id]
      );
    } else if (movimiento === "venta") {
      await pool.query<any>(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [cantidad, producto_id]
      );
    } else if (movimiento === "ajuste") {
      await pool.query<any>("UPDATE productos SET stock = ? WHERE id = ?", [
        cantidad,
        producto_id,
      ]);
    }

    return result.insertId;
  },

  // Verificar si hay stock suficiente para un producto
  async verificarStock(
    producto_id: number,
    cantidad: number
  ): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT stock FROM productos WHERE id = ?",
      [producto_id]
    );

    if (rows.length === 0) {
      throw new Error("Producto no encontrado");
    }

    return rows[0].stock >= cantidad;
  },
};
