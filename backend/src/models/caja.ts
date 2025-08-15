// src/models/CajaModel.ts
import pool from "../config/db";
import { Caja } from "../types";

export const CajaModel = {
  async abrirCaja(usuario_id: number, monto_apertura: number): Promise<number> {
    // Verificar si ya existe una caja abierta
    const [rows] = await pool.query(
      `SELECT id FROM cajas WHERE estado = 'abierta' AND usuario_id = ?`,
      [usuario_id]
    );

    if ((rows as any[]).length > 0) {
      throw new Error("Ya existe una caja abierta para este usuario");
    }

    // Crear nueva caja
    const [result] = await pool.query(
      `INSERT INTO cajas (usuario_id, fecha_apertura, monto_apertura, estado)
       VALUES (?, NOW(), ?, 'abierta')`,
      [usuario_id, monto_apertura]
    );

    return (result as any).insertId;
  },

  // Cerrar caja
  async cerrarCaja(caja_id: number, monto_cierre: number): Promise<void> {
    // Verificar que la caja esté abierta
    const [caja] = await pool.query(
      `SELECT id, estado FROM cajas WHERE id = ?`,
      [caja_id]
    );
    if ((caja as any[]).length === 0) {
      throw new Error("Caja no encontrada");
    }
    if ((caja as any)[0].estado !== "abierta") {
      throw new Error("La caja ya está cerrada");
    }

    // Calcular el total del sistema (ventas asociadas a esta caja)
    const [ventas] = await pool.query(
      `SELECT SUM(total) as total_sistema 
       FROM ventas 
       WHERE caja_id = ?`,
      [caja_id]
    );

    const totalSistema = parseFloat((ventas as any)[0].total_sistema || 0);
    const diferencia = monto_cierre - totalSistema;

    // Actualizar la caja con los datos de cierre
    await pool.query(
      `UPDATE cajas
       SET fecha_cierre = NOW(), 
           monto_cierre = ?, 
           total_sistema = ?, 
           diferencia = ?, 
           estado = 'cerrada'
       WHERE id = ?`,
      [monto_cierre, totalSistema, diferencia, caja_id]
    );
  },

  // Obtener caja abierta de un usuario
  async getCajaAbierta(usuario_id: number): Promise<Caja | null> {
    const [rows] = await pool.query(
      `SELECT * FROM cajas WHERE usuario_id = ? AND estado = 'abierta' LIMIT 1`,
      [usuario_id]
    );
    return (rows as any[])[0] || null;
  },

  // Listar todas las cajas con nombre de usuario
  async getAll(): Promise<(Caja & { usuario_nombre: string })[]> {
    const [rows] = await pool.query(
      `SELECT c.*, u.nombre AS usuario_nombre 
       FROM cajas c
       JOIN usuarios u ON c.usuario_id = u.id
       ORDER BY fecha_apertura DESC`
    );
    return rows as any[];
  },
};
