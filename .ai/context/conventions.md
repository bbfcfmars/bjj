# Conventions

- **Naming:** kebab-case for clip filenames and video IDs (e.g. `triangle-choke-from-closed-guard.mp4` → id `triangle-choke-from-closed-guard`). No spaces or special characters in filenames.
- **Language:** Site is English-only. All UI and generated content (technique_name, description, step labels/details) in English; Portuguese terms shown only as "Also known as (Portuguese): …". For videos in Spanish or other languages, the pipeline generates English subtitles (WebVTT) when possible.
- **Folders:** `/public/videos/` source clips; `/public/frames/[video-id]/` step images; `/public/subtitles/` English VTT files; `/content/data/` technique JSON; `/src/scripts/` Python; `/src/app/` Next.js App Router; `/src/components/` UI (e.g. VideoPlayer, StepDiagram / TechniqueBreakdown).
- **Testing:** Prefer tests for pipeline and critical UI; run before/after risky changes. Type-check and lint where applicable.
