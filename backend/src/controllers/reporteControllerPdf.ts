// controllers/ReportePdfController.ts
import { Request, Response } from "express";
import puppeteer from "puppeteer";
import { ReportePdfModel } from "../models/reportePdf";
import path from "path";
import { renderFile } from "ejs";
import fs from "fs";

export class ReportePdfController {
  static async generarReporteVentas(req: Request, res: Response) {
    try {
      const { desde, hasta } = req.query;

      if (!desde || !hasta) {
        res.status(400).json({ error: "Debe proporcionar 'desde' y 'hasta'" });
        return;
      }

      // 1. Obtener las ventas del modelo
      const ventas = await ReportePdfModel.obtenerVentasPorFecha(
        desde.toString(),
        hasta.toString()
      );

      // 2. Logo
      const logoPath = path.join(__dirname, "../public/logo.png");

      if (!fs.existsSync(logoPath)) {
        res.status(500).json({ error: "Logo no encontrado" });
        return;
      }
      const logoBufer = fs.readFileSync(logoPath);
      const logoBase64 = Buffer.from(logoBufer).toString("base64");
      const logoMimeType = "image/png";
      const logoUrl: string = `data:${logoMimeType};base64,${logoBase64}`;

      // 3. Ruta del archivo .ejs
      const templatePath = path.join(__dirname, "../views/ventas.ejs");

      // 4. Renderizar HTML con EJS (envuelto en promesa)
      const html: string = await new Promise<string>((resolve, reject) => {
        renderFile(
          templatePath,
          { ventas, desde, hasta, logoUrl },
          (err, str) => {
            if (err) reject(err);
            else resolve(str);
          }
        );
      });

      // 5. Crear PDF con Puppeteer
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      // 6. Enviar respuesta PDF
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
  }

  static async generarReporteVentasMes(req: Request, res: Response) {
    try {
      const { mes, anio } = req.query;

      if (!mes || !anio) {
        res.status(400).json({ error: "Debe proporcionar 'mes' y 'anio'" });
        return;
      }

      const ventas = await ReportePdfModel.obtenerVentasPorMes(
        mes.toString(),
        anio.toString()
      );

      const logoPath = path.join(__dirname, "../public/logo.png");

      if (!fs.existsSync(logoPath)) {
        res.status(500).json({ error: "Logo no encontrado" });
        return;
      }
      const logoBufer = fs.readFileSync(logoPath);
      const logoBase64 = Buffer.from(logoBufer).toString("base64");
      const logoMimeType = "image/png";
      const logoUrl: string = `data:${logoMimeType};base64,${logoBase64}`;

      const templatePath = path.join(__dirname, "../views/ventasMes.ejs");

      const html: string = await new Promise<string>((resolve, reject) => {
        renderFile(templatePath, { ventas, mes, anio, logoUrl }, (err, str) => {
          if (err) reject(err);
          else resolve(str);
        });
      });

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

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
  }

  static async generarReporteAnio(req: Request, res: Response) {
    try {
      const { anio } = req.query;

      if (!anio) {
        res.status(400).json({ error: "Debe proporcionar 'anio'" });
        return;
      }

      const ventas = await ReportePdfModel.obtenerVentasPorAnio(
        anio.toString()
      );

      const logoPath = path.join(__dirname, "../public/logo.png");

      if (!fs.existsSync(logoPath)) {
        res.status(500).json({ error: "Logo no encontrado" });
        return;
      }
      const logoBufer = fs.readFileSync(logoPath);
      const logoBase64 = Buffer.from(logoBufer).toString("base64");
      const logoMimeType = "image/png";
      const logoUrl: string = `data:${logoMimeType};base64,${logoBase64}`;

      const templatePath = path.join(__dirname, "../views/ventasAnio.ejs");

      const html: string = await new Promise<string>((resolve, reject) => {
        renderFile(templatePath, { ventas, anio, logoUrl }, (err, str) => {
          if (err) reject(err);
          else resolve(str);
        });
      });

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

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
  }

  static async generarInventarioControl(req: Request, res: Response) {
    try {
      const inventario = await ReportePdfModel.controlInventario();
      const templatePath = path.join(__dirname, "../views/inventario.ejs");

      const logoPath = path.join(__dirname, "../public/logo.png");

      if (!fs.existsSync(logoPath)) {
        res.status(500).json({ error: "Logo no encontrado" });
        return;
      }
      const logoBufer = fs.readFileSync(logoPath);
      const logoBase64 = Buffer.from(logoBufer).toString("base64");
      const logoMimeType = "image/png";
      const logoUrl: string = `data:${logoMimeType};base64,${logoBase64}`;

      const html: string = await new Promise<string>((resolve, reject) => {
        renderFile(templatePath, { inventario, logoUrl }, (err, str) => {
          if (err) reject(err);
          else resolve(str);
        });
      });
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });
      await browser.close();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reporte-inventario.pdf`
      );
      res.end(pdfBuffer);
    } catch (error) {
      console.error("Error generando PDF:", error);
      res.status(500).json({ error: "Error al generar el reporte" });
    }
  }
}
