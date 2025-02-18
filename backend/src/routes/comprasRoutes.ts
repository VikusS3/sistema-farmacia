import express from "express";
import { ComprasController } from "../controllers/comprasControllers";

const router = express.Router();

router.get("/", ComprasController.getAll);
router.get("/:id", ComprasController.getById);
router.get("/:id/productos", ComprasController.findProductosCompra);
router.post("/", ComprasController.create);
router.put("/:id", ComprasController.update);
router.delete("/:id", ComprasController.delete);

export default router;
