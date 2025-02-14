import { Request, Response, RequestHandler } from "express";
import { InventarioModel } from "../models/inventario";
import { createInventarioSchema } from "../validators/inventarioValidators";

export class InventarioController {
  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const inventario = await InventarioModel.findAll();
      res.json(inventario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los movimientos" });
    }
  };

  // Obtener un movimiento de inventario por ID
  static getById: RequestHandler = async (req: Request, res: Response) => {
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
  };

  // Registrar un movimiento en el inventario
  static registrarMovimiento: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const validatedData = createInventarioSchema.parse(req.body);
      const { producto_id, movimiento, cantidad, motivo } = validatedData;

      // Registrar el movimiento
      const movimientoId = await InventarioModel.registrarMovimiento({
        producto_id,
        movimiento,
        cantidad,
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
  };

  // Verificar si hay stock suficiente para un producto
  static verificarStock: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { producto_id, cantidad } = req.body;

      // Validar datos necesarios
      if (!producto_id || !cantidad) {
        res
          .status(400)
          .json({ error: "Datos incompletos para verificar el stock" });
        return;
      }

      // Verificar stock
      const stockSuficiente = await InventarioModel.verificarStock(
        producto_id,
        cantidad
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
  };
}
