// src/controllers/CajaController.ts
import { Request, Response } from "express";
import { CajaModel } from "../models/caja";
import {
  aperturaCajaSchema,
  cierreCajaSchema,
  getCajaAbiertaSchema,
} from "../validators/cajaValidators";

export const CajaController = {
  // Apertura de caja
  async abrirCaja(req: Request, res: Response) {
    try {
      const { usuario_id, monto_apertura } = aperturaCajaSchema.parse(req.body);

      const nuevaCajaId = await CajaModel.abrirCaja(usuario_id, monto_apertura);

      res.status(201).json({
        message: "Caja abierta correctamente",
        caja_id: nuevaCajaId,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message || "Error al abrir caja" });
    }
  },

  // Cierre de caja
  async cerrarCaja(req: Request, res: Response) {
    try {
      const { caja_id, monto_cierre } = cierreCajaSchema.parse(req.body);

      await CajaModel.cerrarCaja(caja_id, monto_cierre);

      res.json({ message: "Caja cerrada correctamente" });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message || "Error al cerrar caja" });
    }
  },

  // Obtener caja abierta de un usuario
  async getCajaAbierta(req: Request, res: Response): Promise<void> {
    try {
      const { usuario_id } = getCajaAbiertaSchema.parse(req.params);

      const caja = await CajaModel.getCajaAbierta(Number(usuario_id));

      if (!caja) {
        res
          .status(404)
          .json({ message: "No hay caja abierta para este usuario" });
        return;
      }

      res.json(caja);
    } catch (error: any) {
      console.error(error);
      res
        .status(400)
        .json({ error: error.message || "Error al obtener caja abierta" });
    }
  },

  // Listar todas las cajas
  async getAll(req: Request, res: Response) {
    try {
      const cajas = await CajaModel.getAll();
      res.json(cajas);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener lista de cajas" });
    }
  },
};
