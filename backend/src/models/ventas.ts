import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Ventas } from "../types";

export const VentasModel = {
  async findAll(): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT v.*, c.nombre AS cliente_nombre
       FROM ventas v
       INNER JOIN clientes c ON v.cliente_id = c.id`
    );
    return rows;
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
    const [ventaRows] = await pool.query<RowDataPacket[]>(
      `SELECT v.*, c.nombre AS cliente_nombre
       FROM ventas v
       INNER JOIN clientes c ON v.cliente_id = c.id
       WHERE v.id = ?`,
      [id]
    );

    if (ventaRows.length === 0) {
      return null;
    }

    const [productoRows] = await pool.query<RowDataPacket[]>(
      `SELECT dv.*, p.nombre AS producto_nombre
       FROM detalle_ventas dv
       INNER JOIN productos p ON dv.producto_id = p.id
       WHERE dv.venta_id = ?`,
      [id]
    );

    return {
      venta: ventaRows[0],
      productos: productoRows,
    };
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

  async update(
    id: number,
    ventas: Partial<Ventas & { detalle_venta: any[] }>
  ): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { detalle_venta, ...ventasData } = ventas;

      const [result]: any = await connection.query(
        "UPDATE ventas SET ? WHERE id = ?",
        [ventasData, id]
      );

      if (detalle_venta) {
        for (const detalle of detalle_venta) {
          if (detalle.id) {
            await connection.query("UPDATE detalle_ventas SET ? WHERE id = ?", [
              detalle,
              detalle.id,
            ]);
          } else {
            await connection.query("INSERT INTO detalle_ventas SET ?", {
              ...detalle,
              venta_id: id,
            });
          }
        }
      }

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>("DELETE FROM ventas WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },
};
