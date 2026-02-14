# Current State

## Project Overview

Agent-curated video blog for learning Brazilian Jiu-Jitsu. Raw session footage is processed by an **editor agent** into short clips; a **video/cloud agent** analyzes clips and produces technique metadata; a **web-research-webmaster agent** (or team) enriches each post with quality multimedia from respected BJJ sources (diagrams, step-by-step instructions, technique diagrams).

**Core purpose:** Turn filmed BJJ sessions into an easy-to-update (ideally automatic) blog-style site with proper technique names, descriptions, and study materials (including diagrams and references).

## Technical Foundation

- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide React. Dark “gym” aesthetic (Slate-900/950, Blue-500/600).
- **Content source:** JSON per technique in `/content/data/` (technique name, Portuguese name, description, sequential steps with timestamps).
- **Video/frames:** `/public/videos/` (clips), `/public/frames/[video-id]/` (extracted step images via FFmpeg).
- **Video intelligence:** Gemini 1.5 Pro API — analyze clips, output structured JSON (technique name, steps, timestamps).
- **Scripts:** Python in `src/scripts/` — e.g. `process_video.py` (upload → Gemini analysis → frame extraction → write JSON). See `_notes/bjj-starter.md` for blueprint.
- **Enrichment:** Web-research agent consumes editor/video-agent output and adds diagrams, step-by-step instructions, or diagrams per technique from trusted BJJ sources.

## Operations (CTO/DevOps)

- **All commands and fixes run in-session.** No expectation that you run terminal commands or fix console errors; the agent runs builds, dev server, Python pipeline, and addresses any errors.
- **If you see module/vendor-chunk errors (e.g. lucide-react):** Agent runs `rm -rf .next && npm run build` (or `npm run clean && npm run build`) and restarts dev; no action required from you.

## Development Philosophy

- **No-code content flow:** Jake is not a developer. Dropping a clip (or editor output) and syncing should drive the pipeline; corrections via editing JSON when the agent is wrong.
- **Data-driven UI:** Build from JSON; missing JSON for a video must not crash the build.
- **BJJ terminology:** Use correct terms (Guard Passing, Sweep, Submission, De La Riva, etc.) and Portuguese names when in metadata.

## Autonomy Configuration

- **Editor agent:** Exports clips as .mp4 @ 1080p, kebab-case filenames, into `/public/videos/`. See `_notes/bjj-editor-prompt.md`.
- **Video/cloud agent:** Runs on new clips (or on build); produces `/content/data/[video-id].json` and frame images.
- **Webmaster agent:** Uses technique metadata + optional video context to find and attach diagrams/instructions from respected BJJ sources (curated list in `_notes/bjj-starter.md`).

## Immediate First Steps

1. **Setup Python:** Add `process_video.py` and `requirements.txt` (e.g. `google-generativeai`); secure Gemini API key (see starter).
2. **Scaffold Next.js:** App Router pages from README + .cursorrules in `_notes/bjj-starter.md` (index + dynamic technique page, TechniqueBreakdown component).
3. **Define enrichment schema:** Extend content/data JSON (or separate store) for webmaster-added assets (diagram URLs, step-by-step refs, source attributions).
4. **Implement TechniqueBreakdown:** Video player + sequential diagram (step images); click step → seek video to timestamp.
5. **Document webmaster handoff:** Input (technique name/ID, description), output (URLs, captions, sources), and where this app reads enrichment data.
