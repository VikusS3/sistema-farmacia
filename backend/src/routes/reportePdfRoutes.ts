import express from "express";
import { ReportePdfController } from "../controllers/reporteControllerPdf";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/reporte-ventas",
  authMiddleware,
  ReportePdfController.generarReporteVentas
);
router.get(
  "/reporte-ventas-mes",
  authMiddleware,
  ReportePdfController.generarReporteVentasMes
);
router.get(
  "/reporte-ventas-anio",
  authMiddleware,
  ReportePdfController.generarReporteAnio
);
router.get(
  "/reporte-inventario",
  authMiddleware,
  ReportePdfController.generarInventarioControl
);

export default router;
