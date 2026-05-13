import { Request, Response } from "express";
import { ProductoModel, AlertaModel } from "../models/productos";
import { parseProducto, parseProductoPartial, parseLote } from "../validators/productosValidators";

export const ProductoController = {
  async getAll(req: Request, res: Response) {
    try {
      const productos = await ProductoModel.getAll();
      res.json(productos);
    } catch (error: any) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "Error al obtener productos" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const producto = await ProductoModel.getWithPrices(Number(req.params.id));
      if (!producto) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }
      res.json(producto);
    } catch (error: any) {
      console.error("Error al obtener producto:", error);
      res.status(500).json({ error: "Error al obtener producto" });
    }
  },

  async getLowStock(req: Request, res: Response) {
    try {
      const productos = await ProductoModel.getLowStock();
      res.json(productos);
    } catch (error: any) {
      console.error("Error al obtener productos con bajo stock:", error);
      res.status(500).json({ error: "Error al obtener productos" });
    }
  },

  async getExpiringSoon(req: Request, res: Response) {
    try {
      const days = Number(req.query.dias) || 30;
      const lotes = await ProductoModel.getExpiringSoon(days);
      res.json(lotes);
    } catch (error: any) {
      console.error("Error al obtener productos por vencer:", error);
      res.status(500).json({ error: "Error al obtener productos" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const parse = parseProducto(req.body);
      if (!parse.success) {
        res.status(400).json({ 
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de producto inválidos" 
        });
        return;
      }

      const id = await ProductoModel.create(parse.data);
      const producto = await ProductoModel.findById(id);
      
      res.status(201).json(producto);
    } catch (error: any) {
      console.error("Error al crear producto:", error);
      res.status(400).json({ error: error.message || "Error al crear producto" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      
      const parse = parseProductoPartial(req.body);
      if (!parse.success) {
        res.status(400).json({ 
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de producto inválidos" 
        });
        return;
      }

      const updated = await ProductoModel.update(id, parse.data);
      if (!updated) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }

      const producto = await ProductoModel.getWithPrices(id);
      res.json(producto);
    } catch (error: any) {
      console.error("Error al actualizar producto:", error);
      res.status(400).json({ error: error.message || "Error al actualizar producto" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deleted = await ProductoModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }

      res.json({ message: "Producto eliminado correctamente" });
    } catch (error: any) {
      console.error("Error al eliminar producto:", error);
      res.status(400).json({ error: error.message || "Error al eliminar producto" });
    }
  },

  async getLotes(req: Request, res: Response) {
    try {
      const productoId = Number(req.params.id);
      
      if (isNaN(productoId)) {
        res.status(400).json({ message: "ID de producto inválido" });
        return;
      }

      const lotes = await ProductoModel.getLotes(productoId);
      res.json(lotes);
    } catch (error: any) {
      console.error("Error al obtener lotes:", error);
      res.status(500).json({ error: "Error al obtener lotes" });
    }
  },

  async createLote(req: Request, res: Response) {
    try {
      const parse = parseLote(req.body);
      if (!parse.success) {
        res.status(400).json({ 
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de lote inválidos" 
        });
        return;
      }

      const id = await ProductoModel.createLote(parse.data);
      
      await ProductoModel.updateStock(
        parse.data.producto_id,
        parse.data.cantidad_inicial,
        "caja",
        "sumar"
      );

      res.status(201).json({ 
        message: "Lote creado correctamente",
        lote_id: id 
      });
    } catch (error: any) {
      console.error("Error al crear lote:", error);
      res.status(400).json({ error: error.message || "Error al crear lote" });
    }
  },

  async getAllLotes(req: Request, res: Response) {
    try {
      const lotes = await ProductoModel.getAllLotes();
      res.json(lotes);
    } catch (error: any) {
      console.error("Error al obtener lotes:", error);
      res.status(500).json({ error: "Error al obtener lotes" });
    }
  },

  async checkStock(req: Request, res: Response) {
    try {
      const { producto_id, cantidad, unidad_venta } = req.body;
      
      const result = await ProductoModel.checkStock(producto_id, cantidad, unidad_venta);
      res.json(result);
    } catch (error: any) {
      console.error("Error al verificar stock:", error);
      res.status(400).json({ error: error.message || "Error al verificar stock" });
    }
  },

  async getProductosWhitExpired(req: Request, res: Response) {
    try {
      const productos = await ProductoModel.getProductosWhitExpired();
      res.json(productos);
    } catch (error: any) {
      console.error("Error al obtener productos vencidos:", error);
      res.status(500).json({ error: "Error al obtener productos" });
    }
  },
};

export const AlertaController = {
  async getAll(req: Request, res: Response) {
    try {
      const leida = req.query.leida;
      const alertas = await AlertaModel.getAll(
        leida !== undefined ? leida === "true" : undefined
      );
      res.json(alertas);
    } catch (error: any) {
      console.error("Error al obtener alertas:", error);
      res.status(500).json({ error: "Error al obtener alertas" });
    }
  },

  async getUnreadCount(req: Request, res: Response) {
    try {
      const count = await AlertaModel.getUnreadCount();
      res.json({ count });
    } catch (error: any) {
      console.error("Error al obtener conteo:", error);
      res.status(500).json({ error: "Error al obtener alertas" });
    }
  },

  async markAsRead(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await AlertaModel.markAsRead(id);
      res.json({ message: "Alerta marcada como leída" });
    } catch (error: any) {
      console.error("Error al marcar alerta:", error);
      res.status(500).json({ error: "Error al actualizar alerta" });
    }
  },

  async markAllAsRead(req: Request, res: Response) {
    try {
      await AlertaModel.markAllAsRead();
      res.json({ message: "Todas las alertas marcadas como leídas" });
    } catch (error: any) {
      console.error("Error al marcar alertas:", error);
      res.status(500).json({ error: "Error al actualizar alertas" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await AlertaModel.delete(id);
      res.json({ message: "Alerta eliminada" });
    } catch (error: any) {
      console.error("Error al eliminar alerta:", error);
      res.status(500).json({ error: "Error al eliminar alerta" });
    }
  },
};