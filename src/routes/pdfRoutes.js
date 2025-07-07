const express = require("express");
const path = require("path");
const fs = require("fs");
const generatePDF = require("../utils/pdfGenerator");
const router = express.Router();

// Route to generate PDF from movie script data
router.get("/generate/script/:movieId", async (req, res) => {
  try {
   const movieId = req.params.movieId || req.query.movieId;
    if(!movieId) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required to generate trailer PDF.",
      });
    }
    const dataPath = path.join(__dirname, "..", "data", `Tamasha.json`);

    // Check if the data file exists
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({
        success: false,
        message: `Data file for movieid "${movieId}" not found. Please ensure ${movieId} exists in the data folder.`,
      });
    }

    const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    const templatesDir = path.join(__dirname, "..", "templates");
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir);
    }
    const outputPath = path.join(templatesDir, `report.pdf`);

    // Render HTML using the main app's view engine
    req.app.render(
      "report",
      { report: jsonData, layout: false },
      async (err, html) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Template rendering failed");
        }
        await generatePDF(html, outputPath);

        // Read the generated PDF file
        const pdfBuffer = fs.readFileSync(outputPath);

        // Return both download and PDF data
        res.json({
          success: true,
          message: "PDF generated successfully",
          fileName: `report.pdf`,
          pdfData: pdfBuffer.toString("base64"),
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("PDF generation failed");
  }
});

router.get("/generate/trailer/:movieId", async (req, res) => {
  try {

    const movieId = req.params.movieId || req.query.movieId;
    if(!movieId) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required to generate trailer PDF.",
      });
    }
    const dataPath = path.join(__dirname, "..", "data", "trailer.json");
    // const dataPath = path.join(__dirname, "..", "data", `${movieTitle}.json`);

    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({
        success: false,
        message: `Data file for this "${movieId}" not found. Please ensure the specific id ${movieId}.json exists in the data folder.`,
      });
    }

    const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    const templatesDir = path.join(__dirname, "..", "templates");
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir);
    }
    const outputPath = path.join(
      templatesDir,
      `trailer_report.pdf`
    );

    // Render HTML using the main app's view engine
    req.app.render(
      "trailer",
      { trailer: jsonData, layout: false },
      async (err, html) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Template rendering failed");
        }
        await generatePDF(html, outputPath);

        // Read the generated PDF file
        const pdfBuffer = fs.readFileSync(outputPath);

        // Return both download and PDF data
        res.json({
          success: true,
          message: "PDF generated successfully",
          fileName: `trailer_report.pdf`,
          pdfData: pdfBuffer.toString("base64"),
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("PDF generation failed");
  }
});

module.exports = router;
