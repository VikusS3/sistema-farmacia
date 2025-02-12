import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes";
import productoRoutes from "./routes/productoRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
