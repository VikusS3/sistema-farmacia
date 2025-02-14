import { Request, Response, RequestHandler } from "express";
import { CategoriaModel } from "../models/categorias";
import {
  createCategoriasSchema,
  updateCategoriasSchema,
} from "../validators/categoriasValidators";

export class CategoriaController {
  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const categorias = await CategoriaModel.findAll();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las categorias" });
    }
  };

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const categoria = await CategoriaModel.findById(parseInt(id));
      if (!categoria) {
        res.status(404).json({ message: "Categoria no encontrada" });
        return;
      }
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la categoria" });
    }
  };

  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const validatedData = createCategoriasSchema.parse(req.body);
      const id = await CategoriaModel.create(validatedData);
      res.status(201).json({ id, message: "Categoria creada exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al crear la categoria",
      });
    }
  };

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateCategoriasSchema.parse(req.body);
      const updated = await CategoriaModel.update(id, validatedData);
      if (!updated) {
        res.status(404).json({ message: "Categoria no encontrada" });
        return;
      }
      res.json({ message: "Categoria actualizada exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al actualizar la categoria",
      });
    }
  };

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await CategoriaModel.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Categoria no encontrada" });
        return;
      }
      res.json({ message: "Categoria eliminada exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la categoria" });
    }
  };
}
