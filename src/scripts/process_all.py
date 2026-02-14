#!/usr/bin/env python3
"""
Process all videos in public/videos that don't yet have content/data/[id].json.
Run from project root. Used by build or manually.
"""
import os
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
VIDEOS_DIR = PROJECT_ROOT / "public" / "videos"
DATA_DIR = PROJECT_ROOT / "content" / "data"
SCRIPT = PROJECT_ROOT / "src" / "scripts" / "process_video.py"


def build_library() -> None:
    if not VIDEOS_DIR.exists():
        return
    videos = [f.name for f in VIDEOS_DIR.iterdir() if f.suffix.lower() in (".mp4", ".mov")]
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    for video in videos:
        video_id = video.rsplit(".", 1)[0]
        if not (DATA_DIR / f"{video_id}.json").exists():
            print(f"Agent is analyzing: {video}")
            rc = subprocess.run([sys.executable, str(SCRIPT), video], cwd=str(PROJECT_ROOT))
            if rc.returncode != 0:
                print(f"Warning: process_video.py failed for {video}", file=sys.stderr)


if __name__ == "__main__":
    build_library()
