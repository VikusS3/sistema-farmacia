import { Router } from "express";
import { crearBackup } from "../controllers/backupController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/backup", authMiddleware, crearBackup);

export default router;
