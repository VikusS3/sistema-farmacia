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

    fs.mkdirSync(backupDir, { recursive: true });

    const mysqldumpPath = findMysqldump();
    const dbName = process.env.DB_NAME || "newfarmacia";
    const dbUser = process.env.DB_USER || "root";
    const dbHost = process.env.DB_HOST || "localhost";

    const args = ["-u", dbUser, `--host=${dbHost}`, dbName];
    if (process.env.DB_PASSWORD) {
      args.splice(1, 0, `-p${process.env.DB_PASSWORD}`);
    }

    const dump = spawn(mysqldumpPath, args);
    const writeStream = fs.createWriteStream(filePath);

    dump.stdout.pipe(writeStream);

    let errorOutput = "";

    dump.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    dump.on("error", (err) => {
      reject(new Error(`Error ejecutando mysqldump: ${err.message}`));
    });

    dump.on("close", (code) => {
      if (code === 0) {
        resolve({
          success: true,
          filePath,
          fileName: `backup-${timestamp}.sql`,
          message: "Backup creado exitosamente",
        });
      } else {
        reject(new Error(`mysqldump falló con código ${code}: ${errorOutput}`));
      }
    });

    writeStream.on("error", (err) => {
      reject(new Error(`Error escribiendo archivo: ${err.message}`));
    });
  });
};
