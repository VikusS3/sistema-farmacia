import pool from "../config/db";
import { RowDataPacket, PoolConnection } from "mysql2";
import { Producto, Lote, AlertaStock, UnidadVenta } from "../types";

type ConnectionLike = PoolConnection | any;

export const ProductoModel = {
  async getAll(): Promise<Producto[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, 
              COALESCE(p.precio_unidad, p.precio_venta) as precio_unidad_calc,
              COALESCE(p.precio_blister, p.precio_venta * COALESCE(p.unidades_por_blister, 1)) as precio_blister_calc,
              COALESCE(p.precio_caja, p.precio_venta * COALESCE(p.unidades_por_caja, 1)) as precio_caja_calc
       FROM productos p`
    );
    return rows as Producto[];
  },

  async findById(id: number): Promise<Producto | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM productos WHERE id = ?",
      [id]
    );
    return rows.length ? (rows[0] as Producto) : null;
  },

  async getWithPrices(id: number): Promise<Producto | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, 
              COALESCE(p.precio_unidad, p.precio_venta) as precio_calculado_unidad,
              COALESCE(p.precio_blister, p.precio_venta * COALESCE(p.unidades_por_blister, 1)) as precio_calculado_blister,
              COALESCE(p.precio_caja, p.precio_venta * COALESCE(p.unidades_por_caja, 1)) as precio_calculado_caja
       FROM productos WHERE id = ?`,
      [id]
    );
    return rows.length ? (rows[0] as Producto) : null;
  },

  async getProductosWhitExpired(): Promise<Producto[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, l.fecha_vencimiento 
       FROM productos p 
       LEFT JOIN lotes l ON p.id = l.producto_id AND l.cantidad_disponible > 0
       WHERE l.fecha_vencimiento < NOW()`
    );
    return rows as Producto[];
  },

  async getLowStock(): Promise<Producto[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM productos WHERE stock <= stock_minimo ORDER BY stock ASC"
    );
    return rows as Producto[];
  },

  async getExpiringSoon(days: number = 30): Promise<Lote[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT l.*, p.nombre as producto_nombre 
       FROM lotes l 
       JOIN productos p ON l.producto_id = p.id 
       WHERE l.cantidad_disponible > 0 
       AND l.fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
       ORDER BY l.fecha_vencimiento ASC`,
      [days]
    );
    return rows as Lote[];
  },

  async create(producto: Omit<Producto, "id">): Promise<number> {
    const [result] = await pool.query(
      `INSERT INTO productos 
        (nombre, descripcion, precio_compra, precio_venta, precio_unidad, precio_blister, precio_caja, 
         unidades_por_blister, unidades_por_caja, require_lote, stock, stock_minimo, unidad_medida, categoria_id, fecha_vencimiento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        producto.nombre,
        producto.descripcion || null,
        producto.precio_compra,
        producto.precio_venta,
        producto.precio_unidad || producto.precio_venta,
        producto.precio_blister || null,
        producto.precio_caja || null,
        producto.unidades_por_blister || 1,
        producto.unidades_por_caja || 1,
        producto.require_lote || false,
        producto.stock || 0,
        producto.stock_minimo || 10,
        producto.unidad_medida || "tableta",
        (producto as any).categoria_id || null,
        producto.fecha_vencimiento || null,
      ]
    );
    return (result as any).insertId;
  },

  async update(id: number, producto: Partial<Producto>): Promise<boolean> {
    const [result] = await pool.query(
      `UPDATE productos SET ? WHERE id = ?`,
      [producto, id]
    );
    return (result as any).affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query(
      `DELETE FROM productos WHERE id = ?`,
      [id]
    );
    return (result as any).affectedRows > 0;
  },

  calculatePrice(producto: Producto, unidad: UnidadVenta): number {
    switch (unidad) {
      case "unidad":
        return producto.precio_unidad ?? producto.precio_venta;
      case "blister":
        return producto.precio_blister ?? 
               (producto.precio_venta * (producto.unidades_por_blister ?? 1));
      case "caja":
        return producto.precio_caja ?? 
               (producto.precio_venta * (producto.unidades_por_caja ?? 1));
      default:
        return producto.precio_venta;
    }
  },

  convertToBaseUnits(cantidad: number, unidad: UnidadVenta, producto: Producto): number {
    switch (unidad) {
      case "unidad":
        return cantidad;
      case "blister":
        return cantidad * (producto.unidades_por_blister ?? 1);
      case "caja":
        return cantidad * (producto.unidades_por_caja ?? 1);
      default:
        return cantidad;
    }
  },

  async checkStock(
    productoId: number, 
    cantidad: number, 
    unidad: UnidadVenta
  ): Promise<{ disponible: boolean; stockActual: number; stockNecesario: number }> {
    const producto = await this.findById(productoId);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    const stockNecesario = this.convertToBaseUnits(cantidad, unidad, producto);
    
    return {
      disponible: producto.stock >= stockNecesario,
      stockActual: producto.stock,
      stockNecesario,
    };
  },

  async updateStock(
    id: number,
    cantidad: number,
    unidad: UnidadVenta,
    operacion: "sumar" | "restar",
    conn?: ConnectionLike
  ): Promise<void> {
    const connection = conn || (await pool.getConnection());
    
    try {
      const producto = await this.findById(id);
      if (!producto) throw new Error("Producto no encontrado");

      const cantidadBase = this.convertToBaseUnits(cantidad, unidad, producto);
      const operador = operacion === "sumar" ? "+" : "-";

      await connection.query(
        `UPDATE productos SET stock = stock ${operador} ? WHERE id = ?`,
        [cantidadBase, id]
      );

      if (!conn) connection.release();
    } catch (error) {
      if (!conn) connection.release();
      throw error;
    }
  },

  async createLote(lote: Omit<Lote, "id">): Promise<number> {
    const [result] = await pool.query(
      `INSERT INTO lotes (producto_id, numero_lote, fecha_vencimiento, cantidad_inicial, cantidad_disponible, precio_unitario)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        lote.producto_id,
        lote.numero_lote,
        lote.fecha_vencimiento,
        lote.cantidad_inicial,
        lote.cantidad_disponible,
        lote.precio_unitario,
      ]
    );
    return (result as any).insertId;
  },

  async getLotes(productoId: number): Promise<Lote[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM lotes WHERE producto_id = ? AND cantidad_disponible > 0 ORDER BY fecha_vencimiento ASC`,
      [productoId]
    );
    return rows as Lote[];
  },

  async getAllLotes(): Promise<Lote[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT l.*, p.nombre as producto_nombre 
       FROM lotes l 
       JOIN productos p ON l.producto_id = p.id 
       WHERE l.cantidad_disponible > 0 
       ORDER BY l.fecha_vencimiento ASC`
    );
    return rows as Lote[];
  },

  async consumeLote(
    productoId: number,
    cantidad: number,
    conn?: ConnectionLike
  ): Promise<void> {
    const connection = conn || (await pool.getConnection());
    
    try {
      const [lotes] = await connection.query(
        `SELECT * FROM lotes 
         WHERE producto_id = ? AND cantidad_disponible > 0 
         ORDER BY fecha_vencimiento ASC`,
        [productoId]
      ) as [any[], any];

      let remaining = cantidad;
      
      for (const lote of lotes as Lote[]) {
        if (remaining <= 0) break;

        const consume = Math.min(lote.cantidad_disponible, remaining);
        
        await connection.query(
          `UPDATE lotes SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?`,
          [consume, lote.id]
        );

        remaining -= consume;
      }

      if (remaining > 0) {
        throw new Error(`Stock insuficiente en lotes. Faltan ${remaining} unidades`);
      }

      if (!conn) connection.release();
    } catch (error) {
      if (!conn) connection.release();
      throw error;
    }
  },

  async returnToLote(
    productoId: number,
    cantidad: number,
    conn?: ConnectionLike
  ): Promise<void> {
    const connection = conn || (await pool.getConnection());
    
    try {
      const [lotes] = await connection.query(
        `SELECT * FROM lotes 
         WHERE producto_id = ? AND cantidad_disponible < cantidad_inicial
         ORDER BY fecha_vencimiento DESC`,
        [productoId]
      ) as [any[], any];

      let remaining = cantidad;
      
      for (const lote of lotes as Lote[]) {
        if (remaining <= 0) break;

        const maxReturn = lote.cantidad_inicial - lote.cantidad_disponible;
        const returnAmount = Math.min(maxReturn, remaining);
        
        await connection.query(
          `UPDATE lotes SET cantidad_disponible = cantidad_disponible + ? WHERE id = ?`,
          [returnAmount, lote.id]
        );

        remaining -= returnAmount;
      }

      if (!conn) connection.release();
    } catch (error) {
      if (!conn) connection.release();
      throw error;
    }
  },
};

