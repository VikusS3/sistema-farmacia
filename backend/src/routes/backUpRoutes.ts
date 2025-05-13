import { Router } from "express";
import { crearBackup } from "../controllers/backupController";

const router = Router();

router.post("/backup", crearBackup);

export default router;

//otra forma de probar
// import { Router } from "express";
// import { descargarBackup } from "../controllers/backup.controller";

// const router = Router();

// router.get("/backup/download", descargarBackup);

// export default router;
