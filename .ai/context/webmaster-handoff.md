# Webmaster Agent Handoff

**Purpose:** The web-research-webmaster agent (or team) enriches each technique post with quality multimedia from respected BJJ sources (diagrams, step-by-step instructions, technique diagrams).

## Input (from this app / video agent)

- **Technique ID:** `content/data/[video-id].json` filename without extension (e.g. `triangle-choke-from-guard`).
- **Technique name (English):** `technique_name`
- **Portuguese name:** `portuguese_name` (if present)
- **Description:** `description`
- **Difficulty:** `difficulty`

Optional: same JSON can be passed in full so the agent can use step labels and details for better search.

## Output (what this app reads)

Write back into the same technique JSON under the **`enrichment`** key. Schema:

```json
"enrichment": {
  "diagram_images": [
    { "url": "https://example.com/diagram.png", "caption": "Optional caption", "source": "BJJ World" }
  ],
  "diagram_urls": ["https://example.com/page-with-diagrams"],
  "step_refs": [
    { "label": "Setup", "url": "https://...", "caption": "Optional caption" }
  ],
  "sources": [
    { "name": "BJJ World", "url": "https://bjj-world.com/..." }
  ]
}
```

- **diagram_images:** Array of `{ url, caption?, source? }`. Embedded on the technique page as static graphics. Use direct image URLs (see _notes/bjj-starter.md). Bulk import: edit `content/diagram-mapping.json` and run `node src/scripts/import-diagrams.js`.
- **diagram_urls:** Fallback links (e.g. article pages) under "More links".
- **step_refs:** Optional per-step links to external step-by-step instructions.
- **sources:** Attribution; name and optional URL.

If the agent does not find suitable content, set `enrichment` to `null` or omit it.

## Trusted BJJ sources (starter list)

- BJJ World, Elite Sports, Sensō, Jiujitsu Brotherhood, Graciemag
- Amersfoort BJJ (terms/blog)
- Pinterest board and diagram links in `_notes/bjj-starter.md`

## Where this app reads enrichment

- **File:** `content/data/[technique-id].json` → key `enrichment`
- **UI:** `TechniqueBreakdown` shows `enrichment.diagram_images` as embedded images (with caption/source) and `diagram_urls` as "More links".

## Workflow

1. Webmaster receives technique metadata (ID, name, description, etc.).
2. Searches trusted sources for matching technique diagrams/instructions.
3. Patches the JSON file: add or update the `enrichment` object.
4. Commit/push so the site shows the new links.
