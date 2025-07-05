const puppeteer = require("puppeteer");

async function generatePDF(html, outputPath) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  // Calculate the height of the content
  const bodyHandle = await page.$('body');
  const boundingBox = await bodyHandle.boundingBox();
  const height = Math.ceil(boundingBox.height);

  await page.pdf({
    path: outputPath,
    width: '794px', // A4 width in px at 96dpi
    height: `${height}px`,
    printBackground: true
  });
  await bodyHandle.dispose();

  await browser.close();
}

module.exports = generatePDF;
