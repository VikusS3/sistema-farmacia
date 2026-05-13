import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

async function seedMasterUser() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const nombre = "Administrador";  // Column name in DB is 'nombres'
  const email = "admin@farmacia.com";
  const password = "admin123";
  const rol = "admin";

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await connection.query(
      "INSERT INTO usuarios (nombres, email, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, rol]
    );
    console.log("✅ Usuario master creado exitosamente");
    console.log("   Email: " + email);
    console.log("   Password: " + password);
    console.log("   Rol: " + rol);
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      console.log("⚠️  El usuario admin ya existe");
    } else {
      throw error;
    }
  } finally {
    await connection.end();
  }
}

seedMasterUser().catch(console.error);