const express = require("express");
const PDFDocument = require("pdfkit");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Paperboy API is running! Ready to print.");
});

app.post("/api/generate-invoice", (req, res) => {
  const { client, items } = req.body;

  if (!client || !items || !Array.isArray(items)) {
    return res
      .status(400)
      .json({ error: "Please provide client name and an array of items." });
  }

  // Create a new PDF Document
  const doc = new PDFDocument({ margin: 50 });

  // Set the Headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${Date.now()}.pdf`
  );

  // Pipe the PDF directly to the response
  doc.pipe(res);

  // ----- PDF drawing starts here ------
  // Header
  doc.fontSize(20).text("INVOICE", { align: "center" });
  doc.moveDown(); // Add some space

  // Client Details
  doc.fontSize(12).text(`Bill To: ${client}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown();

  //Draw a line
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // List items
  let total = 0;

  items.forEach((item) => {
    const price = item.price || 0;
    total += price;

    doc.fontSize(12).text(item.name, { continued: true });
    doc.text(`$${price.toFixed(2)}`, { align: "right" });
    doc.moveDown(0.5);
  });

  doc.moveDown();

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // Total
  doc
    .fontSize(16)
    .text(`Total: $${total.toFixed(2)}`, { align: "right", bold: true });

  // Finalize the PDF and end the stream
  doc.end();
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

module.exports = app;
