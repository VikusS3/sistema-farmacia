import express from "express";
import { ReportesController } from "../controllers/reporteController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/top-productos",
  authMiddleware,
  ReportesController.getTopProductosMasVendidos
);
router.get(
  "/ventas-mensuales",
  authMiddleware,
  ReportesController.getVentasMensuales
);
router.get(
  "/metricas-dashboard",
  authMiddleware,
  ReportesController.getMetricasDashboard
);

export default router;
