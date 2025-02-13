import { Request, Response, RequestHandler } from "express";
import { ComprasModel } from "../models/compras";
import {
  createComprasSchema,
  updateComprasSchema,
} from "../validators/comprasValidators";

export class ComprasController {
  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const compras = await ComprasModel.findAll();
      res.json(compras);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las compras" });
    }
  };

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const compra = await ComprasModel.findById(parseInt(id));
      if (!compra) {
        res.status(404).json({ message: "Compra no encontrada" });
        return;
      }
      res.json(compra);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la compra" });
    }
  };

  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const validatedData = createComprasSchema.parse(req.body);
      const id = await ComprasModel.create(validatedData);
      res.status(201).json({ id, message: "Compra creada exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al crear la compra",
      });
    }
  };

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateComprasSchema.parse(req.body);
      const updated = await ComprasModel.update(id, validatedData);
      if (!updated) {
        res.status(404).json({ message: "Compra no encontrada" });
        return;
      }
      res.json({ message: "Compra actualizada exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al actualizar la compra",
      });
    }
  };

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await ComprasModel.delete(parseInt(id));
      if (!deleted) {
        res.status(404).json({ message: "Compra no encontrada" });
        return;
      }
      res.json({ message: "Compra eliminada exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la compra" });
    }
  };
}
