import PDFDocument from "pdfkit";
import { Response } from "express";
import { Producto, VentaTicket } from "../types";

export const generarTicketPDF = (
  res: Response,
  venta: VentaTicket,
  productos: Producto[]
) => {
  const doc = new PDFDocument({ size: [250, 600], margin: 10 });

  const fechaFormateada = new Date(venta.creado_en).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Configura headers para enviar PDF al navegador
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=boleta.pdf");

  doc.pipe(res);

  // Encabezado
  doc.fontSize(10).text("FARMACIA MI SALUD", { align: "center" });
  doc.text("RUC: 999999998", { align: "center" });
  doc.text("Av. Salud N° 123 Comas", { align: "center" });

  doc.text("----------------------------------------", {
    align: "center",
  });

  doc.text(`Boleta N°: ${venta.id}`);
  doc.text(`Fecha: ${fechaFormateada}`);
  doc.text(`Cliente: ${venta.cliente_nombre}`);
  if (venta.metodo_pago) {
    doc.font("Helvetica").text(`Método de pago: ${venta.metodo_pago}`);
  }
  doc.text("----------------------------------------", { align: "center" });

  // Detalle de productos
  productos.forEach((prod: any) => {
    doc
      .font("Helvetica-Bold")
      .text(`${prod.producto_nombre} x ${prod.cantidad}`, { continued: true })
      .font("Helvetica")
      .text(`  S/. ${prod.subtotal}`, { align: "right" });
  });

  doc.text("----------------------------------------", { align: "center" });

  // Totales
  doc.font("Helvetica-Bold").text(`Total: S/. ${venta.total}`);

  doc.moveDown();
  doc.text("¡Gracias por su compra!", { align: "center" });

  doc.end(); // Finaliza y envía el PDF
};
