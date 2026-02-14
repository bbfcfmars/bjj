#!/usr/bin/env node
/**
 * Import static diagram images into technique enrichment from content/diagram-mapping.json.
 * Mapping keys are technique_name (English). Merges diagram_images into enrichment; keeps existing enrichment.
 * Run from project root: node src/scripts/import-diagrams.js
 */
const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "../..");
const DATA_DIR = path.join(PROJECT_ROOT, "content", "data");
const MAPPING_PATH = path.join(PROJECT_ROOT, "content", "diagram-mapping.json");

if (!fs.existsSync(MAPPING_PATH)) {
  console.error("Missing content/diagram-mapping.json");
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(MAPPING_PATH, "utf-8"));
const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("."));

let updated = 0;
for (const file of files) {
  const filePath = path.join(DATA_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const name = data.technique_name;
  if (!name || !mapping[name]) continue;

  const diagrams = mapping[name];
  if (!Array.isArray(diagrams) || diagrams.length === 0) continue;

  data.enrichment = data.enrichment || {};
  data.enrichment.diagram_images = diagrams;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Updated ${file} with ${diagrams.length} diagram(s) for "${name}"`);
  updated++;
}

console.log(`Done. Updated ${updated} technique(s).`);
