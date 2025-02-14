import express from "express";
import { CategoriaController } from "../controllers/categoriaControllers";

const router = express.Router();

router.get("/", CategoriaController.getAll);
router.get("/:id", CategoriaController.getById);
router.post("/", CategoriaController.create);
router.put("/:id", CategoriaController.update);
router.delete("/:id", CategoriaController.delete);

export default router;
