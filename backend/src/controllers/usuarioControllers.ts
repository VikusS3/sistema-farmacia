import { Request, Response } from "express";
import { UsuarioModel } from "../models/usuarios";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
} from "../validators/usuarioValidators";

export const UsuarioController = {
  async getAll(req: Request, res: Response) {
    try {
      const usuarios = await UsuarioModel.findAll();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  },

  async getById(req: Request, res: Response) {
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
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { usuario, token } = await UsuarioModel.login(email, password);
      if (!usuario) {
        res.status(401).json({ message: "Credenciales incorrectas" });
        return;
      }
      const { password: _, ...usuarioSinPassword } = usuario;
      res.json({ usuario: usuarioSinPassword, token });
    } catch (error) {
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const parse = createUsuarioSchema.safeParse(req.body);
      if (!parse.success) {
        res.status(400).json({
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de usuario inválidos",
        });
        return;
      }

      const id = await UsuarioModel.create(parse.data);
      res.status(201).json({ id, message: "Usuario creado exitosamente" });
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ error: "El email ya está registrado" });
      } else {
        res.status(500).json({ error: "Error al crear el usuario" });
      }
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const parse = updateUsuarioSchema.safeParse(req.body);
      if (!parse.success) {
        res.status(400).json({
          errors: parse.error.flatten().fieldErrors,
          message: "Datos de usuario inválidos",
        });
        return;
      }

      const updated = await UsuarioModel.update(id, parse.data);
      if (!updated) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  },

  async delete(req: Request, res: Response) {
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
  },
};
