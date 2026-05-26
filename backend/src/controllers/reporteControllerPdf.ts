import { Request, Response } from "express";
import { ReportePdfModel } from "../models/reportePdf";
import path from "path";
import { renderFile } from "ejs";
import { getBrowser } from "../services/browserPool";
import { getLogoBase64 } from "../utils/logoHelper";

async function renderPdf(templateName: string, data: Record<string, any>): Promise<Buffer> {
  const templatePath = path.join(__dirname, `../views/${templateName}.ejs`);
  const logoUrl = getLogoBase64();

  const html: string = await new Promise<string>((resolve, reject) => {
    renderFile(templatePath, { ...data, logoUrl }, (err, str) => {
      if (err) reject(err);
      else resolve(str);
    });
  });

  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await page.close();
  return pdfBuffer;
}

export const ReportePdfController = {
  async generarReporteVentas(req: Request, res: Response) {
    try {
      const { desde, hasta } = req.query;

      if (!desde || !hasta) {
        res.status(400).json({ error: "Debe proporcionar 'desde' y 'hasta'" });
        return;
      }

      const ventas = await ReportePdfModel.obtenerVentasPorFecha(
        desde.toString(), hasta.toString()
      );

      const pdfBuffer = await renderPdf("ventas", { ventas, desde, hasta });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reporte-ventas-${desde}-al-${hasta}.pdf`
      );
      res.end(pdfBuffer);
    } catch (error) {
      console.error("Error generando PDF:", error);
      res.status(500).json({ error: "Error al generar el reporte" });
    }
  },

  async generarReporteVentasMes(req: Request, res: Response) {
    try {
      const { mes, anio } = req.query;

      if (!mes || !anio) {
        res.status(400).json({ error: "Debe proporcionar 'mes' y 'anio'" });
        return;
      }

      const ventas = await ReportePdfModel.obtenerVentasPorMes(
        mes.toString(), anio.toString()
      );

      const pdfBuffer = await renderPdf("ventasMes", { ventas, mes, anio });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reporte-ventas-${mes}-${anio}.pdf`
      );
      res.end(pdfBuffer);
    } catch (error) {
      console.error("Error generando PDF:", error);
      res.status(500).json({ error: "Error al generar el reporte" });
    }
  },

  async generarReporteAnio(req: Request, res: Response) {
    try {
      const { anio } = req.query;

      if (!anio) {
        res.status(400).json({ error: "Debe proporcionar 'anio'" });
        return;
      }

      const ventas = await ReportePdfModel.obtenerVentasPorAnio(anio.toString());

      const pdfBuffer = await renderPdf("ventasAnio", { ventas, anio });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reporte-ventas-${anio}.pdf`
      );
      res.end(pdfBuffer);
    } catch (error) {
      console.error("Error generando PDF:", error);
      res.status(500).json({ error: "Error al generar el reporte" });
    }
  },

  async generarInventarioControl(req: Request, res: Response) {
    try {
      const inventario = await ReportePdfModel.controlInventario();

      const pdfBuffer = await renderPdf("inventario", { inventario });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=reporte-inventario.pdf"
      );
      res.end(pdfBuffer);
    } catch (error) {
      console.error("Error generando PDF:", error);
      res.status(500).json({ error: "Error al generar el reporte" });
    }
  },
};
