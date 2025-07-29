import { Request, Response } from "express";
import { CajaModel } from "../models/caja";
import {
  aperturaCajaSchema,
  cierreCajaSchema,
} from "../validators/cajaValidators";

export const CajaController = {
  async abrir(req: Request, res: Response): Promise<void> {
    const parse = aperturaCajaSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ errors: parse.error.format() });
      return;
    }

    try {
      const id = await CajaModel.abrirCaja(
        parse.data.usuario_id,
        parse.data.monto_apertura
      );
      const caja = await CajaModel.getCajaAbierta(parse.data.usuario_id);
      res.status(201).json(caja);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
    return;
  },

  async cerrar(req: Request, res: Response): Promise<void> {
    const parse = cierreCajaSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ errors: parse.error.format() });
      return;
    }

    try {
      await CajaModel.cerrarCaja(parse.data.caja_id, parse.data.monto_cierre);
      res.json({ message: "Caja cerrada correctamente" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
    return;
  },

  async getCajaAbierta(req: Request, res: Response): Promise<void> {
    const usuarioId = Number(req.params.usuario_id);
    const caja = await CajaModel.getCajaAbierta(usuarioId);
    if (!caja) res.status(404).json({ message: "No hay caja abierta" });
    res.json(caja);
    return;
  },

  async getAll(req: Request, res: Response): Promise<void> {
    const cajas = await CajaModel.getAll();
    res.json(cajas);
    return;
  },
};
