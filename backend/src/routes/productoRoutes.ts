import { Router } from "express";
import { ProductoController, AlertaController } from "../controllers/productosControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, ProductoController.getAll);
router.get("/bajo-stock", authMiddleware, ProductoController.getLowStock);
router.get("/por-vencer", authMiddleware, ProductoController.getExpiringSoon);
router.get("/lotes", authMiddleware, ProductoController.getAllLotes);
router.post("/lotes", authMiddleware, ProductoController.createLote);
router.post("/verificar-stock", authMiddleware, ProductoController.checkStock);
router.get("/vencimiento/with-experied", authMiddleware, ProductoController.getProductosWhitExpired);
router.get("/:id", authMiddleware, ProductoController.getById);
router.get("/:id/lotes", authMiddleware, ProductoController.getLotes);
router.post("/", authMiddleware, ProductoController.create);
router.put("/:id", authMiddleware, ProductoController.update);
router.delete("/:id", authMiddleware, ProductoController.delete);

export default router;