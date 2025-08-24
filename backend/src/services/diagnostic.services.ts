import fs from "fs";
import path from "path";
import { spawn } from "child_process";

// Función para diagnosticar problemas con mysqldump
export const diagnosticMysqldump = () => {
  console.log("🔍 Iniciando diagnóstico de mysqldump...\n");

  // 1. Verificar rutas comunes
  const possiblePaths = [
    "D:\\xampp\\mysql\\bin\\mysqldump.exe",
    "C:\\xampp\\mysql\\bin\\mysqldump.exe",
    "D:\\xampp\\mariadb\\bin\\mysqldump.exe",
    "C:\\xampp\\mariadb\\bin\\mysqldump.exe",
    "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe",
    "C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysqldump.exe",
    "D:\\xamp\\mysql\\bin\\mysqldump.exe",
  ];

  console.log("📂 Verificando rutas comunes:");
  let foundPaths = [];

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      console.log(`✅ ENCONTRADO: ${testPath}`);
      foundPaths.push(testPath);
    } else {
      console.log(`❌ NO EXISTE: ${testPath}`);
    }
  }

  // 2. Verificar si XAMPP está instalado
  console.log("\n🔍 Verificando instalación de XAMPP:");
  const xamppPaths = ["C:\\xampp", "D:\\xampp"];

  for (const xamppPath of xamppPaths) {
    if (fs.existsSync(xamppPath)) {
      console.log(`✅ XAMPP encontrado en: ${xamppPath}`);

      // Buscar mysqldump dentro de XAMPP
      const mysqlBin = path.join(xamppPath, "mysql", "bin");
      const mariadbBin = path.join(xamppPath, "mariadb", "bin");

      if (fs.existsSync(mysqlBin)) {
        console.log(`  📁 Directorio MySQL bin existe: ${mysqlBin}`);
        const mysqldumpFile = path.join(mysqlBin, "mysqldump.exe");
        console.log(
          `  ${
            fs.existsSync(mysqldumpFile) ? "✅" : "❌"
          } mysqldump.exe: ${mysqldumpFile}`
        );
      }

      if (fs.existsSync(mariadbBin)) {
        console.log(`  📁 Directorio MariaDB bin existe: ${mariadbBin}`);
        const mysqldumpFile = path.join(mariadbBin, "mysqldump.exe");
        console.log(
          `  ${
            fs.existsSync(mysqldumpFile) ? "✅" : "❌"
          } mysqldump.exe: ${mysqldumpFile}`
        );
      }
    } else {
      console.log(`❌ XAMPP no encontrado en: ${xamppPath}`);
    }
  }

  // 3. Probar mysqldump desde PATH del sistema
  console.log("\n🔍 Probando mysqldump desde PATH del sistema:");
  const testProcess = spawn("mysqldump", ["--version"], { shell: true });

  testProcess.stdout.on("data", (data) => {
    console.log("✅ mysqldump disponible desde PATH:", data.toString().trim());
  });

  testProcess.stderr.on("data", (data) => {
    console.log("⚠️ stderr:", data.toString());
  });

  testProcess.on("error", (err) => {
    console.log("❌ mysqldump NO disponible desde PATH:", err.message);
  });

  testProcess.on("close", (code) => {
    if (code === 0) {
      console.log("✅ mysqldump funciona desde PATH del sistema");
    } else {
      console.log("❌ mysqldump falló desde PATH del sistema, código:", code);
    }

    // Resumen final
    console.log("\n📋 RESUMEN:");
    if (foundPaths.length > 0) {
      console.log("✅ Rutas válidas encontradas:");
      foundPaths.forEach((path) => console.log(`   ${path}`));
      console.log("\n💡 Recomendación: Usa una de estas rutas en tu código");
    } else {
      console.log("❌ No se encontró mysqldump en rutas comunes");
      console.log("\n💡 Soluciones posibles:");
      console.log("   1. Instalar XAMPP o MySQL");
      console.log("   2. Agregar MySQL/MariaDB al PATH del sistema");
      console.log("   3. Usar una instalación portable de MySQL");
    }
  });
};

// Función mejorada para encontrar mysqldump automáticamente
export const findMysqldump = (): string => {
  const possiblePaths = [
    "D:\\xampp\\mysql\\bin\\mysqldump.exe",
    "C:\\xampp\\mysql\\bin\\mysqldump.exe",
    "D:\\xampp\\mariadb\\bin\\mysqldump.exe",
    "C:\\xampp\\mariadb\\bin\\mysqldump.exe",
    "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe",
    "C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysqldump.exe",
    "D:\\xamp\\mysql\\bin\\mysqldump.exe",
  ];

  // Buscar en rutas específicas
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      return testPath;
    }
  }

  // Si no se encuentra, usar desde PATH
  return "mysqldump";
};
