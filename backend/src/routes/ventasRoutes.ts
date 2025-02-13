import express from "express";
import { VentaController } from "../controllers/ventasController";

const router = express.Router();

router.get("/", VentaController.getAll);
router.get("/:id", VentaController.getById);
router.get("/venta/:id", VentaController.getVenta);
router.post("/", VentaController.create);
router.put("/:id", VentaController.update);
router.delete("/:id", VentaController.delete);

export default router;
