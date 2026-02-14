import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "content", "data");

export type Step = {
  timestamp?: string;
  timestamp_seconds?: number;
  label: string;
  detail: string;
  image_path?: string;
};

/** Single diagram image for static graphical instructions (embedded on technique page). */
export type DiagramImage = {
  url: string;
  caption?: string;
  source?: string;
};

export type Enrichment = {
  /** Embedded diagram images (from BJJ World, Elite Sports, Pinterest, etc.). Shown as static graphics. */
  diagram_images?: DiagramImage[];
  /** Fallback: links to diagram pages if not embedding. */
  diagram_urls?: string[];
  step_refs?: { label: string; url: string; caption?: string }[];
  sources?: { name: string; url?: string }[];
} | null;

export type Technique = {
  technique_name: string;
  portuguese_name?: string;
  description: string;
  difficulty?: string;
  sequential_diagram_steps: Step[];
  enrichment?: Enrichment;
  /** URL path to English subtitles (e.g. /subtitles/id.vtt). For non-English videos. */
  subtitle_path?: string | null;
};

export function getTechniqueIds(): string[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function getTechnique(id: string): Technique | null {
  const file = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as Technique;
}

export function getAllTechniques(): { id: string; data: Technique }[] {
  return getTechniqueIds()
    .map((id) => ({ id, data: getTechnique(id) }))
    .filter((t): t is { id: string; data: Technique } => t.data !== null);
}
