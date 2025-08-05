import { Request, Response } from "express";
import { CompraModel } from "../models/compras";
import { compraSchema } from "../validators/comprasValidators";

export const CompraController = {
  async create(req: Request, res: Response): Promise<void> {
    const parse = compraSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ errors: parse.error.format() });
      return;
    }

    try {
      const compraId = await CompraModel.create(
        parse.data,
        parse.data.detalles
      );
      res.status(201).json({ id: compraId });
    } catch (error) {
      console.error("Error al registrar compra:", error);
      res.status(500).json({ message: "Error al registrar compra" });
    }
  },

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const compras = await CompraModel.getAll();
      res.json(compras);
    } catch (error) {
      console.error("Error al obtener compras:", error);
      res.status(500).json({ message: "Error al obtener las compras" });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const compra = await CompraModel.getById(Number(req.params.id));
      if (!compra) {
        res.status(404).json({ message: "Compra no encontrada" });
        return;
      }

      res.json({ compra });
    } catch (error) {
      console.error("Error al obtener la compra:", error);
      res.status(500).json({ message: "Error al obtener la compra" });
    }
  },
};
