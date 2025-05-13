import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export const backupMySQL = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(__dirname, "../../backups");
  const filePath = path.join(backupDir, `backup-${timestamp}.sql`);

  fs.mkdirSync(backupDir, { recursive: true });

  // 🧠 Ruta absoluta a mysqldump.exe
  const mysqldumpPath = "D:\\xamp\\mysql\\bin\\mysqldump.exe";

  const dump = spawn(mysqldumpPath, ["-u", "root", "farmacia"]);

  const writeStream = fs.createWriteStream(filePath);

  dump.stdout.pipe(writeStream);

  dump.stderr.on("data", (data) => {
    console.error("❌ mysqldump stderr:", data.toString());
  });

  dump.on("error", (err) => {
    console.error("❌ Error al ejecutar mysqldump:", err.message);
  });

  dump.on("close", (code) => {
    if (code === 0) {
      console.log("✅ Backup creado correctamente en:", filePath);
    } else {
      console.error("❌ mysqldump terminó con código:", code);
    }
  });
};

//Otra forma de probar para descargar desde el navegador
// import { Request, Response } from "express";
// import { spawn } from "child_process";

// export const descargarBackup = (req: Request, res: Response) => {
//   const fileName = `backup-farmacia-${new Date().toISOString().replace(/[:.]/g, "-")}.sql`;

//   res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
//   res.setHeader("Content-Type", "application/sql");

//   const dump = spawn("mysqldump", ["-u", "root", "farmacia"]);

//   dump.stdout.pipe(res); // Redirigimos la salida al navegador

//   dump.stderr.on("data", (data) => {
//     console.error(`stderr: ${data}`);
//   });

//   dump.on("error", (err) => {
//     console.error("Error al ejecutar mysqldump:", err);
//     res.status(500).send("Error al crear el backup");
//   });

//   dump.on("close", (code) => {
//     if (code !== 0) {
//       console.error(`mysqldump cerró con código: ${code}`);
//     }
//   });
//};
