# Decisions (ADR log)

| Date       | Decision | Options considered | Outcome |
|------------|----------|---------------------|---------|
| 2025-02-13 | Gemini model for video analysis | gemini-1.5-pro (404 on current API), gemini-2.5-flash, gemini-2.5-pro | Use gemini-2.5-flash by default; GEMINI_MODEL env override. Script run in-repo; console showed 404 for 1.5-pro, fixed. |

Use this table to log architecture and product decisions (e.g. “Store technique metadata as JSON files”, “Use Gemini for video analysis”, “Enrichment stored in …”).
