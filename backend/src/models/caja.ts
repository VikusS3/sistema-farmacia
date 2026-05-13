import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { Caja } from "../types";

export const CajaModel = {
  async abrirCaja(usuario_id: number, monto_apertura: number): Promise<number> {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const [openCajas] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM cajas WHERE usuario_id = ? AND estado = 'abierta'`,
        [usuario_id]
      );

      if ((openCajas as any[]).length > 0) {
        throw new Error("Ya existe una caja abierta para este usuario");
      }

      const [result] = await connection.query(
        `INSERT INTO cajas (usuario_id, fecha_apertura, monto_apertura, total_ventas, estado)
         VALUES (?, NOW(), ?, 0, 'abierta')`,
        [usuario_id, monto_apertura]
      );

      await connection.commit();
      return (result as any).insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async cerrarCaja(
    caja_id: number, 
    monto_cierre: number, 
    usuario_id: number
  ): Promise<{ 
    monto_sistema: number; 
    diferencia: number; 
    total_ventas: number;
    monto_apertura: number;
  }> {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const [cajaRows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM cajas WHERE id = ?`,
        [caja_id]
      );

      if ((cajaRows as any[]).length === 0) {
        throw new Error("Caja no encontrada");
      }

      const caja = cajaRows[0] as Caja;
      
      if (caja.estado !== "abierta") {
        throw new Error("La caja ya está cerrada");
      }

      if (caja.usuario_id !== usuario_id) {
        throw new Error("No tienes permiso para cerrar esta caja");
      }

      const [ventasResult] = await connection.query<RowDataPacket[]>(
        `SELECT COALESCE(SUM(total), 0) as total_ventas, COUNT(*) as num_ventas
         FROM ventas 
         WHERE caja_id = ?`,
        [caja_id]
      );

      const totalVentas = parseFloat((ventasResult[0] as any).total_ventas || 0);
      const montoSistema = caja.monto_apertura + totalVentas;
      const diferencia = monto_cierre - montoSistema;

      await connection.query(
        `UPDATE cajas
         SET fecha_cierre = NOW(), 
             monto_cierre = ?, 
             total_ventas = ?,
             diferencia = ?, 
             estado = 'cerrada'
         WHERE id = ?`,
        [monto_cierre, totalVentas, diferencia, caja_id]
      );

      await connection.commit();

      return {
        monto_sistema: montoSistema,
        diferencia,
        total_ventas: totalVentas,
        monto_apertura: caja.monto_apertura,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getCajaAbierta(usuario_id: number): Promise<Caja | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT c.*, u.nombres as usuario_nombre
       FROM cajas c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.usuario_id = ? AND c.estado = 'abierta' 
       LIMIT 1`,
      [usuario_id]
    );
    return (rows as any[])[0] || null;
  },

  async getCajaById(id: number): Promise<Caja | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT c.*, u.nombres as usuario_nombre
       FROM cajas c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.id = ?`,
      [id]
    );
    return (rows as any[])[0] || null;
  },

  async getAll(): Promise<Caja[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT c.*, u.nombres as usuario_nombre 
       FROM cajas c
       JOIN usuarios u ON c.usuario_id = u.id
       ORDER BY c.fecha_apertura DESC`
    );
    return rows as Caja[];
  },

  async getCajasCerradas(limit: number = 10): Promise<Caja[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT c.*, u.nombres as usuario_nombre 
       FROM cajas c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.estado = 'cerrada'
       ORDER BY c.fecha_cierre DESC
       LIMIT ?`,
      [limit]
    );
    return rows as Caja[];
  },

  async getResumenDiario(fecha: string): Promise<{
    total_aperturas: number;
    total_ventas: number;
    total_cierres: number;
    diferencia_total: number;
    num_cajas: number;
  }> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
         COALESCE(SUM(monto_apertura), 0) as total_aperturas,
         COALESCE(SUM(total_ventas), 0) as total_ventas,
         COALESCE(SUM(monto_cierre), 0) as total_cierres,
         COALESCE(SUM(diferencia), 0) as diferencia_total,
         COUNT(*) as num_cajas
       FROM cajas
       WHERE DATE(fecha_apertura) = ?`,
      [fecha]
    );
    return rows[0] as any;
  },

  async getVentasByCaja(caja_id: number): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT v.*, c.nombre as cliente_nombre, u.nombres as usuario_nombre
       FROM ventas v
       LEFT JOIN clientes c ON v.cliente_id = c.id
       JOIN usuarios u ON v.usuario_id = u.id
       WHERE v.caja_id = ?
       ORDER BY v.fecha DESC`,
      [caja_id]
    );
    return rows as any[];
  },

  async hasOpenCaja(usuario_id: number): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM cajas 
       WHERE usuario_id = ? AND estado = 'abierta'`,
      [usuario_id]
    );
    return ((rows[0] as any).count || 0) > 0;
  },
};