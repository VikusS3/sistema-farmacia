import express from "express";
import { ClienteController } from "../controllers/clientesControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, ClienteController.getAll);
router.get("/:id", authMiddleware, ClienteController.getById);
router.post("/", authMiddleware, ClienteController.create);
router.put("/:id", authMiddleware, ClienteController.update);
router.delete("/:id", authMiddleware, ClienteController.delete);

export default router;
