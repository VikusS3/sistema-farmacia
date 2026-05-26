import { Request, Response } from "express";
import { backupMySQL, BackupResult } from "../services/backup.services";
import fs from "fs";

export const crearBackup = async (req: Request, res: Response): Promise<void> => {
  try {
    const backupResult: BackupResult = await backupMySQL();

    if (!fs.existsSync(backupResult.filePath)) {
      res.status(500).json({
        success: false,
        mensaje: "El archivo de backup no se pudo crear",
      });
      return;
    }

    const stats = fs.statSync(backupResult.filePath);

    res.setHeader("Content-Type", "application/sql");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${backupResult.fileName}"`
    );
    res.setHeader("Content-Length", stats.size);

    const readStream = fs.createReadStream(backupResult.filePath);
    
    readStream.pipe(res);

    readStream.on("end", () => {
      fs.unlink(backupResult.filePath, (err) => {
        if (err) console.error("Error deleting backup file:", err);
      });
    });

    readStream.on("error", (error) => {
      console.error("Error streaming backup file:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          mensaje: "Error al enviar el archivo de respaldo",
        });
      }
    });
  } catch (error: any) {
    console.error("Error en el controlador de backup:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        mensaje: error.message || "Error interno del servidor al crear el backup",
      });
    }
  }
};
