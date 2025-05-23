import express from "express";
import { CajaController } from "../controllers/cajaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, CajaController.getAll);
router.get("/:id", authMiddleware, CajaController.getById);
router.post("/abrir", authMiddleware, CajaController.abrirCaja);
router.put("/cerrar", authMiddleware, CajaController.cerrarCaja);
router.get(
  "/activa/usuario/:id",
  authMiddleware,
  CajaController.getCajaActivaByUser
);

export default router;
