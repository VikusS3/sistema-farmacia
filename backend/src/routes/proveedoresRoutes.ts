import express from "express";
import { ProveedoresController } from "../controllers/proveedoresControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, ProveedoresController.getAll);
router.get("/:id", authMiddleware, ProveedoresController.getById);
router.post("/", authMiddleware, ProveedoresController.create);
router.put("/:id", authMiddleware, ProveedoresController.update);
router.delete("/:id", authMiddleware, ProveedoresController.delete);

export default router;
