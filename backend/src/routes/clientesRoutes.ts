import express from "express";
import { ClienteController } from "../controllers/clientesControllers";

const router = express.Router();

router.get("/", ClienteController.getAll);
router.get("/:id", ClienteController.getById);
router.post("/", ClienteController.create);
router.put("/:id", ClienteController.update);
router.delete("/:id", ClienteController.delete);

export default router;
