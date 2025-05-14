import express from "express";
import { InventarioController } from "../controllers/inventarioControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, InventarioController.getAll);
router.get("/:id", authMiddleware, InventarioController.getById);
router.post(
  "/registrar",
  authMiddleware,
  InventarioController.registrarMovimiento
);
router.post(
  "/verificar-stock",
  authMiddleware,
  InventarioController.verificarStock
);

export default router;
