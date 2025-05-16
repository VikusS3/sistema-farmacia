import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes";
import productoRoutes from "./routes/productoRoutes";
import proveedoresRoutes from "./routes/proovedoresRoutes";
import clientesRoutes from "./routes/clientesRoutes";
import comprasRoutes from "./routes/comprasRoutes";
import ventasRoutes from "./routes/ventasRoutes";
import categoriaRoutes from "./routes/categoriaRoutes";
import inventarioRoutes from "./routes/inventarioRoutes";
import backUpRoutes from "./routes/backUpRoutes";
import cajaRoutes from "./routes/cajaRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/", backUpRoutes);
app.use("/api/cajas", cajaRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
