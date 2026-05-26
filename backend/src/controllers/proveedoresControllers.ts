import { Request, Response } from "express";
import { ProveedoresModel } from "../models/proveedores";
import {
  createProveedoresSchema,
  updateProveedoresSchema,
} from "../validators/proveedoresValidators";

export const ProveedoresController = {
  async getAll(req: Request, res: Response) {
    try {
      const proveedores = await ProveedoresModel.findAll();
      res.json(proveedores);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los proveedores" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const proveedor = await ProveedoresModel.findById(parseInt(id));
      if (!proveedor) {
        res.status(404).json({ message: "Proveedor no encontrado" });
        return;
      }
      res.json(proveedor);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el proveedor" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const parse = createProveedoresSchema.safeParse(req.body);
      if (!parse.success) {
        res.status(400).json({
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de proveedor inválidos",
        });
        return;
      }

      const id = await ProveedoresModel.create(parse.data);
      res.status(201).json({ id, message: "Proveedor creado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al crear el proveedor" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const parse = updateProveedoresSchema.safeParse(req.body);
      if (!parse.success) {
        res.status(400).json({
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de proveedor inválidos",
        });
        return;
      }

      const updated = await ProveedoresModel.update(id, parse.data);
      if (!updated) {
        res.status(404).json({ message: "Proveedor no encontrado" });
        return;
      }
      res.json({ message: "Proveedor actualizado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el proveedor" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await ProveedoresModel.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Proveedor no encontrado" });
        return;
      }
      res.json({ message: "Proveedor eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el proveedor" });
    }
  },
};
