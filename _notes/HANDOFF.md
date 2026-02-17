# Handoff – 2026-02-14

> **Next agent:** Read _notes/HANDOFF.md for full context; agent runs all commands; fix lucide/module errors with `rm -rf .next && npm run build` then restart dev.

## Current Task

BJJ Video Journal: agent-curated video blog for English-speaking learners. Current focus is **stable dev experience** and **content pipeline**. No active feature in progress; app is usable end-to-end.

## Progress Made

- [x] Project initialized (`.ai/context`, `.cursor` BPS, README)
- [x] Python pipeline: `process_video.py`, `process_all.py`, Gemini 2.5 Flash, frame extraction, optional English subtitles for non-English videos
- [x] Next.js app: index (technique cards), dynamic technique page, TechniqueBreakdown (video + step grid, click-to-seek)
- [x] URL encoding for technique IDs with spaces; video/image paths fixed
- [x] English-only: UI labels, Gemini prompt forces English; Portuguese shown as "Also known as (Portuguese): …"
- [x] Subtitle support: optional VTT in pipeline, `<track>` in video player
- [x] Static diagram import: `enrichment.diagram_images`, import script, `content/diagram-mapping.json`, Reference diagrams section on technique page
- [x] Styling/cache fix: lucide-react vendor-chunk error resolved by cleaning `.next` and rebuilding (recurring fix)

## Current State

- **Files modified/created (main):**
  - `src/app/page.tsx` – home grid, encode technique links, encode thumbnail URLs, "Also known as (Portuguese)"
  - `src/app/technique/[id]/page.tsx` – decode id, encode videoSrc, pass subtitleSrc, "Also known as (Portuguese)"
  - `src/components/TechniqueBreakdown.tsx` – video + track (subtitles), step grid, diagram_images grid + diagram_urls "More links", video error state
  - `src/app/lib/techniques.ts` – types Technique, Enrichment, DiagramImage; getTechniqueIds, getTechnique, getAllTechniques
  - `src/scripts/process_video.py` – Gemini 2.5 Flash, English-only prompt, subtitle generation (VTT), enrichment placeholder
  - `src/scripts/process_all.py` – batch process videos without JSON
  - `src/scripts/import-diagrams.js` – merge diagram_mapping.json into technique enrichment
  - `content/diagram-mapping.json` – technique_name → diagram_images (BJJ World, Jiujitsu Brotherhood, Elite Sports, Pinterest URLs)
  - `.ai/context/current-state.md` – Operations note: agent runs all commands; lucide-react fix
  - `.ai/context/webmaster-handoff.md` – diagram_images, diagram_urls, bulk import
  - `README.md` – workflow, diagram import note
- **Components:** TechniqueBreakdown (client), LogoHome if present; no formal test suite.
- **Content:** Multiple techniques in `content/data/*.json` (sample-armbar, Pedro Sauer, plus BJJ Fanatics–style entries). Diagram import has been run for Sliding Collar Choke and Armbar from Closed Guard.

## Blockers/Issues

- **Recurring:** `Cannot find module './vendor-chunks/lucide-react.js'` – stale `.next` cache. **Fix:** Run `rm -rf .next && npm run build` then restart dev. User does not run commands; agent must run and restart.
- **Next.js security:** `npm audit` may report advisories; upgrade Next when needed (see `.ai/context/known-issues.md`).
- **google.generativeai:** Deprecated; consider migrating to `google.genai` when convenient.

## Next Steps

1. **When styling/module errors appear:** Run `rm -rf .next && npm run build` and start dev again (agent does this).
2. **Add techniques:** Drop clips in `public/videos/`, run `python3 src/scripts/process_video.py "filename.mp4"` (or `process_all.py`); ensure `GEMINI_API_KEY` in `.env`.
3. **Add diagram graphics:** Edit `content/diagram-mapping.json` (keys = technique name in English), run `node src/scripts/import-diagrams.js`.
4. **Webmaster enrichment:** Use `.ai/context/webmaster-handoff.md`; patch `content/data/[id].json` with `enrichment.diagram_images` / `diagram_urls` / `step_refs` / `sources`.
5. **Optional:** Migrate Python to `google.genai`; add tests for pipeline or critical UI.

## Context

- **User is not a developer.** The agent is the CTO: **run all commands yourself**. Never give the user commands to copy/paste; never ask them to run the terminal or fix errors. Agent runs builds, dev server, pipeline, imports, and fixes—no back-and-forth.
- **Source of truth:** `.ai/context/` (current-state, conventions, webmaster-handoff, decisions, known-issues). Starter prompts and inspiration: `_notes/bjj-starter.md`, `_notes/bjj-editor-prompt.md`.
- **Language:** Site is English-only. All generated text (technique name, description, step labels/details) in English; Portuguese only as "Also known as (Portuguese): …". Subtitles generated for non-English video audio when possible.
- **IDs with spaces:** Technique IDs can contain spaces (e.g. from filenames). Links use `encodeURIComponent(id)`; technique page decodes; video/image URLs encoded.

## Key Files

- `src/app/technique/[id]/page.tsx` – technique page; decode id, getTechnique, video + subtitle + TechniqueBreakdown
- `src/components/TechniqueBreakdown.tsx` – video, subtitles, step grid (click → seek), Reference diagrams (diagram_images + diagram_urls)
- `src/app/lib/techniques.ts` – data layer; getTechniqueIds, getTechnique, getAllTechniques; types for Technique, Enrichment, DiagramImage
- `src/scripts/process_video.py` – single-clip pipeline: Gemini analysis (English), frames, optional VTT subtitles, write JSON
- `content/diagram-mapping.json` – map technique_name → diagram_images for import script
- `.ai/context/current-state.md` – overview, stack, operations (agent runs commands, lucide fix)
- `.ai/context/webmaster-handoff.md` – enrichment schema, diagram_images, bulk import

## Commands to Run

```bash
# Fix lucide / module errors (run by agent)
rm -rf .next && npm run build
npm run dev

# Process one video (from project root)
python3 src/scripts/process_video.py "video-filename.mp4"

# Process all unprocessed videos
python3 src/scripts/process_all.py

# Import diagram images into techniques
node src/scripts/import-diagrams.js
```

## Environment Notes

- **Node:** Next.js 15.0.5, React 18. Required for build/dev.
- **Python:** 3.x with `google-generativeai`, FFmpeg on PATH. `.env` must have `GEMINI_API_KEY`; optional `GEMINI_MODEL` (default `gemini-2.5-flash`).
- **Dev server:** Often on port 3001 if 3000 is in use. Use `http://localhost:3001` (or 3000) after starting.
- **Clean script:** `npm run clean` removes `.next` only; use before rebuild when vendor-chunk errors occur.
