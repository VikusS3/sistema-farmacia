import express from "express";
import { CategoriaController } from "../controllers/categoriaControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, CategoriaController.getAll);
router.get("/:id", authMiddleware, CategoriaController.getById);
router.post("/", authMiddleware, CategoriaController.create);
router.put("/:id", authMiddleware, CategoriaController.update);
router.delete("/:id", authMiddleware, CategoriaController.delete);

export default router;
