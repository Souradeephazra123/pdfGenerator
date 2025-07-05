require("dotenv").config();
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const fs = require("fs");
const cors = require("cors");

const app = express();

// Configure CORS to allow all origins and methods
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: false,
  })
);

// Parse JSON and URL-encoded data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const PORT = process.env.PORT || 4000;

const hbs = exphbs.create({
  extname: ".hbs",
  helpers: {
    eq: (a, b) => a === b,
  },
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Use PDF routes
const pdfRoutes = require("./routes/pdfRoutes");
app.use("/pdf", pdfRoutes);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
