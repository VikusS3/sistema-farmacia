import express from "express";
import { VentaController } from "../controllers/ventasController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, VentaController.getAll);
router.get("/:id", authMiddleware, VentaController.getById);
router.get("/venta/:id/productos", authMiddleware, VentaController.getVenta);
router.post("/", authMiddleware, VentaController.create);
router.put("/:id", authMiddleware, VentaController.update);
router.delete("/:id", authMiddleware, VentaController.delete);
router.get("/venta/:id/ticket", authMiddleware, VentaController.generarTicket);

export default router;
