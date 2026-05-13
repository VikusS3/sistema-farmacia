import { Router } from "express";
import { CajaController } from "../controllers/cajaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/abrir", authMiddleware, CajaController.abrirCaja);
router.post("/cerrar", authMiddleware, CajaController.cerrarCaja);
router.get("/abierta/:usuario_id", authMiddleware, CajaController.getCajaAbierta);
router.get("/resumen-diario", authMiddleware, CajaController.getResumenDiario);
router.get("/cerradas", authMiddleware, CajaController.getCajasCerradas);
router.get("/:id", authMiddleware, CajaController.getCajaById);
router.get("/", authMiddleware, CajaController.getAll);

export default router;