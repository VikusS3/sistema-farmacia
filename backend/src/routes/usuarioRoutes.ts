import express from "express";
import { UsuarioController } from "../controllers/usuarioControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, UsuarioController.getAll);
router.post("/login", UsuarioController.login);
router.get("/:id", authMiddleware, UsuarioController.getById);
router.post("/", authMiddleware, UsuarioController.create);
router.put("/:id", authMiddleware, UsuarioController.update);
router.delete("/:id", authMiddleware, UsuarioController.delete);

export default router;
