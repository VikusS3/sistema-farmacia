import { Router } from "express";
import { CajaController } from "../controllers/cajaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/abrir", CajaController.abrirCaja);

// Cerrar caja
router.post("/cerrar", CajaController.cerrarCaja);

// Obtener caja abierta de un usuario
router.get("/abierta/:usuario_id", CajaController.getCajaAbierta);

// Listar todas las cajas
router.get("/", CajaController.getAll);

export default router;
