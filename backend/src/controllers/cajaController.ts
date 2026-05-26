import { Request, Response } from "express";
import { CajaModel } from "../models/caja";
import {
  aperturaCajaSchema,
  cierreCajaSchema,
  getCajaAbiertaSchema,
} from "../validators/cajaValidators";

export const CajaController = {
  async abrirCaja(req: Request, res: Response) {
    try {
      const parse = aperturaCajaSchema.safeParse(req.body);
      if (!parse.success) {
        res.status(400).json({ 
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de validación inválidos" 
        });
        return;
      }

      const { usuario_id, monto_apertura } = parse.data;

      const tieneCajaAbierta = await CajaModel.hasOpenCaja(usuario_id);
      if (tieneCajaAbierta) {
        res.status(400).json({ 
          message: "Ya tienes una caja abierta. Ciérrala primero." 
        });
        return;
      }

      const nuevaCajaId = await CajaModel.abrirCaja(usuario_id, monto_apertura);

      res.status(201).json({
        message: "Caja abierta correctamente",
        caja_id: nuevaCajaId,
      });
    } catch (error: any) {
      console.error("Error al abrir caja:", error);
      res.status(400).json({ error: error.message || "Error al abrir caja" });
    }
  },

  async cerrarCaja(req: Request, res: Response) {
    try {
      const parse = cierreCajaSchema.safeParse(req.body);
      if (!parse.success) {
        res.status(400).json({ 
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de validación inválidos" 
        });
        return;
      }

      const { caja_id, monto_cierre, usuario_id } = parse.data;

      const result = await CajaModel.cerrarCaja(caja_id, monto_cierre, usuario_id);

      res.json({
        message: "Caja cerrada correctamente",
        resumen: {
          monto_apertura: result.monto_apertura,
          total_ventas: result.total_ventas,
          monto_sistema: result.monto_sistema,
          monto_cierre: monto_cierre,
          diferencia: result.diferencia,
        },
      });
    } catch (error: any) {
      console.error("Error al cerrar caja:", error);
      res.status(400).json({ error: error.message || "Error al cerrar caja" });
    }
  },

  async getCajaAbierta(req: Request, res: Response) {
    try {
      const parse = getCajaAbiertaSchema.safeParse(req.params);
      if (!parse.success) {
        res.status(400).json({ 
          errors: parse.error.flatten().fieldErrors,
          message: "ID de usuario inválido" 
        });
        return;
      }

      const usuario_id = Number(parse.data.usuario_id);
      const caja = await CajaModel.getCajaAbierta(usuario_id);

      if (!caja) {
        res.status(404).json({ 
          message: "No hay caja abierta", 
          hasOpenCaja: false 
        });
        return;
      }

      res.json({ 
        caja,
        hasOpenCaja: true 
      });
    } catch (error: any) {
      console.error("Error al obtener caja abierta:", error);
      res.status(500).json({ error: "Error al obtener caja abierta" });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const cajas = await CajaModel.getAll();
      res.json(cajas);
    } catch (error: any) {
      console.error("Error al obtener cajas:", error);
      res.status(500).json({ error: "Error al obtener lista de cajas" });
    }
  },

  async getCajaById(req: Request, res: Response) {
    try {
      const caja_id = Number(req.params.id);
      
      if (isNaN(caja_id)) {
        res.status(400).json({ message: "ID de caja inválido" });
        return;
      }

      const caja = await CajaModel.getCajaById(caja_id);
      
      if (!caja) {
        res.status(404).json({ message: "Caja no encontrada" });
        return;
      }

      const ventas = await CajaModel.getVentasByCaja(caja_id);
      
      res.json({ caja, ventas });
    } catch (error: any) {
      console.error("Error al obtener caja:", error);
      res.status(500).json({ error: "Error al obtener detalles de caja" });
    }
  },

  async getResumenDiario(req: Request, res: Response) {
    try {
      const { fecha } = req.query;
      const fechaVal = fecha 
        ? String(fecha) 
        : new Date().toISOString().split('T')[0];

      const resumen = await CajaModel.getResumenDiario(fechaVal);
      res.json(resumen);
    } catch (error: any) {
      console.error("Error al obtener resumen:", error);
      res.status(500).json({ error: "Error al obtener resumen diario" });
    }
  },

  async getCajasCerradas(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 10;
      const cajas = await CajaModel.getCajasCerradas(limit);
      res.json(cajas);
    } catch (error: any) {
      console.error("Error al obtener cajas cerradas:", error);
      res.status(500).json({ error: "Error al obtener cajas cerradas" });
    }
  },
};
