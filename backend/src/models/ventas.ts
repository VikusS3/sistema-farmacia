import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Ventas } from "../types";

export const VentasModel = {
  async findAll(): Promise<Ventas[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM ventas");
    return rows as Ventas[];
  },

  async findById(id: number): Promise<Ventas | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM ventas WHERE id = ?",
      [id]
    );
    return rows[0] as Ventas | null;
  },

  //funcion para obtener los datos de una venta junto con los productos que se vendieron
  async findVenta(id: number): Promise<any> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT dv.*, p.nombre AS producto_nombre
       FROM detalle_ventas dv
       INNER JOIN productos p ON dv.producto_id = p.id
       WHERE dv.venta_id = ?`,
      [id]
    );
    return rows;
  },

  async create(ventas: Ventas): Promise<number> {
    const {
      cliente_id,
      usuario_id,
      fecha,
      total,
      descuento,
      adicional,
      metodo_pago,
    } = ventas;
    const [result] = await pool.query<any>(
      "INSERT INTO ventas (cliente_id, usuario_id, fecha, total, descuento, adicional, metodo_pago) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [cliente_id, usuario_id, fecha, total, descuento, adicional, metodo_pago]
    );

    return result.insertId;
  },

  async update(id: number, ventas: Partial<Ventas>): Promise<boolean> {
    const [result] = await pool.query<any>("UPDATE ventas SET ? WHERE id = ?", [
      ventas,
      id,
    ]);
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>("DELETE FROM ventas WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },
};
