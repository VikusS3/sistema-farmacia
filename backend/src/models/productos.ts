import pool from "../config/db";
import { RowDataPacket, PoolConnection } from "mysql2";
import { Producto, Lote, AlertaStock, UnidadVenta } from "../types";

type ConnectionLike = PoolConnection | any;

const UPDATEABLE_FIELDS = [
  "nombre", "descripcion",
  "precio_unidad", "precio_blister", "precio_caja",
  "unidades_por_blister", "blisters_por_caja",
  "require_lote", "stock", "stock_minimo",
  "unidad_medida", "categoria_id",
];

export const ProductoModel = {
  async getAll(categoria_id?: number): Promise<Producto[]> {
    let query = `
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
    `;
    const params: any[] = [];

    if (categoria_id) {
      query += ` WHERE p.categoria_id = ?`;
      params.push(categoria_id);
    }

    query += ` ORDER BY p.nombre ASC`;

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Producto[];
  },

  async findById(id: number): Promise<Producto | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.nombre as categoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows.length ? (rows[0] as Producto) : null;
  },

  async getProductosVencidos(): Promise<Producto[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT DISTINCT p.*, c.nombre as categoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       INNER JOIN lotes l ON p.id = l.producto_id
       WHERE l.cantidad_disponible > 0
       AND l.fecha_vencimiento < CURDATE()`
    );
    return rows as Producto[];
  },

  async getLowStock(): Promise<Producto[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.nombre as categoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.stock <= p.stock_minimo
       ORDER BY p.stock ASC`
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
        (nombre, descripcion, categoria_id, stock, stock_minimo, unidad_medida,
         unidades_por_blister, blisters_por_caja,
         precio_unidad, precio_blister, precio_caja, require_lote)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        producto.nombre,
        producto.descripcion || null,
        producto.categoria_id || null,
        producto.stock || 0,
        producto.stock_minimo || 10,
        producto.unidad_medida || "unidad",
        producto.unidades_por_blister || 1,
        producto.blisters_por_caja || 1,
        producto.precio_unidad ?? 0,
        producto.precio_blister ?? 0,
        producto.precio_caja ?? 0,
        producto.require_lote ?? false,
      ]
    );
    return (result as any).insertId;
  },

  async update(id: number, producto: Partial<Producto>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    for (const field of UPDATEABLE_FIELDS) {
      if ((producto as any)[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push((producto as any)[field]);
      }
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE productos SET ${fields.join(", ")} WHERE id = ?`,
      values
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
        return producto.precio_unidad ?? 0;
      case "blister":
        return producto.precio_blister ?? ((producto.precio_unidad ?? 0) * (producto.unidades_por_blister ?? 1));
      case "caja":
        return producto.precio_caja ?? ((producto.precio_unidad ?? 0) * (producto.unidades_por_blister ?? 1) * (producto.blisters_por_caja ?? 1));
      default:
        return producto.precio_unidad ?? 0;
    }
  },

  convertToBaseUnits(cantidad: number, unidad: UnidadVenta, producto: Producto): number {
    switch (unidad) {
      case "unidad":
        return cantidad;
      case "blister":
        return cantidad * (producto.unidades_por_blister ?? 1);
      case "caja":
        return cantidad * (producto.unidades_por_blister ?? 1) * (producto.blisters_por_caja ?? 1);
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
      const [rows] = (await connection.query(
        `SELECT * FROM productos WHERE id = ?`,
        [id]
      )) as [RowDataPacket[], any];
      const producto = rows[0] as Producto;
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

  async createLote(lote: Omit<Lote, "id" | "estado"> & { cantidad_disponible?: number }): Promise<number> {
    const [result] = await pool.query(
      `INSERT INTO lotes (producto_id, compra_id, numero_lote, fecha_vencimiento, cantidad_inicial, cantidad_disponible, costo_unitario, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'activo')`,
      [
        lote.producto_id,
        lote.compra_id || null,
        lote.numero_lote,
        lote.fecha_vencimiento,
        lote.cantidad_inicial,
        lote.cantidad_disponible ?? lote.cantidad_inicial,
        lote.costo_unitario,
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
      const [lotes] = (await connection.query(
        `SELECT * FROM lotes
         WHERE producto_id = ? AND cantidad_disponible > 0
         ORDER BY fecha_vencimiento ASC`,
        [productoId]
      )) as [RowDataPacket[], any];

      let remaining = cantidad;

      for (const lote of lotes as Lote[]) {
        if (remaining <= 0) break;

        const consume = Math.min(lote.cantidad_disponible, remaining);

        await connection.query(
          `UPDATE lotes SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?`,
          [consume, lote.id]
        );

        await connection.query(
          `INSERT INTO movimiento_lotes (lote_id, tipo, cantidad, motivo) VALUES (?, 'salida', ?, ?)`,
          [lote.id, consume, `Consumido por venta`]
        );

        await updateLoteEstado(lote.id!, connection);

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
      const [lotes] = (await connection.query(
        `SELECT * FROM lotes
         WHERE producto_id = ? AND cantidad_disponible < cantidad_inicial
         ORDER BY fecha_vencimiento DESC`,
        [productoId]
      )) as [RowDataPacket[], any];

      let remaining = cantidad;

      for (const lote of lotes as Lote[]) {
        if (remaining <= 0) break;

        const maxReturn = lote.cantidad_inicial - lote.cantidad_disponible;
        const returnAmount = Math.min(maxReturn, remaining);

        await connection.query(
          `UPDATE lotes SET cantidad_disponible = cantidad_disponible + ? WHERE id = ?`,
          [returnAmount, lote.id]
        );

        await connection.query(
          `INSERT INTO movimiento_lotes (lote_id, tipo, cantidad, motivo) VALUES (?, 'entrada', ?, ?)`,
          [lote.id, returnAmount, `Devolución por cancelación de venta`]
        );

        await updateLoteEstado(lote.id!, connection);

        remaining -= returnAmount;
      }

      if (!conn) connection.release();
    } catch (error) {
      if (!conn) connection.release();
      throw error;
    }
  },

  async getCostoUnitarioLote(productoId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT costo_unitario FROM lotes
       WHERE producto_id = ? AND cantidad_disponible > 0
       ORDER BY fecha_vencimiento ASC
       LIMIT 1`,
      [productoId]
    );
    return rows.length > 0 ? Number(rows[0].costo_unitario) : 0;
  },
};

