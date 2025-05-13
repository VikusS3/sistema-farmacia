import { Request, Response } from "express";
import { backupMySQL } from "../services/backup.services";

export const crearBackup = (req: Request, res: Response) => {
  try {
    backupMySQL();
    res.status(200).json({ mensaje: "Backup iniciado correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el backup." });
  }
};
