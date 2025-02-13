import { Request, Response, RequestHandler } from "express";
import { VentasModel } from "../models/ventas";
import { DetalleVentaModel } from "../models/detalleVenta";
import {
  createVentaSchema,
  updateVentaSchema,
} from "../validators/ventasValidators";

export class VentaController {
  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const ventas = await VentasModel.findAll();
      res.json(ventas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const venta = await VentasModel.findById(parseInt(id));
      if (!venta) {
        res.status(404).json({ message: "Venta not found" });
        return;
      }
      res.json(venta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  static getVenta: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const venta = await VentasModel.findVenta(parseInt(id));
      if (!venta) {
        res.status(404).json({ message: "Venta not found" });
        return;
      }
      res.json(venta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const validatedData = createVentaSchema.parse(req.body);
      const ventaId = await VentasModel.create(validatedData);

      //creamos el detalle de la venta
      const detalleVenta = req.body.detalle_venta;
      for (const detalle of detalleVenta) {
        await DetalleVentaModel.create({
          venta_id: ventaId,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          descuento: detalle.descuento,
          adicional: detalle.adicional,
          subtotal: detalle.subtotal,
        });
      }
      res
        .status(201)
        .json({ id: ventaId, message: "Venta created successfully" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error creating the sale",
      });
    }
  };

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateVentaSchema.parse(req.body);
      const updated = await VentasModel.update(id, validatedData);
      if (!updated) {
        res.status(404).json({ message: "Venta no encontrada" });
        return;
      }
      res.json({ message: "Venta actualizada correctamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error actualizando la venta",
      });
    }
  };

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await VentasModel.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Venta not found" });
        return;
      }
      res.json({ message: "Venta deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting the sale" });
    }
  };
}
