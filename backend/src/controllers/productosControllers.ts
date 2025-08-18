import { Request, Response } from "express";
import { ProductoModel } from "../models/productos";
import { productoSchema } from "../validators/productosValidators";

export const ProductoController = {
  async getAll(req: Request, res: Response): Promise<void> {
    const productos = await ProductoModel.getAll();
    res.json(productos);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const producto = await ProductoModel.findById(Number(req.params.id));
    if (!producto) res.status(404).json({ message: "Producto no encontrado" });

    res.json(producto);
    return;
  },

  async getProductosWhitExpired(req: Request, res: Response): Promise<void> {
    const productos = await ProductoModel.getProductosWhitExpired();
    res.json(productos);
    return;
  },

  async create(req: Request, res: Response): Promise<void> {
    const parse = productoSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ errors: parse.error.format() });
      return;
    }

    const id = await ProductoModel.create(parse.data);
    const producto = await ProductoModel.findById(id);
    res.status(201).json(producto);
    return;
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const parse = productoSchema.partial().safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ errors: parse.error.format() });
      return;
    }

    const updated = await ProductoModel.update(id, parse.data);
    if (!updated) res.status(404).json({ message: "Producto no encontrado" });

    const producto = await ProductoModel.findById(id);
    res.json(producto);
    return;
  },

  async delete(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const deleted = await ProductoModel.delete(id);
    if (!deleted) res.status(404).json({ message: "Producto no encontrado" });

    const producto = await ProductoModel.findById(id);
    res.json(producto);
    return;
  },
};
