import { Router } from "express";
import { VentaController } from "../controllers/ventasController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, VentaController.getAll);
router.get("/:id", authMiddleware, VentaController.getById);
router.post("/", authMiddleware, VentaController.create);
router.get(
  "/:id/generar-ticket",
  authMiddleware,
  VentaController.generarTicket
);

router.get(
  "/venta/:id/productos",
  authMiddleware,
  VentaController.getVentaConProductosById
);

export default router;
