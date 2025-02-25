import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Compras } from "../types";

export const ComprasModel = {
  async findAll(): Promise<Compras[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM compras");
    return rows as Compras[];
  },

  async findById(id: number): Promise<Compras | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM compras WHERE id = ?",
      [id]
    );
    return rows[0] as Compras | null;
  },

  async findProductosCompra(
    id: number
  ): Promise<{ compra: Compras | null; productos: any[] }> {
    const [compraRows] = await pool.query<RowDataPacket[]>(
      `SELECT compras.*, proveedores.nombre AS proveedor_nombre 
       FROM compras 
       JOIN proveedores ON compras.proveedor_id = proveedores.id 
       WHERE compras.id = ?`,
      [id]
    );
    const compra = compraRows[0] as Compras | null;

    const [productosRows] = await pool.query<RowDataPacket[]>(
      `SELECT detalle_compras.*, productos.nombre AS producto_nombre 
       FROM detalle_compras 
       JOIN productos ON detalle_compras.producto_id = productos.id 
       WHERE detalle_compras.compra_id = ?`,
      [id]
    );
    const productos = productosRows;

    return { compra, productos };
  },

  async create(compra: Compras): Promise<number> {
    const { proveedor_id, usuario_id, fecha, total } = compra;
    const [result] = await pool.query<any>(
      "INSERT INTO compras (proveedor_id, usuario_id, fecha, total) VALUES (?, ?, ?, ?)",
      [proveedor_id, usuario_id, fecha, total]
    );
    return result.insertId;
  },

  async update(
    id: number,
    compra: Partial<Compras & { detalle_compra: any[] }>
  ): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { detalle_compra, ...compraData } = compra;

      // 1️⃣ Actualizar compra (si hay datos para actualizar)
      if (Object.keys(compraData).length) {
        await connection.query("UPDATE compras SET ? WHERE id = ?", [
          compraData,
          id,
        ]);
      }

      // 2️⃣ Obtener cantidades originales antes de actualizar
      const cantidadesOriginales = await this.getCantidadesOriginales(
        connection,
        id
      );

      // 3️⃣ Procesar actualización de productos
      if (detalle_compra) {
        await this.actualizarDetalleCompra(
          connection,
          id,
          detalle_compra,
          cantidadesOriginales
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error("Error al actualizar la compra:", error);
      return false;
    } finally {
      connection.release();
    }
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>("DELETE FROM compras WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },

  /** 🔹 Obtener cantidades originales antes de actualizar */
  async getCantidadesOriginales(
    connection: any,
    compraId: number
  ): Promise<Map<number, number>> {
    const [originalDetalles] = await connection.query(
      "SELECT producto_id, cantidad FROM detalle_compras WHERE compra_id = ?",
      [compraId]
    );
    return new Map(
      originalDetalles.map((item: any) => [item.producto_id, item.cantidad])
    );
  },

  /** 🔹 Actualizar detalle de compra y stock de productos */
  async actualizarDetalleCompra(
    connection: any,
    compraId: number,
    detalle_compra: any[],
    cantidadesOriginales: Map<number, number>
  ) {
    const updatePromises = detalle_compra.map(async (item) => {
      const cantidadAnterior = cantidadesOriginales.get(item.producto_id) || 0;
      const diferencia = item.cantidad - cantidadAnterior;

      // Ajustar stock si hubo cambio
      if (diferencia !== 0) {
        await connection.query(
          "UPDATE productos SET stock = stock + ? WHERE id = ?",
          [diferencia, item.producto_id]
        );
      }

      // Actualizar si ya existe, insertar si es nuevo
      if (item.id) {
        return connection.query(
          "UPDATE detalle_compras SET cantidad = ?, precio_unitario = ?, subtotal = ? WHERE id = ? AND compra_id = ?",
          [
            item.cantidad,
            item.precio_unitario,
            item.subtotal,
            item.id,
            compraId,
          ]
        );
      } else {
        return connection.query(
          "INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
          [
            compraId,
            item.producto_id,
            item.cantidad,
            item.precio_unitario,
            item.subtotal,
          ]
        );
      }
    });

    await Promise.all(updatePromises);
  },
};
