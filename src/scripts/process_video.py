#!/usr/bin/env python3
"""
Process a single BJJ clip: upload to Gemini, get technique JSON, extract step frames, save to content/data.
Usage: python src/scripts/process_video.py <video_filename>
Example: python src/scripts/process_video.py triangle-choke-from-guard.mp4
"""
import os
import re
import sys
import time
import json
import subprocess
from pathlib import Path

# Load env before importing genai (allows .env without python-dotenv by using shell or manual set)
def _load_env():
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

_load_env()

import google.generativeai as genai

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
VIDEOS_DIR = PROJECT_ROOT / "public" / "videos"
FRAMES_DIR = PROJECT_ROOT / "public" / "frames"
SUBTITLES_DIR = PROJECT_ROOT / "public" / "subtitles"
DATA_DIR = PROJECT_ROOT / "content" / "data"


def timestamp_to_seconds(ts: str) -> int:
    """Convert '00:05' or '1:23' or 5 to seconds."""
    if isinstance(ts, (int, float)):
        return int(ts)
    s = str(ts).strip()
    if ":" in s:
        parts = s.split(":")
        if len(parts) == 2:
            return int(parts[0]) * 60 + int(parts[1])
        if len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
    return int(s) if s.isdigit() else 0


def process_bjj_session(video_filename: str) -> None:
    video_path = VIDEOS_DIR / video_filename
    if not video_path.exists():
        raise FileNotFoundError(f"Video not found: {video_path}")
    video_id = video_path.stem

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set. Copy .env.example to .env and add your key.")

    genai.configure(api_key=api_key)

    # 1. Upload & wait for processing
    print(f"Uploading {video_path}...")
    video_file = genai.upload_file(path=str(video_path))
    while video_file.state.name == "PROCESSING":
        time.sleep(2)
        video_file = genai.get_file(video_file.name)

    model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    model = genai.GenerativeModel(model_name)
    prompt = """
You are a Black Belt BJJ analyst. Analyze this video clip. This site is for English speakers: write ALL text in English only.
Return ONLY a single valid JSON object (no markdown, no code fence) with this exact structure:
{
  "technique_name": "Common English Name",
  "portuguese_name": "Original BJJ term in Portuguese (if applicable)",
  "description": "A 2-3 sentence technical overview in English.",
  "difficulty": "Beginner or Intermediate or Advanced",
  "sequential_diagram_steps": [
    {"timestamp": "0:05", "label": "Short label in English", "detail": "One sentence in English."},
    {"timestamp": "0:08", "label": "Short label in English", "detail": "One sentence in English."},
    {"timestamp": "0:12", "label": "Short label in English", "detail": "One sentence in English."},
    {"timestamp": "0:15", "label": "Short label in English", "detail": "One sentence in English."}
  ]
}
Rules: technique_name, description, and every label and detail MUST be in English. If the video or audio is in Spanish, Portuguese, or any other language, still describe and label everything in English for an English-speaking audience.
Identify exactly 4 key moments: 1. Setup, 2. Connection/Leverage, 3. Execution, 4. Finish. Use timestamp format M:SS or MM:SS.
"""
    response = model.generate_content([video_file, prompt])
    raw = response.text.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```\s*$", "", raw)
    data = json.loads(raw)

    steps = data.get("sequential_diagram_steps") or data.get("steps") or []
    if not steps:
        raise ValueError("No sequential_diagram_steps in model response")

    # 2. Extract frames
    frames_out = FRAMES_DIR / video_id
    frames_out.mkdir(parents=True, exist_ok=True)
    for i, step in enumerate(steps):
        ts = step.get("timestamp", "0")
        sec = timestamp_to_seconds(ts)
        out_path = frames_out / f"step_{i}.jpg"
        subprocess.run(
            [
                "ffmpeg", "-y", "-ss", str(sec), "-i", str(video_path),
                "-frames:v", "1", "-q:v", "2", str(out_path),
            ],
            check=True,
            capture_output=True,
        )
        step["timestamp_seconds"] = sec
        step["image_path"] = f"/frames/{video_id}/step_{i}.jpg"

    # 3. Generate English subtitles for non-English videos (e.g. Spanish)
    data["subtitle_path"] = None
    try:
        sub_prompt = """The audio in this video may be in Spanish, Portuguese, or another language. Transcribe all speech and translate it into English. Return ONLY a valid WebVTT file for English speakers: first line must be WEBVTT, then blank line, then cues like:
00:00.000 --> 00:05.000
English translation of what is said here.

Use proper WebVTT timestamp format (HH:MM:SS.mmm --> HH:MM:SS.mmm). No other text or markdown."""
        sub_response = model.generate_content([video_file, sub_prompt])
        vtt_text = (sub_response.text or "").strip()
        if vtt_text.upper().startswith("WEBVTT") or "--> " in vtt_text:
            if not vtt_text.upper().startswith("WEBVTT"):
                vtt_text = "WEBVTT\n\n" + vtt_text
            SUBTITLES_DIR.mkdir(parents=True, exist_ok=True)
            vtt_path = SUBTITLES_DIR / f"{video_id}.vtt"
            vtt_path.write_text(vtt_text, encoding="utf-8")
            data["subtitle_path"] = f"/subtitles/{video_id}.vtt"
            print(f"Wrote English subtitles: {vtt_path}")
    except Exception as e:
        print(f"Subtitle generation skipped: {e}", file=sys.stderr)

    # 4. Optional enrichment placeholder for webmaster agent
    if "enrichment" not in data:
        data["enrichment"] = None

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    out_json = DATA_DIR / f"{video_id}.json"
    with open(out_json, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Wrote {out_json}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python src/scripts/process_video.py <video_filename>")
        sys.exit(1)
    process_bjj_session(sys.argv[1])
