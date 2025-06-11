import express from "express";
import { ProductoController } from "../controllers/productosControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, ProductoController.getAll);
router.get("/:id", authMiddleware, ProductoController.getById);
router.post("/", authMiddleware, ProductoController.create);
router.put("/:id", authMiddleware, ProductoController.update);
router.get(
  "/vencimiento/with-experied",
  authMiddleware,
  ProductoController.findAllWithExpired
);
router.delete("/:id", authMiddleware, ProductoController.delete);

export default router;
