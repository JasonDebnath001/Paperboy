import express from "express";
import PDFDocument from "pdfkit";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   SHARED LAYOUT CONSTANTS
   ========================= */

const PAGE = {
  margin: 50,
  width: 612, // A4 width in points
};

const TABLE = {
  rowHeight: 26,
  columns: {
    item: 50,
    qty: 330,
    price: 400,
    total: 500,
  },
};

/* =========================
   CLASSIC TEMPLATE
   ========================= */

function classicTemplate(doc, data) {
  const { client, items, total } = data;
  const { margin } = PAGE;
  const { columns, rowHeight } = TABLE;

  /* Header */
  doc.fontSize(20).fillColor("#000").text("INVOICE", margin, 40);

  doc.fontSize(11).fillColor("#000").text(`Client: ${client}`, margin, 80);

  /* Table Header */
  let y = 130;

  doc.fontSize(10).text("Item", columns.item, y);
  doc.text("Qty", columns.qty, y);
  doc.text("Price", columns.price, y, { width: 80, align: "right" });
  doc.text("Total", columns.total, y, { width: 80, align: "right" });

  y += 8;
  doc.moveTo(margin, y).lineTo(560, y).stroke();
  y += 10;

  /* Rows */
  doc.fontSize(11);

  items.forEach((item) => {
    const qty = item.qty || 1;
    const rowTotal = qty * item.price;

    doc.text(item.name, columns.item, y);
    doc.text(qty, columns.qty, y);
    doc.text(`₹${item.price}`, columns.price, y, {
      width: 80,
      align: "right",
    });
    doc.text(`₹${rowTotal}`, columns.total, y, {
      width: 80,
      align: "right",
    });

    y += rowHeight;
  });

  /* Total */
  y += 10;
  doc.moveTo(360, y).lineTo(560, y).stroke();

  doc
    .fontSize(12)
    .text("Total", 360, y + 10)
    .text(`₹${total}`, columns.total, y + 10, {
      width: 80,
      align: "right",
    });
}

/* =========================
   MODERN TEMPLATE
   ========================= */

function modernTemplate(doc, data) {
  const { client, items, total } = data;

  const margin = 50;
  const pageWidth = 612;
  const contentWidth = pageWidth - margin * 2;

  /* =========================
       HEADER BAR
       ========================= */

  doc.rect(0, 0, pageWidth, 120).fill("#111");

  doc.fillColor("#fff").fontSize(28).text("Invoice", margin, 40);

  doc
    .fontSize(11)
    .fillColor("#ddd")
    .text("Billed to", margin, 80)
    .fontSize(13)
    .fillColor("#fff")
    .text(client, margin, 95);

  /* =========================
       TABLE CONTAINER
       ========================= */

  let y = 160;

  doc.roundedRect(margin, y, contentWidth, 260, 6).fill("#f7f7f7");

  y += 20;

  const cols = {
    item: margin + 16,
    qty: margin + 320,
    price: margin + 390,
    total: margin + 470,
  };

  /* Table Header */
  doc
    .fontSize(9)
    .fillColor("#666")
    .text("ITEM", cols.item, y)
    .text("QTY", cols.qty, y)
    .text("PRICE", cols.price, y, { width: 60, align: "right" })
    .text("TOTAL", cols.total, y, { width: 60, align: "right" });

  y += 14;
  doc
    .moveTo(margin + 16, y)
    .lineTo(margin + contentWidth - 16, y)
    .strokeColor("#ddd")
    .stroke();

  y += 12;

  /* Rows */
  doc.fontSize(11).fillColor("#000");

  items.forEach((item, index) => {
    const rowHeight = 26;
    const qty = item.qty || 1;
    const rowTotal = qty * item.price;

    if (index % 2 === 0) {
      doc.rect(margin + 10, y - 4, contentWidth - 20, rowHeight).fill("#fff");
    }

    doc
      .fillColor("#000")
      .text(item.name, cols.item, y)
      .text(qty, cols.qty, y)
      .text(`₹${item.price}`, cols.price, y, {
        width: 60,
        align: "right",
      })
      .text(`₹${rowTotal}`, cols.total, y, {
        width: 60,
        align: "right",
      });

    y += rowHeight;
  });

  /* =========================
       TOTAL CARD
       ========================= */

  y += 20;

  doc.roundedRect(margin + contentWidth - 200, y, 200, 60, 6).fill("#111");

  doc
    .fillColor("#fff")
    .fontSize(10)
    .text("TOTAL", margin + contentWidth - 180, y + 12);

  doc.fontSize(18).text(`₹${total}`, margin + contentWidth - 180, y + 28);
}

/* =========================
   TEMPLATE REGISTRY
   ========================= */

const TEMPLATES = {
  classic: classicTemplate,
  modern: modernTemplate,
};

/* =========================
   ROUTES
   ========================= */

app.get("/api/templates", (_, res) => {
  res.json(Object.keys(TEMPLATES));
});

app.post("/api/generate", (req, res) => {
  const { client, items, template = "classic" } = req.body;

  if (!client || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const selected = TEMPLATES[template];
  if (!selected) {
    return res.status(400).json({
      error: "Invalid template",
      available: Object.keys(TEMPLATES),
    });
  }

  const total = items.reduce((sum, i) => sum + (i.qty || 1) * i.price, 0);

  const doc = new PDFDocument({ margin: PAGE.margin });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="invoice.pdf"');

  doc.pipe(res);
  selected(doc, { client, items, total });
  doc.end();
});

/* =========================
   LOCAL DEV SERVER
   ========================= */

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Paperboy running on http://localhost:${PORT}`)
  );
}

export default app;
