import PDFDocument from "pdfkit";
import { Response } from "express";
import fs from "fs";
import path from "path";
import { Producto, VentaTicket } from "../types";

export const generarTicketPDF = (
  res: Response,
  venta: VentaTicket,
  productos: Producto[]
) => {
  const doc = new PDFDocument({ size: [220, 600], margin: 5 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=boleta.pdf");
  doc.pipe(res);

  // ✅ Agrega logo
  // ✅ Agrega el logo arriba del todo (si existe)
  const logoPath = path.join(__dirname, "../public/logo.png");
  if (fs.existsSync(logoPath)) {
    const logoWidth = 60;
    const pageWidth = 220;
    const centerX = (pageWidth - logoWidth) / 2;

    doc.image(logoPath, centerX, doc.y, {
      fit: [logoWidth, logoWidth],
    });
    doc.moveDown(2); // Espacio después del logo
  }

  // ✅ Fecha corregida
  const fechaObj = new Date();
  const dia = fechaObj.getDate().toString().padStart(2, "0");
  const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
  const anio = fechaObj.getFullYear();
  const hora = fechaObj.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Lima",
  });

  // --- Encabezado ---
  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("BOTICAS DANYFARMA", { align: "center" });
  doc
    .fontSize(7)
    .font("Helvetica")
    .text("Cuidando la salud de tu familia", { align: "center" })
    .text("Mz.M1 Lte.4 A.H.C. Cueto Fermandini", { align: "center" })
    .text("Los Olivos - Lima - Lima", { align: "center" })
    .text("Telf.: 01 654 1807", { align: "center" })
    .moveDown(0.5);

  doc
    .text("R.U.C. 10437368461", { align: "center" })
    .text("BOLETA DE VENTA", { align: "center" })
    .font("Helvetica-Bold")
    .text(`Nº: 001-${venta.id.toString().padStart(6, "0")}`, {
      align: "center",
    })
    .moveDown(0.5);

  // --- Línea separadora ---
  doc.text("-".repeat(32), { align: "center" }).moveDown(0.2);

  // --- Detalle de productos ---
  const itemX = 5;
  const unitPriceX = 130;
  const importeX = 175;

  doc.font("Helvetica-Bold").fontSize(7);
  doc.text("CANT. DESCRIPCIÓN", itemX, doc.y, { width: 120, continued: true });
  doc.text("P.UNIT", unitPriceX, doc.y, {
    width: 40,
    continued: true,
    align: "right",
  });
  doc.text("IMPORTE", importeX, doc.y, { width: 30, align: "right" });
  doc.moveDown(0.2).font("Helvetica");

  // Detalle de productos
  productos.forEach((prod: any) => {
    doc
      .font("Helvetica-Bold")
      .text(
        `${prod.producto_nombre} (${prod.unidad_medida}) x ${prod.cantidad}`,
        { continued: true }
      )
      .font("Helvetica")
      .text(`  S/. ${prod.subtotal}`, { align: "right" });
  });

  doc.moveDown(0.3);
  doc.text("-".repeat(32), { align: "center" }).moveDown(0.2);

  // --- Totales ---
  doc.fontSize(8).font("Helvetica-Bold");
  doc.text(`TOTAL S/. ${venta.total}`, { align: "right" }).moveDown(0.5);

  // --- Pie de página ---
  doc
    .fontSize(7)
    .font("Helvetica")
    .text("¡Gracias por su preferencia!", { align: "center" })
    .moveDown(0.3)
    .fontSize(6)
    .text("BOTICAS DANYFARMA", { align: "center" })
    .text("RUC: 10437368461", { align: "center" })
    .moveDown(0.5);

  doc.font("Helvetica").fontSize(7);
  doc.text(`Fecha de emisión: ${dia}/${mes}/${anio} ${hora}`, {
    align: "center",
  });
  doc.moveDown(0.5);

  doc.end();
};
