import { Request, Response, RequestHandler } from "express";
import { CajaModel } from "../models/caja";
import {
  abrirCajaSchema,
  cerrarCajaSchema,
  cajaIdSchema,
} from "../validators/cajaValidators";
import { ZodError } from "zod";
import ESTADO_CAJAS from "../constants/cajaConstants";
import { getPeruDateTime } from "../utils/cajaUtils";

export class CajaController {
  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const cajas = await CajaModel.findAll();
      res.json(cajas);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: "Error al obtener las cajas" });
      return;
    }
  };

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = cajaIdSchema.parse(req.params);
      const caja = await CajaModel.findById(id);
      if (!caja) {
        res.status(404).json({ error: "Caja no encontrada" });
        return;
      }
      res.json(caja);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: "Error al obtener la caja" });
      return;
    }
  };

  static abrirCaja: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { usuario_id, fecha_apertura, monto_apertura } =
        abrirCajaSchema.parse(req.body);

      const cajaActiva = await CajaModel.findCajaActivaByUser(usuario_id);
      if (cajaActiva) {
        res.status(400).json({ error: "Ya tienes una caja abierta" });
        return;
      }
      const caja = await CajaModel.abrirCaja({
        usuario_id,
        fecha_apertura: fecha_apertura || getPeruDateTime(),
        monto_apertura,
      });
      if (!caja) {
        res.status(404).json({ error: "Caja no encontrada" });
        return;
      }
      res
        .status(201)
        .json({ id: caja.insertId, message: "Caja abierta exitosamente" });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: "Error al abrir la caja" });
      return;
    }
  };

  static cerrarCaja: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id, fecha_cierre, monto_cierre } = cerrarCajaSchema.parse(
        req.body
      );
      const caja = await CajaModel.findById(id);
      if (!caja || caja.estado !== ESTADO_CAJAS.ABIERTA) {
        res.status(400).json({ error: "La caja no está abierta o no existe" });
        return;
      }

      const result = await CajaModel.cerrarCaja(
        id,
        fecha_cierre || getPeruDateTime(),
        monto_cierre
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Caja no encontrada" });
        return;
      }

      res.status(200).json({ message: "Caja cerrada exitosamente" });
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: "Error al cerrar la caja" });
      return;
    }
  };

  static getCajaActivaByUser: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = cajaIdSchema.parse(req.params);
      const caja = await CajaModel.findCajaActivaByUser(id);
      if (!caja) {
        res.status(404).json({ error: "Caja no encontrada" });
        return;
      }
      res.status(200).json({
        id: caja.id,
        message: "Hay una caja abierta actualmente para este usuario",
        fecha_apertura: caja.fecha_apertura,
        monto_apertura: caja.monto_apertura,
        fecha_cierre: caja.fecha_cierre,
        monto_cierre: caja.monto_cierre,
        estado: caja.estado,
        usuario_id: caja.usuario_id,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: "Error al obtener la caja activa" });
      return;
    }
  };
}
