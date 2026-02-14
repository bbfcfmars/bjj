# Dependencies

- **Next.js** — App Router, content-heavy site, revalidation on new content.
- **Tailwind CSS** — Styling; dark gym aesthetic.
- **Lucide React** — Icons.
- **Gemini (google-generativeai)** — Video analysis; technique identification and step timestamps. Default model: gemini-2.5-flash (override with GEMINI_MODEL). Note: google.generativeai is deprecated; consider migrating to google.genai.
- **FFmpeg** — Frame extraction at timestamps for sequential diagrams.
- **Python 3** — Scripts for video processing (Gemini + FFmpeg). Optional: Supabase/Firebase if moving beyond file-based JSON.
