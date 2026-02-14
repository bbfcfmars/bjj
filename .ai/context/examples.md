# Examples

**Technique JSON shape (from starter):**
```json
{
  "technique_name": "De la Riva Sweep",
  "portuguese_name": "Varrer De La Riva",
  "description": "A 2–3 sentence technical overview.",
  "difficulty": "Intermediate",
  "sequential_diagram_steps": [
    { "timestamp": "00:05", "label": "The Grip", "detail": "Collar and sleeve control." },
    { "timestamp": "00:08", "label": "The Off-balance", "detail": "Hip heist to load weight." },
    { "timestamp": "00:12", "label": "The Sweep", "detail": "Kick primary leg, pull sleeve." },
    { "timestamp": "00:15", "label": "The Transition", "detail": "Come up to technical mount." }
  ]
}
```

**Editor export:** .mp4, 1080p, kebab-case name, save to `/public/videos/`. See `_notes/bjj-editor-prompt.md`.

**Enrichment schema (webmaster output):** Optional `enrichment` on each technique JSON: `diagram_urls[]`, `step_refs[]`, `sources[]`. See `.ai/context/webmaster-handoff.md`.

**Diagram/reference links (starter):** BJJ World, Elite Sports, Sensō, Jiujitsu Brotherhood, Graciemag, Pinterest board, Amersfoort BJJ terms/blog — use for webmaster enrichment and attribution.
