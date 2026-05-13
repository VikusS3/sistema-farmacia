import { Request, Response } from "express";
import { VentaModel } from "../models/ventas";
import { parseVenta, ventaCancelSchema } from "../validators/ventasValidators";
import { ProductoModel } from "../models/productos";
import { generarTicketPDF } from "../utils/ticketGenerator";
import { UnidadVenta } from "../types";

export const VentaController = {
  async create(req: Request, res: Response) {
    try {
      const parse = parseVenta(req.body);
      if (!parse.success) {
        res.status(400).json({ 
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de venta inválidos" 
        });
        return;
      }

      const { cliente_id, usuario_id, caja_id, descuento, adicional, metodo_pago, detalle_venta } = parse.data;

      for (const item of detalle_venta) {
        const stockCheck = await ProductoModel.checkStock(
          item.producto_id, 
          item.cantidad, 
          item.unidad_venta as UnidadVenta
        );
        
        if (!stockCheck.disponible) {
          res.status(400).json({ 
            message: `Stock insuficiente para el producto. 
                      Stock actual: ${stockCheck.stockActual}, 
                      requerido: ${stockCheck.stockNecesario}` 
          });
          return;
        }
      }

      const detallesConPrecios = await Promise.all(
        detalle_venta.map(async (item) => {
          const producto = await ProductoModel.findById(item.producto_id);
          if (!producto) throw new Error(`Producto ${item.producto_id} no encontrado`);
          
          const precioUnitario = ProductoModel.calculatePrice(producto, item.unidad_venta as UnidadVenta);
          const subtotal = precioUnitario * item.cantidad;
          
          return {
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            unidad_venta: item.unidad_venta,
            subtotal,
          };
        })
      );

      const ventaId = await VentaModel.create(
        {
          cliente_id,
          usuario_id,
          caja_id,
          descuento: descuento || 0,
          adicional: adicional || 0,
          metodo_pago,
          total: 0,
        },
        detallesConPrecios
      );

      res.status(201).json({
        message: "Venta registrada correctamente",
        venta_id: ventaId,
      });
    } catch (error: any) {
      console.error("Error al registrar venta:", error);
      res.status(400).json({
        error: error.message || "Error al registrar venta",
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const ventas = await VentaModel.getAll();
      res.json(ventas);
    } catch (error: any) {
      console.error("Error al obtener ventas:", error);
      res.status(500).json({ error: "Error al obtener ventas" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const venta = await VentaModel.getById(Number(req.params.id));
      if (!venta) {
        res.status(404).json({ message: "Venta no encontrada" });
        return;
      }
      res.json({ venta });
    } catch (error: any) {
      console.error("Error al obtener venta:", error);
      res.status(500).json({ error: "Error al obtener venta" });
    }
  },

  async getByDateRange(req: Request, res: Response) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      
      if (!fecha_inicio || !fecha_fin) {
        res.status(400).json({ message: "Fechas requeridas" });
        return;
      }

      const ventas = await VentaModel.getVentasByDateRange(
        String(fecha_inicio), 
        String(fecha_fin)
      );
      res.json(ventas);
    } catch (error: any) {
      console.error("Error al obtener ventas:", error);
      res.status(500).json({ error: "Error al obtener ventas" });
    }
  },

  async getEstadisticas(req: Request, res: Response) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      
      const fechaInicio = String(fecha_inicio) || new Date().toISOString().split('T')[0];
      const fechaFin = String(fecha_fin) || new Date().toISOString().split('T')[0];

      const estadisticas = await VentaModel.getEstadisticasVenta(fechaInicio, fechaFin);
      res.json(estadisticas);
    } catch (error: any) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({ error: "Error al obtener estadísticas" });
    }
  },

  async getVentasPorCliente(req: Request, res: Response) {
    try {
      const cliente_id = Number(req.params.clienteId);
      
      if (isNaN(cliente_id)) {
        res.status(400).json({ message: "ID de cliente inválido" });
        return;
      }

      const ventas = await VentaModel.getVentasPorCliente(cliente_id);
      res.json(ventas);
    } catch (error: any) {
      console.error("Error al obtener ventas:", error);
      res.status(500).json({ error: "Error al obtener ventas" });
    }
  },

  async generarTicket(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
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

  async cancel(req: Request, res: Response) {
    try {
      const venta_id = Number(req.params.id);
      const parse = ventaCancelSchema.safeParse(req.body);
      
      if (!parse.success) {
        res.status(400).json({ 
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de cancelación inválidos" 
        });
        return;
      }

      await VentaModel.cancelVenta(venta_id, parse.data.usuario_id);
      
      res.json({ message: "Venta cancelada correctamente" });
    } catch (error: any) {
      console.error("Error al cancelar venta:", error);
      res.status(400).json({ error: error.message || "Error al cancelar venta" });
    }
  },

  async getVentaConProductosById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await VentaModel.getVentaConProductosById(id);
      
      if (!data) {
        res.status(404).json({ message: "Venta no encontrada" });
        return;
      }
      
      res.json({ venta: data.venta, productos: data.productos });
    } catch (error: any) {
      console.error("Error al obtener venta:", error);
      res.status(500).json({ error: "Error al obtener venta" });
    }
  },
};