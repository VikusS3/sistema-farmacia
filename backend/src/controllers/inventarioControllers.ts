import { Request, Response } from "express";
import { InventarioModel } from "../models/inventario";
import { ProductoModel } from "../models/productos";
import { createInventarioSchema } from "../validators/inventarioValidators";

export const InventarioController = {
  async getAll(req: Request, res: Response) {
    try {
      const inventario = await InventarioModel.findAll();
      res.json(inventario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los movimientos" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const movimiento = await InventarioModel.findById(parseInt(id));
      if (!movimiento) {
        res.status(404).json({ message: "Movimiento no encontrado" });
        return;
      }
      res.json(movimiento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el movimiento" });
    }
  },

  async registrarMovimiento(req: Request, res: Response) {
    try {
      const parse = createInventarioSchema.safeParse(req.body);
      if (!parse.success) {
        res.status(400).json({
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de movimiento inválidos",
        });
        return;
      }

      const { producto_id, movimiento, cantidad, motivo } = parse.data;

      const producto = await ProductoModel.findById(producto_id);
      if (!producto) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
      }

      const stock_anterior = producto.stock;
      const stock_nuevo = movimiento === "ajuste"
        ? cantidad
        : (movimiento === "compra"
          ? stock_anterior + cantidad
          : stock_anterior - cantidad);

      const usuario_id = req.user?.id || req.body.usuario_id;
      if (!usuario_id) {
        res.status(400).json({ error: "ID de usuario requerido" });
        return;
      }

      const movimientoId = await InventarioModel.registrarMovimiento({
        producto_id,
        lote_id: req.body.lote_id || null,
        usuario_id,
        movimiento,
        tipo_referencia: req.body.tipo_referencia || "manual",
        referencia_id: req.body.referencia_id || null,
        cantidad,
        stock_anterior,
        stock_nuevo,
        motivo,
        fecha_movimiento: new Date().toISOString().split("T")[0],
      });

      res.status(201).json({
        id: movimientoId,
        message: "Movimiento registrado correctamente",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al registrar el movimiento" });
    }
  },

  async verificarStock(req: Request, res: Response) {
    try {
      const { producto_id, cantidad } = req.body;

      if (!producto_id || !cantidad) {
        res.status(400).json({ error: "Datos incompletos para verificar el stock" });
        return;
      }

      const stockSuficiente = await InventarioModel.verificarStock(
        producto_id, cantidad
      );

      if (!stockSuficiente) {
        res.status(400).json({ error: "Stock insuficiente" });
        return;
      }

      res.json({ message: "Stock suficiente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al verificar el stock" });
    }
  },
};
