# Known Issues

- **Next.js:** Run `npm audit` and upgrade to the latest patched 15.x if advisories apply (e.g. security-update-2025-12-11).
- **Python hashlib (blake2b/blake2s):** On some pyenv/OpenSSL setups, pip or imports may log hashlib errors; they are environmental and do not block the script.
- **google.generativeai deprecation:** Package is deprecated in favor of `google.genai`. Script works; migrate when convenient.
- Add agent misidentifications, missing enrichment, or deploy issues here as they come up.
