import express from "express";
import { ProovedoresController } from "../controllers/proovedoresControllers";

const router = express.Router();

router.get("/", ProovedoresController.getAll);
router.get("/:id", ProovedoresController.getById);
router.post("/", ProovedoresController.create);
router.put("/:id", ProovedoresController.update);
router.delete("/:id", ProovedoresController.delete);

export default router;
