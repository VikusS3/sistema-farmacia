import { Router } from "express";
import { crearBackup } from "../controllers/backupController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/backup", authMiddleware, crearBackup);

export default router;

//otra forma de probar
// import { Router } from "express";
// import { descargarBackup } from "../controllers/backup.controller";

// const router = Router();

// router.get("/backup/download", descargarBackup);

// export default router;
