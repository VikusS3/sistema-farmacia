import { Request, Response, RequestHandler } from "express";
import { ClientesModel } from "../models/clientes";
import {
  createClientesSchema,
  updateClientesSchema,
} from "../validators/clientesValidators";

export class ClienteController {
  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const clientes = await ClientesModel.findAll();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los clientes" });
    }
  };

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cliente = await ClientesModel.findById(parseInt(id));
      if (!cliente) {
        res.status(404).json({ message: "Cliente no encontrado" });
        return;
      }
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el cliente" });
    }
  };

  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const validatedData = createClientesSchema.parse(req.body);
      const id = await ClientesModel.create(validatedData);
      res.status(201).json({ id, message: "Cliente creado exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al crear el cliente",
      });
    }
  };

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateClientesSchema.parse(req.body);
      const updated = await ClientesModel.update(id, validatedData);
      if (!updated) {
        res.status(404).json({ message: "Cliente no encontrado" });
        return;
      }
      res.json({ message: "Cliente actualizado exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al actualizar el cliente",
      });
    }
  };

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await ClientesModel.delete(parseInt(id));
      if (!deleted) {
        res.status(404).json({ message: "Cliente no encontrado" });
        return;
      }
      res.json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el cliente" });
    }
  };
}
