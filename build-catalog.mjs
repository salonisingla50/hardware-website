import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "/Users/salonisingla/Desktop/freelance/Hardware/outputs";
await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const instructions = workbook.worksheets.add("Instructions");
const categories = workbook.worksheets.add("Categories");
const products = workbook.worksheets.add("Products");
const videos = workbook.worksheets.add("Videos");
const green = "#A8D63F";
const charcoal = "#322F30";
const soft = "#F3F9E5";
const line = "#DDE8C8";

instructions.showGridLines = false;
instructions.getRange("A1:F2").merge();
instructions.getRange("A1").values = [["VAAMS Italian Product Catalogue"]];
instructions.getRange("A1:F2").format = { fill: charcoal, font: { bold: true, color: "#FFFFFF", size: 20 }, verticalAlignment: "center" };
instructions.getRange("A4:B11").values = [
  ["Purpose", "Maintain the products displayed on the VAAMS Italian website."],
  ["Categories", "Add or rename categories in the Categories tab."],
  ["Products", "Add one product per row in the Products tab."],
  ["Videos", "Add YouTube links or direct public video file links in the Videos tab."],
  ["Visibility", "Set in_stock to TRUE to display a product and FALSE to hide it."],
  ["Images", "Paste a public direct image URL in image_url."],
  ["Pricing", "Do not add pricing. The website intentionally displays no product prices."],
  ["Publish", "Upload this workbook to Google Sheets, share as Anyone with the link - Viewer, then paste the Sheet ID into app.js."]
];
instructions.getRange("A4:A11").format = { fill: green, font: { bold: true, color: charcoal }, borders: { preset: "all", style: "thin", color: line } };
instructions.getRange("B4:B11").format = { wrapText: true, borders: { preset: "all", style: "thin", color: line } };
instructions.getRange("A:A").format.columnWidth = 20;
instructions.getRange("B:B").format.columnWidth = 78;
instructions.getRange("4:11").format.rowHeight = 38;

categories.showGridLines = false;
categories.getRange("A1:B1").values = [["category", "display_order"]];
categories.getRange("A2:B11").values = [
  ["Cabinet Hardware", 1], ["Door Hardware", 2], ["Furniture Fittings", 3],
  ["Bath Fittings", 4], ["Kitchen Fittings", 5], ["Architectural Hardware", 6],
  ["Fasteners", 7], ["Glass Fittings", 8], ["Wardrobe Accessories", 9], ["Other", 10]
];
categories.getRange("A1:B1").format = { fill: charcoal, font: { bold: true, color: "#FFFFFF" } };
categories.getRange("A2:B500").format.borders = { preset: "all", style: "thin", color: line };
categories.getRange("A2:A500").format.fill = soft;
categories.getRange("A:A").format.columnWidth = 30;
categories.getRange("B:B").format.columnWidth = 18;
categories.freezePanes.freezeRows(1);
categories.tables.add("A1:B500", true, "CategoriesTable").style = "TableStyleMedium4";

products.showGridLines = false;
products.getRange("A1:F1").values = [["id", "name", "category", "image_url", "description", "in_stock"]];
products.getRange("A2:F7").values = [
  ["VI-001", "Premium Cabinet Handle", "Cabinet Hardware", "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80", "Contemporary handle for kitchens, wardrobes, and premium furniture.", true],
  ["VI-002", "Stainless Steel Hinge", "Door Hardware", "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80", "Durable hinge engineered for smooth movement and long service life.", true],
  ["VI-003", "Designer Basin Mixer", "Bath Fittings", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80", "Refined bathroom fitting with a clean, modern profile.", true],
  ["VI-004", "Soft-Close Drawer Channel", "Furniture Fittings", "", "Smooth soft-close movement for modular furniture applications.", true],
  ["VI-005", "Multipurpose Fastener Set", "Fasteners", "", "Reliable fastening selection for installers and project requirements.", true],
  ["VI-006", "Hidden Sample Product", "Other", "", "Set in_stock to FALSE to keep an item off the website.", false]
];
products.getRange("A1:F1").format = { fill: charcoal, font: { bold: true, color: "#FFFFFF" }, wrapText: true };
products.getRange("A2:F5001").format.borders = { preset: "all", style: "thin", color: line };
products.getRange("A2:A5001").format.fill = soft;
products.getRange("C2:C5001").dataValidation = { rule: { type: "list", formula1: "Categories!$A$2:$A$500" } };
products.getRange("F2:F5001").dataValidation = { rule: { type: "list", values: ["TRUE", "FALSE"] } };
products.getRange("F2:F5001").conditionalFormats.add("cellIs", { operator: "equal", formula: "TRUE", format: { fill: "#E3F5C0", font: { color: "#4C7010", bold: true } } });
products.getRange("F2:F5001").conditionalFormats.add("cellIs", { operator: "equal", formula: "FALSE", format: { fill: "#F6DFDF", font: { color: "#9B3131", bold: true } } });
products.getRange("A:A").format.columnWidth = 16;
products.getRange("B:B").format.columnWidth = 30;
products.getRange("C:C").format.columnWidth = 25;
products.getRange("D:E").format.columnWidth = 58;
products.getRange("F:F").format.columnWidth = 15;
products.getRange("D2:E5001").format.wrapText = true;
products.freezePanes.freezeRows(1);
products.tables.add("A1:F5001", true, "ProductsTable").style = "TableStyleMedium4";

videos.showGridLines = false;
videos.getRange("A1:E1").values = [["id", "title", "video_url", "thumbnail_url", "active"]];
videos.getRange("A2:E3").values = [
  ["VID-001", "VAAMS Italian YouTube Video", "https://youtube.com/@vaamsitalian?si=cXd7yQvolP5HIau4", "", false],
  ["VID-002", "Example Direct Video", "https://example.com/video.mp4", "https://example.com/thumbnail.jpg", false]
];
videos.getRange("A1:E1").format = { fill: charcoal, font: { bold: true, color: "#FFFFFF" } };
videos.getRange("A2:E101").format.borders = { preset: "all", style: "thin", color: line };
videos.getRange("A2:A101").format.fill = soft;
videos.getRange("E2:E101").dataValidation = { rule: { type: "list", values: ["TRUE", "FALSE"] } };
videos.getRange("A:A").format.columnWidth = 16;
videos.getRange("B:B").format.columnWidth = 34;
videos.getRange("C:D").format.columnWidth = 60;
videos.getRange("E:E").format.columnWidth = 14;
videos.freezePanes.freezeRows(1);
videos.tables.add("A1:E101", true, "VideosTable").style = "TableStyleMedium4";

const preview = await workbook.render({ sheetName: "Products", range: "A1:F12", scale: 1.2, format: "png" });
await fs.writeFile(`${outputDir}/vaams-product-catalog-preview.png`, new Uint8Array(await preview.arrayBuffer()));
const file = await SpreadsheetFile.exportXlsx(workbook);
await file.save(`${outputDir}/VAAMS-Italian-Product-Catalogue.xlsx`);

console.log((await workbook.inspect({ kind: "table", range: "Products!A1:F8", include: "values,formulas", tableMaxRows: 8, tableMaxCols: 6 })).ndjson);
console.log((await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 50 } })).ndjson);
