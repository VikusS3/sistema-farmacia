import { Router } from "express";
import { CajaController } from "../controllers/cajaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/abrir", authMiddleware, CajaController.abrir);
router.post("/cerrar", authMiddleware, CajaController.cerrar);
router.get(
  "/abierta/:usuario_id",
  authMiddleware,
  CajaController.getCajaAbierta
);
router.get("/", authMiddleware, CajaController.getAll);

export default router;
