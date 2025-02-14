import express from "express";
import { InventarioController } from "../controllers/inventarioControllers";

const router = express.Router();

router.get("/", InventarioController.getAll);
router.get("/:id", InventarioController.getById);
router.post("/registrar", InventarioController.registrarMovimiento);
router.post("/verificar-stock", InventarioController.verificarStock);

export default router;
