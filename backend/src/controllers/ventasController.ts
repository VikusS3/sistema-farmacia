import { Request, Response } from "express";
import { VentaModel } from "../models/ventas";
import { ventaSchema } from "../validators/ventasValidators";
import { generarTicketPDF } from "../utils/ticketGenerator";

export const VentaController = {
  async create(req: Request, res: Response) {
    try {
      // Validar datos de la venta
      const ventaData = ventaSchema.parse(req.body);

      // caja_id inyectado por middleware verificarCajaAbierta
      const caja_id = req.body.caja_id ?? null;

      // Crear venta
      const ventaId = await VentaModel.create(
        { ...ventaData, caja_id },
        ventaData.detalle_venta
      );

      res.status(201).json({
        message: "Venta registrada correctamente",
        venta_id: ventaId,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        error: error.message || "Error al registrar venta",
      });
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
