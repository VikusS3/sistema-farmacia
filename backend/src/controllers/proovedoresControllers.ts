import { Request, Response, RequestHandler } from "express";
import { ProovedoresModel } from "../models/proovedores";
import {
  createProveedoresSchema,
  updateProveedoresSchema,
} from "../validators/proovedoresValidators";

export class ProovedoresController {
  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const proovedores = await ProovedoresModel.findAll();
      res.json(proovedores);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los proovedores" });
    }
  };

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const proovedor = await ProovedoresModel.findById(parseInt(id));
      if (!proovedor) {
        res.status(404).json({ message: "Proovedor no encontrado" });
        return;
      }
      res.json(proovedor);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el proovedor" });
    }
  };

  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const validatedData = createProveedoresSchema.parse(req.body);
      const id = await ProovedoresModel.create(validatedData);
      res.status(201).json({ id, message: "Proovedor creado exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al crear el proovedor",
      });
    }
  };

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateProveedoresSchema.parse(req.body);
      const updated = await ProovedoresModel.update(id, validatedData);
      if (!updated) {
        res.status(404).json({ message: "Proovedor no encontrado" });
        return;
      }
      res.json({ message: "Proovedor actualizado exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al actualizar el proovedor",
      });
    }
  };

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await ProovedoresModel.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Proovedor no encontrado" });
        return;
      }
      res.json({ message: "Proovedor eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el proovedor" });
    }
  };
}
