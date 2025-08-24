import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { findMysqldump } from "./diagnostic.services";

export interface BackupResult {
  success: boolean;
  filePath: string;
  fileName: string;
  message?: string;
  error?: string;
}

export const backupMySQL = (): Promise<BackupResult> => {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(__dirname, "../../backups");
    const filePath = path.join(backupDir, `backup-${timestamp}.sql`);

    // Crear directorio si no existe
    fs.mkdirSync(backupDir, { recursive: true });

    // 🧠 Ruta absoluta a mysqldump.exe
    // const mysqldumpPath = "D:\\xamp\\mysql\\bin\\mysqldump.exe";
    const mysqldumpPath = findMysqldump();

    const dump = spawn(mysqldumpPath, ["-u", "root", "farmacia"]);
    const writeStream = fs.createWriteStream(filePath);

    dump.stdout.pipe(writeStream);

    let errorOutput = "";

    dump.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error("❌ mysqldump stderr:", data.toString());
    });

    dump.on("error", (err) => {
      console.error("❌ Error al ejecutar mysqldump:", err.message);
      reject(new Error(`Error ejecutando mysqldump: ${err.message}`));
    });

    dump.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Backup creado correctamente en:", filePath);
        resolve({
          success: true,
          filePath,
          fileName: `backup-${timestamp}.sql`,
          message: "Backup creado exitosamente",
        });
      } else {
        console.error("❌ mysqldump terminó con código:", code);
        console.error("❌ Error output:", errorOutput);
        reject(new Error(`mysqldump falló con código ${code}: ${errorOutput}`));
      }
    });

    // Manejar errores del stream de escritura
    writeStream.on("error", (err) => {
      console.error("❌ Error escribiendo archivo:", err);
      reject(new Error(`Error escribiendo archivo: ${err.message}`));
    });
  });
};
