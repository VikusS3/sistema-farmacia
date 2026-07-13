import { Request, Response } from "express";
import { ClientesModel } from "../models/clientes";
import {
  createClientesSchema,
  updateClientesSchema,
} from "../validators/clientesValidators";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";

export const ClienteController = {
  async getAll(req: Request, res: Response) {
    try {
      const pag = parsePagination(req.query);
      const { data, total } = await ClientesModel.findAll(pag);
      res.json({ data, meta: buildPaginationMeta(total, pag.page, pag.limit) });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los clientes" });
    }
  },

  async getById(req: Request, res: Response) {
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
  },

  async create(req: Request, res: Response) {
    try {
      const parse = createClientesSchema.safeParse(req.body);
      if (!parse.success) {
        res.status(400).json({
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de cliente inválidos",
        });
        return;
      }

      const id = await ClientesModel.create(parse.data);
      res.status(201).json({ id, message: "Cliente creado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al crear el cliente" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const parse = updateClientesSchema.safeParse(req.body);
      if (!parse.success) {
        res.status(400).json({
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de cliente inválidos",
        });
        return;
      }

      const updated = await ClientesModel.update(id, parse.data);
      if (!updated) {
        res.status(404).json({ message: "Cliente no encontrado" });
        return;
      }
      res.json({ message: "Cliente actualizado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el cliente" });
    }
  },

  async delete(req: Request, res: Response) {
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
  },
};
