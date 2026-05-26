import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes";
import productoRoutes from "./routes/productoRoutes";
import proveedoresRoutes from "./routes/proveedoresRoutes";
import clientesRoutes from "./routes/clientesRoutes";
import comprasRoutes from "./routes/comprasRoutes";
import ventasRoutes from "./routes/ventasRoutes";
import categoriaRoutes from "./routes/categoriaRoutes";
import inventarioRoutes from "./routes/inventarioRoutes";
import backUpRoutes from "./routes/backUpRoutes";
import cajaRoutes from "./routes/cajaRoutes";
import reporteRoutes from "./routes/reporteRoutes";
import reportePdfRoutes from "./routes/reportePdfRoutes";
import alertasRoutes from "./routes/alertasRoutes";
import { errorHandler } from "./middlewares/errorHandler";
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Intente de nuevo más tarde." },
});
app.use(limiter);

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
app.use("/api/reportes", reporteRoutes);
app.use("/api/reportesPdf", reportePdfRoutes);
app.use("/api/alertas", alertasRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
