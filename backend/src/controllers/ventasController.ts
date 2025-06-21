import { Request, Response, RequestHandler } from "express";
import { VentasModel } from "../models/ventas";
import { DetalleVentaModel } from "../models/detalleVenta";
import { ProductoModel } from "../models/productos";
import { createVentaSchema } from "../validators/ventasValidators";
import { generarTicketPDF } from "../utils/ticketGenerator";

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
      const detalleVenta = req.body.detalle_venta;

      // Validación de stock por cada producto
      for (const detalle of detalleVenta) {
        const producto = await ProductoModel.findById(detalle.producto_id);
        if (!producto) {
          res.status(404).json({
            message: `Producto con ID ${detalle.producto_id} no encontrado`,
          });
          return;
        }

        const factor = producto.factor_conversion || 1;
        const cantidadEnUnidadesMinimas = detalle.cantidad;
        const cantidadEnStock = producto.stock;

        if (cantidadEnStock < cantidadEnUnidadesMinimas / factor) {
          res.status(400).json({
            message: `Stock insuficiente para el producto ${
              producto.nombre
            }. Disponible: ${cantidadEnStock * factor} ${
              producto.unidad_venta
            }, solicitado: ${cantidadEnUnidadesMinimas}`,
          });
          return;
        }
      }

      // Crear venta
      const ventaId = await VentasModel.create(validatedData);

      // Insertar detalle y actualizar stock
      for (const detalle of detalleVenta) {
        const producto = await ProductoModel.findById(detalle.producto_id);
        const factor = producto?.factor_conversion || 1;
        const cantidadEnUnidadesMinimas = detalle.cantidad;

        // Insertar detalle
        await DetalleVentaModel.create({
          venta_id: ventaId,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          descuento: detalle.descuento || 0,
          adicional: detalle.adicional || 0,
          subtotal: detalle.subtotal,
        });

        // Actualizar stock (en unidades base: cajas, frascos, etc.)
        const exito = await ProductoModel.updateStockVenta(
          detalle.producto_id,
          cantidadEnUnidadesMinimas / factor
        );

        if (!exito) {
          res.status(400).json({
            message: `Error al actualizar el stock para el producto ID ${detalle.producto_id}`,
          });
          return;
        }
      }

      res.status(201).json({
        id: ventaId,
        message: "Venta creada exitosamente",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error al registrar la venta",
      });
    }
  };

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { detalle_venta, ...ventaData } = req.body;
      const ventaExistente = await VentasModel.findById(id);
      if (!ventaExistente) {
        res.status(404).json({ message: "Venta no encontrada" });
        return;
      }

      // Verificar si hay stock suficiente para cada producto
      for (const detalle of detalle_venta) {
        const producto = await ProductoModel.findById(detalle.producto_id);
        if (!producto) {
          res.status(404).json({
            message: `Producto con ID ${detalle.producto_id} no encontrado`,
          });
          return; // Asegúrate de que la función termina aquí
        }
        if (producto.stock < detalle.cantidad) {
          res.status(400).json({
            message: `Stock insuficiente para el producto ${producto.nombre}. Disponible: ${producto.stock}, solicitado: ${detalle.cantidad}`,
          });
          return; // Termina la función si hay un error
        }
      }

      const updated = await VentasModel.update(id, {
        ...ventaData,
        detalle_venta,
      });

      if (!updated) {
        res
          .status(404)
          .json({ message: "Venta no encontrada o no se pudo actualizar" });
        return;
      }
      res.json({ message: "Venta actualizada exitosamente" });
    } catch (error) {
      console.error(error);
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

  static generarTicket: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number(req.params.id);

    try {
      const data = await VentasModel.findVenta(id);

      if (!data) {
        res.status(404).json({ message: "Venta no encontrada" });
        return;
      }

      generarTicketPDF(res, data.venta, data.productos);
    } catch (error) {
      console.error("Error al generar ticket:", error);
      res.status(500).json({ message: "Error al generar ticket de venta" });
    }
  };
}
