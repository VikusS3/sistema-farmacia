import { Request, Response, RequestHandler } from "express";
import { VentasModel } from "../models/ventas";
import { DetalleVentaModel } from "../models/detalleVenta";
import { ProductoModel } from "../models/productos";
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

  static create: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const validatedData = createVentaSchema.parse(req.body);
      const detalleVenta = req.body.detalle_venta;

      // Verifica el stock para todos los productos antes de continuar
      for (const detalle of detalleVenta) {
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

      // Crear la venta
      const ventaId = await VentasModel.create(validatedData);

      // Crear los detalles de la venta y actualizar el inventario
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

        // // Actualizar el stock del producto
        // const stockActualizado = await ProductoModel.updateStockVenta(
        //   detalle.producto_id,
        //   detalle.cantidad
        // );

        // if (!stockActualizado) {
        //   res.status(400).json({
        //     message: `Error al actualizar el stock para el producto ID ${detalle.producto_id}`,
        //   });
        //   return; // Termina la función si hay un error
        // }
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
