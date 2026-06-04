import { Request, Response } from "express";
import { ReportePdfModel } from "../models/reportePdf";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

function addHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  subtitle: string,
) {
  const logoPath = path.join(__dirname, "../public/logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 30, { width: 60 });
    doc.moveDown(4);
  }
  doc.fontSize(16).font("Helvetica-Bold").text(title, { align: "center" });
  doc.fontSize(10).font("Helvetica").text(subtitle, { align: "center" });
  doc.moveDown(0.5);
  doc
    .moveTo(40, doc.y)
    .lineTo(550, doc.y)
    .strokeColor("#1565c0")
    .stroke();
  doc.moveDown(1);
}

function drawTable(
  doc: PDFKit.PDFDocument,
  headers: string[],
  rows: string[][],
) {
  const colWidth = (510 - headers.length) / headers.length;
  const startX = 40;
  let y = doc.y;

  doc.font("Helvetica-Bold").fontSize(9);
  doc.rect(startX, y, 510, 18).fill("#e3f2fd");
  let x = startX;
  headers.forEach((h, i) => {
    doc.fill("#1565c0").text(h, x + 4, y + 4, {
      width: colWidth,
      align: "left",
    });
    x += colWidth;
  });
  y += 18;
  doc.fill("#000");

  doc.font("Helvetica").fontSize(8);
  rows.forEach((row, ri) => {
    if (y > 740) {
      doc.addPage();
      y = 40;
    }
    if (ri % 2 === 1) {
      doc.rect(startX, y, 510, 18).fill("#f9f9f9");
    }
    x = startX;
    row.forEach((cell, ci) => {
      doc.fill("#000").text(cell, x + 4, y + 4, {
        width: colWidth,
        align: "left",
      });
      x += colWidth;
    });
    y += 18;
  });
  doc.y = y;
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
        desde.toString(),
        hasta.toString(),
      );

      const doc = new PDFDocument({ margin: 40 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reporte-ventas-${desde}-al-${hasta}.pdf`,
      );
      doc.pipe(res);

      addHeader(
        doc,
        "Reporte de Ventas",
        `Desde: ${desde} — Hasta: ${hasta}`,
      );

      const headers = [
        "ID",
        "Cliente",
        "Usuario",
        "Fecha",
        "Total",
        "Desc.",
        "Adic.",
        "Pago",
      ];
      const rows = ventas.map((v: any) => [
        String(v.id),
        v.cliente_nombre || "",
        v.usuario_nombre || "",
        v.fecha
          ? new Date(v.fecha).toLocaleDateString("es-PE")
          : "",
        `S/ ${Number(v.total).toFixed(2)}`,
        `S/ ${Number(v.descuento || 0).toFixed(2)}`,
        `S/ ${Number(v.adicional || 0).toFixed(2)}`,
        v.metodo_pago || "",
      ]);

      drawTable(doc, headers, rows);

      doc
        .moveDown(2)
        .fontSize(9)
        .fill("#777")
        .text(
          "Farmacia - Sistema de Gestión | Reporte generado automáticamente",
          { align: "center" },
        );
      doc.end();
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
        mes.toString(),
        anio.toString(),
      );

      const doc = new PDFDocument({ margin: 40 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reporte-ventas-${mes}-${anio}.pdf`,
      );
      doc.pipe(res);

      const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
      ];
      const nombreMes = meses[Number(mes) - 1] || mes;

      addHeader(
        doc,
        "Reporte de Ventas",
        `Mes: ${nombreMes} — Año: ${anio}`,
      );

      const headers = [
        "ID",
        "Cliente",
        "Usuario",
        "Fecha",
        "Total",
        "Desc.",
        "Adic.",
        "Pago",
      ];
      const rows = ventas.map((v: any) => [
        String(v.id),
        v.cliente_nombre || "",
        v.usuario_nombre || "",
        v.fecha
          ? new Date(v.fecha).toLocaleDateString("es-PE")
          : "",
        `S/ ${Number(v.total).toFixed(2)}`,
        `S/ ${Number(v.descuento || 0).toFixed(2)}`,
        `S/ ${Number(v.adicional || 0).toFixed(2)}`,
        v.metodo_pago || "",
      ]);

      drawTable(doc, headers, rows);

      doc
        .moveDown(2)
        .fontSize(9)
        .fill("#777")
        .text(
          "Farmacia - Sistema de Gestión | Reporte generado automáticamente",
          { align: "center" },
        );
      doc.end();
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

      const ventas = await ReportePdfModel.obtenerVentasPorAnio(
        anio.toString(),
      );

      const doc = new PDFDocument({ margin: 40 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reporte-ventas-${anio}.pdf`,
      );
      doc.pipe(res);

      addHeader(doc, "Reporte de Ventas por Año", `Año: ${anio}`);

      const headers = [
        "ID",
        "Cliente",
        "Usuario",
        "Fecha",
        "Total",
        "Desc.",
        "Adic.",
        "Pago",
      ];
      const rows = ventas.map((v: any) => [
        String(v.id),
        v.cliente_nombre || "",
        v.usuario_nombre || "",
        v.fecha
          ? new Date(v.fecha).toLocaleDateString("es-PE")
          : "",
        `S/ ${Number(v.total).toFixed(2)}`,
        `S/ ${Number(v.descuento || 0).toFixed(2)}`,
        `S/ ${Number(v.adicional || 0).toFixed(2)}`,
        v.metodo_pago || "",
      ]);

      drawTable(doc, headers, rows);

      doc
        .moveDown(2)
        .fontSize(9)
        .fill("#777")
        .text(
          "Farmacia - Sistema de Gestión | Reporte generado automáticamente",
          { align: "center" },
        );
      doc.end();
    } catch (error) {
      console.error("Error generando PDF:", error);
      res.status(500).json({ error: "Error al generar el reporte" });
    }
  },

  async generarInventarioControl(req: Request, res: Response) {
    try {
      const inventario = await ReportePdfModel.controlInventario();

      const doc = new PDFDocument({ margin: 40 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=reporte-inventario.pdf",
      );
      doc.pipe(res);

      addHeader(
        doc,
        "Inventario",
        `Fecha: ${new Date().toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
      );

      const headers = [
        "Producto",
        "Stock",
        "U. Medida",
        "Precio Und",
        "Lote",
        "Vcto.",
      ];
      const rows = inventario.map((item: any) => [
        item.nombre || "",
        String(item.stock ?? ""),
        item.unidad_medida || "",
        `S/ ${Number(item.precio_unidad || 0).toFixed(2)}`,
        item.numero_lote || "—",
        item.fecha_vencimiento
          ? new Date(item.fecha_vencimiento).toLocaleDateString("es-PE")
          : "—",
      ]);

      drawTable(doc, headers, rows);

      doc
        .moveDown(2)
        .fontSize(9)
        .fill("#777")
        .text(
          "Farmacia - Sistema de Gestión | Reporte generado automáticamente",
          { align: "center" },
        );
      doc.end();
    } catch (error) {
      console.error("Error generando PDF:", error);
      res.status(500).json({ error: "Error al generar el reporte" });
    }
  },
};
