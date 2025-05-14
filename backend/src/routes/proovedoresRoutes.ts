import express from "express";
import { ProovedoresController } from "../controllers/proovedoresControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, ProovedoresController.getAll);
router.get("/:id", authMiddleware, ProovedoresController.getById);
router.post("/", authMiddleware, ProovedoresController.create);
router.put("/:id", authMiddleware, ProovedoresController.update);
router.delete("/:id", authMiddleware, ProovedoresController.delete);

export default router;
