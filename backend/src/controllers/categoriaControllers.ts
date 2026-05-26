import { Request, Response } from "express";
import { CategoriaModel } from "../models/categorias";
import {
  createCategoriasSchema,
  updateCategoriasSchema,
} from "../validators/categoriasValidators";

export const CategoriaController = {
  async getAll(req: Request, res: Response) {
    try {
      const categorias = await CategoriaModel.findAll();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las categorias" });
    }
  },

  async getById(req: Request, res: Response) {
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
  },

  async create(req: Request, res: Response) {
    try {
      const parse = createCategoriasSchema.safeParse(req.body);
      if (!parse.success) {
        res.status(400).json({
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de categoría inválidos",
        });
        return;
      }

      const id = await CategoriaModel.create(parse.data);
      res.status(201).json({ id, message: "Categoria creada exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al crear la categoria" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const parse = updateCategoriasSchema.safeParse(req.body);
      if (!parse.success) {
        res.status(400).json({
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de categoría inválidos",
        });
        return;
      }

      const updated = await CategoriaModel.update(id, parse.data);
      if (!updated) {
        res.status(404).json({ message: "Categoria no encontrada" });
        return;
      }
      res.json({ message: "Categoria actualizada exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la categoria" });
    }
  },

  async delete(req: Request, res: Response) {
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
  },
};