export const AlertaModel = {
  async getAll(leida?: boolean): Promise<AlertaStock[]> {
    let query = `SELECT a.*, p.nombre as producto_nombre FROM alertas_stock a JOIN productos p ON a.producto_id = p.id`;
    
    if (leida !== undefined) {
      query += ` WHERE a.leida = ?`;
    }
    
    query += ` ORDER BY a.created_at DESC`;
    
    const [rows] = await pool.query<RowDataPacket[]>(
      leida !== undefined ? query : query,
      leida !== undefined ? [leida ? 1 : 0] : []
    );
    return rows as AlertaStock[];
  },

  async markAsRead(id: number): Promise<void> {
    await pool.query(
      `UPDATE alertas_stock SET leida = TRUE WHERE id = ?`,
      [id]
    );
  },

  async markAllAsRead(): Promise<void> {
    await pool.query(`UPDATE alertas_stock SET leida = TRUE`);
  },

  async getUnreadCount(): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM alertas_stock WHERE leida = FALSE`
    );
    return (rows[0] as any).total || 0;
  },

  async create(producto_id: number, tipo: string, mensaje: string): Promise<number> {
    const [result] = await pool.query(
      `INSERT INTO alertas_stock (producto_id, tipo_alerta, mensaje) VALUES (?, ?, ?)`,
      [producto_id, tipo, mensaje]
    );
    return (result as any).insertId;
  },

  async delete(id: number): Promise<void> {
    await pool.query(`DELETE FROM alertas_stock WHERE id = ?`, [id]);
  },
};