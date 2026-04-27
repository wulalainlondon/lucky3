#!/usr/bin/env python3
"""Slice a painting cover into rows*cols pieces and update meta.json.

Usage:
    python tools/slice_painting.py app/paintings/001
    python tools/slice_painting.py app/paintings/001 --cols 4 --rows 3

Reads <dir>/cover.jpg and <dir>/meta.json. If --cols/--rows not given,
falls back to meta.json. Writes <dir>/pieces/r{r}c{c}.jpg and updates
meta.pieceW / meta.pieceH / meta.totalPieces / meta.orientation to match
the new cover. Cover is first re-saved cropped to a multiple of cols*rows
so pieces tile exactly.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path


def run(cmd):
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        sys.stderr.write(f"command failed: {' '.join(cmd)}\n{res.stderr}\n")
        sys.exit(res.returncode)
    return res.stdout.strip()


def identify(path):
    out = run(["magick", "identify", "-format", "%w %h", str(path)])
    w, h = out.split()
    return int(w), int(h)


def slice_painting(folder: Path, cols: int | None, rows: int | None) -> None:
    cover = folder / "cover.jpg"
    meta_path = folder / "meta.json"
    pieces_dir = folder / "pieces"

    if not cover.exists():
        sys.exit(f"cover.jpg not found in {folder}")
    meta = json.loads(meta_path.read_text()) if meta_path.exists() else {}

    cols = cols or meta.get("cols")
    rows = rows or meta.get("rows")
    if not cols or not rows:
        sys.exit("cols/rows required (pass --cols --rows or set in meta.json)")

    w, h = identify(cover)
    pw, ph = w // cols, h // rows
    new_w, new_h = pw * cols, ph * rows

    if (new_w, new_h) != (w, h):
        run([
            "magick", str(cover),
            "-gravity", "center",
            "-crop", f"{new_w}x{new_h}+0+0",
            "+repage",
            str(cover),
        ])
        print(f"  cover {w}x{h} -> {new_w}x{new_h} (trimmed to multiple of {cols}x{rows})")

    if pieces_dir.exists():
        for f in pieces_dir.glob("*.jpg"):
            f.unlink()
    pieces_dir.mkdir(exist_ok=True)

    for r in range(rows):
        for c in range(cols):
            run([
                "magick", str(cover),
                "-crop", f"{pw}x{ph}+{c*pw}+{r*ph}",
                "+repage",
                str(pieces_dir / f"r{r}c{c}.jpg"),
            ])

    meta["cols"] = cols
    meta["rows"] = rows
    meta["pieceW"] = pw
    meta["pieceH"] = ph
    meta["totalPieces"] = cols * rows
    meta["orientation"] = "landscape" if new_w >= new_h else "portrait"
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n")
    print(f"  pieces: {cols}x{rows} @ {pw}x{ph}px -> {pieces_dir}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder", type=Path, help="painting folder containing cover.jpg + meta.json")
    ap.add_argument("--cols", type=int)
    ap.add_argument("--rows", type=int)
    args = ap.parse_args()
    slice_painting(args.folder, args.cols, args.rows)


if __name__ == "__main__":
    main()
