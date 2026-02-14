# BJJ Video Journal

AI-automated technical library from BJJ training footage, **in English**. Editor agent → clips; video agent (Gemini) → technique JSON + frames (all text in English); optional English subtitles for Spanish/non-English videos; webmaster agent → enrichment (diagrams, refs).

## Two-step workflow

1. **Drop video:** Put edited .mp4/.mov in `public/videos/` (kebab-case names).
2. **Run agent:** `python src/scripts/process_video.py your-clip.mp4` (or push and let build run `process_all.py`).

Site builds from `content/data/*.json`. No code needed to add a post. (The sample-armbar entry is placeholder data; add `public/videos/sample-armbar.mp4` if you want its video to play.)

**Static diagram instructions:** Edit `content/diagram-mapping.json` (keys = technique name in English, values = array of `{ url, caption?, source? }`). Run `node src/scripts/import-diagrams.js` to merge into technique enrichment. Inspiration URLs are in `_notes/bjj-starter.md` (lines 344–361).

## Setup

- **Node:** `npm install` then `npm run dev` or `npm run build`.
- **Python:** `pip install -r requirements.txt`. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`. Get a key at [Google AI Studio](https://aistudio.google.com/apikey).
- **FFmpeg:** Required for frame extraction; must be on `PATH`.

## Troubleshooting

If the agent misidentifies a move: edit `content/data/[video-id].json` (e.g. `technique_name`, `description`), save, and rebuild.

## Architecture

| Layer        | Path / tech                          |
|-------------|--------------------------------------|
| Videos      | `public/videos/`                     |
| Frames      | `public/frames/[video-id]/`          |
| Knowledge   | `content/data/*.json`                |
| Frontend    | Next.js + Tailwind (dark gym theme)  |

## AI IDE

For new features: *"Refer to README and .ai/context. Add [feature]. Keep JSON-driven; no crash when JSON is missing."*
