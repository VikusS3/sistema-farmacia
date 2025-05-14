import express from "express";
import { ComprasController } from "../controllers/comprasControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, ComprasController.getAll);
router.get("/:id", authMiddleware, ComprasController.getById);
router.get(
  "/:id/productos",
  authMiddleware,
  ComprasController.findProductosCompra
);
router.post("/", authMiddleware, ComprasController.create);
router.put("/:id", authMiddleware, ComprasController.update);
router.delete("/:id", authMiddleware, ComprasController.delete);

export default router;
