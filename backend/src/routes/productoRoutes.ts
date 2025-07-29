import { Router } from "express";
import { ProductoController } from "../controllers/productosControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, ProductoController.getAll);
router.get("/:id", authMiddleware, ProductoController.getById);
router.post("/", authMiddleware, ProductoController.create);
router.put("/:id", authMiddleware, ProductoController.update);
router.delete("/:id", authMiddleware, ProductoController.delete);

export default router;
