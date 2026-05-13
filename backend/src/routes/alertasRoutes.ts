import { Router } from "express";
import { AlertaController } from "../controllers/productosControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, AlertaController.getAll);
router.get("/contador", authMiddleware, AlertaController.getUnreadCount);
router.put("/:id/leida", authMiddleware, AlertaController.markAsRead);
router.put("/leer-todas", authMiddleware, AlertaController.markAllAsRead);
router.delete("/:id", authMiddleware, AlertaController.delete);

export default router;