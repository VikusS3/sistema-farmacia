import { Router } from "express";
import { VentaController } from "../controllers/ventasController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verificarCajaAbierta } from "../middlewares/verificarCajaAbierta";

const router = Router();

router.get("/", authMiddleware, VentaController.getAll);
router.get("/by-date", authMiddleware, VentaController.getByDateRange);
router.get("/estadisticas", authMiddleware, VentaController.getEstadisticas);
router.get("/cliente/:clienteId", authMiddleware, VentaController.getVentasPorCliente);
router.get("/:id", authMiddleware, VentaController.getById);
router.post("/", authMiddleware, verificarCajaAbierta, VentaController.create);
router.post("/:id/cancel", authMiddleware, VentaController.cancel);
router.get("/:id/generar-ticket", authMiddleware, VentaController.generarTicket);
router.get("/venta/:id/productos", authMiddleware, VentaController.getVentaConProductosById);

export default router;