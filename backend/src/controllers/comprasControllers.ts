import { Request, Response, RequestHandler } from "express";
import { ComprasModel } from "../models/compras";
import { createComprasSchema } from "../validators/comprasValidators";
import { ProductoModel } from "../models/productos";
import { DetalleCompraModel } from "../models/detalleCompra";

export class ComprasController {
  static getAll: RequestHandler = async (_req: Request, res: Response) => {
    try {
      const compras = await ComprasModel.findAll();
      res.json(compras);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las compras" });
    }
  };

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const compra = await ComprasModel.findById(parseInt(id));
      if (!compra) {
        res.status(404).json({ message: "Compra no encontrada" });
        return;
      }
      res.json(compra);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la compra" });
    }
  };

  static findProductosCompra: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const productos = await ComprasModel.findProductosCompra(parseInt(id));
      res.json(productos);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener los productos de la compra" });
    }
  };

  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const validatedData = createComprasSchema.parse(req.body);
      const detalleCompra = req.body.detalle_compra;

      // Verifica el stock para todos los productos antes de continuar
      for (const detalle of detalleCompra) {
        const producto = await ProductoModel.findById(detalle.producto_id);
        if (!producto) {
          res.status(404).json({ message: "Producto no encontrado" });
          return;
        }
        if (detalle.cantidad <= 0) {
          res.status(400).json({
            message: `La cantidad para el producto ${producto.nombre} debe ser mayor a 0`,
          });
          return;
        }
      }

      const compraId = await ComprasModel.create(validatedData);
      for (const detalle of detalleCompra) {
        await DetalleCompraModel.create({ ...detalle, compra_id: compraId });
        await ProductoModel.updateStockCompra(
          detalle.producto_id,
          detalle.cantidad
        );
      }

      res.status(201).json({
        id: compraId,
        message: "Compra creada exitosamente",
        productos: detalleCompra.map((d: any) => ({
          producto_id: d.producto_id,
          cantidad_cajas: d.cantidad,
          cantidad_unidades: d.cantidad * d.factor_conversion,
        })),
      });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al crear la compra",
      });
    }
  };

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { detalle_compra, ...compraData } = req.body;

      const updated = await ComprasModel.update(id, {
        ...compraData,
        detalle_compra,
      });

      if (!updated) {
        res
          .status(404)
          .json({ message: "Compra no encontrada o no se pudo actualizar" });
        return;
      }
      res.json({ message: "Compra actualizada exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al actualizar la compra",
      });
    }
  };

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await ComprasModel.delete(parseInt(id));
      if (!deleted) {
        res.status(404).json({ message: "Compra no encontrada" });
        return;
      }
      res.json({ message: "Compra eliminada exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la compra" });
    }
  };
}
