import { Request, Response, RequestHandler } from "express";
import { UsuarioModel } from "../models/usuarios";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
} from "../validators/usuarioValidators";

export class UsuarioController {
  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const usuarios = await UsuarioModel.findAll();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  };

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const usuario = await UsuarioModel.findById(parseInt(id));
      if (!usuario) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  };

  static login: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { usuario, token } = await UsuarioModel.login(email, password);
      if (!usuario) {
        res.status(401).json({ message: "Credenciales incorrectas" });
        return;
      }
      // Ocultar la contraseña en la respuesta
      const { password: _, ...usuarioSinPassword } = usuario;

      res.json({ usuario: usuarioSinPassword, token });
    } catch (error) {
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  };

  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const validatedData = createUsuarioSchema.parse(req.body);
      const id = await UsuarioModel.create(validatedData);
      res.status(201).json({ id, message: "Usuario creado exitosamente" });
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ error: "El email ya está registrado" });
      } else {
        res.status(400).json({
          error: (error as any).errors || "Error al crear el usuario",
        });
      }
    }
  };

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateUsuarioSchema.parse(req.body);
      const updated = await UsuarioModel.update(id, validatedData);
      if (!updated) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
      res.status(400).json({
        error: (error as any).errors || "Error al actualizar el usuario",
      });
    }
  };

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await UsuarioModel.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  };
}
