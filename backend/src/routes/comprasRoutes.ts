import { Router } from "express";
import { CompraController } from "../controllers/comprasControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, CompraController.getAll);
router.get("/:id", authMiddleware, CompraController.getById);
router.post("/", authMiddleware, CompraController.create);

export default router;
