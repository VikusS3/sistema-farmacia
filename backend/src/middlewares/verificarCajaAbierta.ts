// src/middlewares/verificarCajaAbierta.ts
import { Request, Response, NextFunction } from "express";
import { CajaModel } from "../models/caja";

export const verificarCajaAbierta = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const usuario_id = req.body.usuario_id;

    if (!usuario_id) {
      res.status(400).json({
        error: "El ID de usuario es requerido para validar la caja",
      });
      return;
    }

    const caja = await CajaModel.getCajaAbierta(usuario_id);

    if (!caja) {
      res.status(403).json({
        error:
          "No tienes una caja abierta. Abre una caja antes de registrar ventas.",
      });
      return;
    }

    req.body.caja_id = caja.id;

    next();
  } catch (error) {
    console.error("Error en verificarCajaAbierta:", error);
    res.status(500).json({ error: "Error al verificar caja abierta" });
  }
};
