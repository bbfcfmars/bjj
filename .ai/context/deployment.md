# Deployment

- **Hosting:** Vercel or DigitalOcean (per starter). CI/CD on push; build can run Python agent then `next build`.
- **Env:** `GEMINI_API_KEY` (or equivalent) for video analysis; store securely (e.g. env vars, not in repo). See “How do I securely add my Google Gemini API key to this project?” for local and Vercel.
- **Build:** Optional `process_all.py`-style script to process any new videos in `/public/videos/` that lack `/content/data/[id].json`; then `next build`.
