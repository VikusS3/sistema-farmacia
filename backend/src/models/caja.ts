import pool from "../config/db";

export const CajaModel = {
  async abrirCaja(usuario_id: number, monto_apertura: number): Promise<number> {
    const [rows] = await pool.query(
      `SELECT * FROM cajas WHERE estado = 'abierta' AND usuario_id = ?`,
      [usuario_id]
    );
    if ((rows as any[]).length > 0) {
      throw new Error("Ya existe una caja abierta para este usuario");
    }

    const [result] = await pool.query(
      `INSERT INTO cajas (usuario_id, fecha_apertura, monto_apertura, estado)
       VALUES (?, NOW(), ?, 'abierta')`,
      [usuario_id, monto_apertura]
    );

    return (result as any).insertId;
  },

  async cerrarCaja(caja_id: number, monto_cierre: number): Promise<void> {
    const [ventas] = await pool.query(
      `SELECT SUM(total) as total_sistema FROM ventas WHERE caja_id = ?`,
      [caja_id]
    );

    const totalSistema = (ventas as any)[0].total_sistema || 0;
    const diferencia = monto_cierre - totalSistema;

    await pool.query(
      `UPDATE cajas
       SET fecha_cierre = NOW(), monto_cierre = ?, total_sistema = ?, diferencia = ?, estado = 'cerrada'
       WHERE id = ?`,
      [monto_cierre, totalSistema, diferencia, caja_id]
    );
  },

  async getCajaAbierta(usuario_id: number): Promise<any> {
    const [rows] = await pool.query(
      `SELECT * FROM cajas WHERE usuario_id = ? AND estado = 'abierta'`,
      [usuario_id]
    );
    return rows as any;
  },

  async getAll(): Promise<any[]> {
    const [rows] = await pool.query(
      `SELECT c.*, u.nombre AS usuario_nombre FROM cajas c
       JOIN usuarios u ON c.usuario_id = u.id
       ORDER BY fecha_apertura DESC`
    );
    return rows as any[];
  },
};
