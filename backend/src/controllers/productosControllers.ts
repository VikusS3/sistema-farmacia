import { Request, Response, RequestHandler } from "express";
import { ProductoModel } from "../models/productos";
import {
  createProductoSchema,
  updateProductoSchema,
} from "../validators/productosValidators";

export class ProductoController {
  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const productos = await ProductoModel.findAll();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  };

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const producto = await ProductoModel.findById(parseInt(id));
      if (!producto) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }
      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el producto" });
    }
  };

  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const validatedData = createProductoSchema.parse(req.body);
      const id = await ProductoModel.create(validatedData);
      res.status(201).json({ id, message: "Producto creado exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al crear el producto",
      });
    }
  };

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateProductoSchema.parse(req.body);
      const updated = await ProductoModel.update(id, validatedData);
      if (!updated) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }
      res.json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al actualizar el producto",
      });
    }
  };

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await ProductoModel.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }
      res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  };
}
