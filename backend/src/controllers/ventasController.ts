import { Request, Response } from "express";
import { VentaModel } from "../models/ventas";
import { ventaSchema } from "../validators/ventasValidators";
import { generarTicketPDF } from "../utils/ticketGenerator";

export const VentaController = {
  async create(req: Request, res: Response): Promise<void> {
    const parse = ventaSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ errors: parse.error.format() });
      return;
    }

    try {
      // ahora pasamos parse.data.detalle_venta
      const ventaId = await VentaModel.create(
        parse.data,
        parse.data.detalle_venta
      );
      res.status(201).json({ id: ventaId });
    } catch (error) {
      console.error("Error al registrar venta:", error);
      res.status(500).json({ message: "Error al registrar venta" });
    }
  },

  async getAll(req: Request, res: Response): Promise<void> {
    const ventas = await VentaModel.getAll();
    res.json(ventas);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const venta = await VentaModel.getById(Number(req.params.id));
    if (!venta) {
      res.status(404).json({ message: "Venta no encontrada" });
      return;
    }

    //const detalles = await VentaModel.getDetallesByVentaId(venta.id);
    res.json({ venta });
  },

  async generarTicket(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);

    try {
      const data = await VentaModel.getVentaConProductosById(id);

      if (!data) {
        res.status(404).json({ message: "Venta no encontrada" });
        return;
      }

      generarTicketPDF(res, data.venta, data.productos);
    } catch (error) {
      console.error("Error al generar ticket:", error);
      res.status(500).json({ message: "Error al generar ticket de venta" });
    }
  },

  async getVentaConProductosById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const venta = await VentaModel.getById(id);
    if (!venta) {
      res.status(404).json({ message: "Venta no encontrada" });
      return;
    }
    res.json({ venta });
  },
};