async function updateLoteEstado(loteId: number, conn?: any): Promise<void> {
  const connection = conn || (await pool.getConnection());
  try {
    const [rows] = await connection.query(
      `SELECT cantidad_disponible, fecha_vencimiento FROM lotes WHERE id = ?`,
      [loteId]
    );

    if (!rows || rows.length === 0) return;

    const lote = rows[0] as any;

    if (lote.cantidad_disponible <= 0) {
      await connection.query(
        `UPDATE lotes SET estado = 'agotado' WHERE id = ?`,
        [loteId]
      );
    } else if (lote.fecha_vencimiento < new Date().toISOString().split("T")[0]) {
      await connection.query(
        `UPDATE lotes SET estado = 'vencido' WHERE id = ?`,
        [loteId]
      );
    }

    if (!conn) connection.release();
  } catch (error) {
    if (!conn) connection.release();
    throw error;
  }
}

export const AlertaModel = {
  async getAll(leida?: boolean): Promise<AlertaStock[]> {
    let query = `SELECT a.*, p.nombre as producto_nombre FROM alertas_stock a JOIN productos p ON a.producto_id = p.id`;

    if (leida !== undefined) {
      query += ` WHERE a.leida = ?`;
    }

    query += ` ORDER BY a.created_at DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(
      query,
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
