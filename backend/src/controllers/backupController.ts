import { Request, Response } from "express";
import { backupMySQL, BackupResult } from "../services/backup.services";
import fs from "fs";

export const crearBackup = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ejecutar el backup y esperar a que termine
    const backupResult: BackupResult = await backupMySQL();

    // Verificar que el archivo existe
    if (!fs.existsSync(backupResult.filePath)) {
      res.status(500).json({
        success: false,
        mensaje: "El archivo de backup no se pudo crear",
      });
      return;
    }

    // Obtener información del archivo
    const stats = fs.statSync(backupResult.filePath);

    // Configurar headers para la descarga
    res.setHeader("Content-Type", "application/sql");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${backupResult.fileName}"`
    );
    res.setHeader("Content-Length", stats.size);

    // Crear stream de lectura y enviarlo como respuesta
    const readStream = fs.createReadStream(backupResult.filePath);
    
    // Pipe the file stream to the response
    readStream.pipe(res);
    
    // Handle stream events
    readStream.on('end', () => {
      // Delete the file after sending
      fs.unlink(backupResult.filePath, (err) => {
        if (err) console.error('Error deleting backup file:', err);
      });
    });
    
    readStream.on('error', (error) => {
      console.error('Error streaming backup file:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          mensaje: 'Error al enviar el archivo de respaldo',
          error: error.message
        });
      }
    });

    readStream.on("error", (err) => {
      console.error("❌ Error leyendo el archivo:", err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          mensaje: "Error leyendo el archivo de backup",
        });
      }
    });

    // Pipe el archivo al response
    readStream.pipe(res);

    // Opcional: Eliminar el archivo después de enviarlo
    readStream.on("end", () => {
      // Descomentar la siguiente línea si quieres eliminar el archivo después de descargarlo
      // fs.unlinkSync(backupResult.filePath);
      console.log("✅ Backup enviado exitosamente al cliente");
    });
  } catch (error: any) {
    console.error("❌ Error en el controlador de backup:", error);

    // Si ya se enviaron headers, no podemos enviar JSON
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        mensaje:
          error.message || "Error interno del servidor al crear el backup",
      });
    }
  }
};
