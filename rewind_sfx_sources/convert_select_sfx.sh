#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RAW_DIR="$ROOT_DIR/rewind_sfx_sources/raw"
OUT_DIR="$ROOT_DIR/app/sounds"

# Put your downloaded sources here:
#   rewind_sfx_sources/raw/select_low.*
#   rewind_sfx_sources/raw/select_mid.*
#   rewind_sfx_sources/raw/select_ok_high.*
#   rewind_sfx_sources/raw/select_fail_low.*

require_tool() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required tool: $1" >&2
    exit 1
  }
}

pick_file() {
  local stem="$1"
  local f
  for f in "$RAW_DIR/${stem}.wav" "$RAW_DIR/${stem}.mp3" "$RAW_DIR/${stem}.ogg" "$RAW_DIR/${stem}.flac" "$RAW_DIR/${stem}.m4a"; do
    if [[ -f "$f" ]]; then
      echo "$f"
      return 0
    fi
  done
  return 1
}

convert_to_ogg() {
  local in_file="$1"
  local out_file="$2"
  # Normalize to practical mobile game loudness, keep short tails, mono for consistency.
  ffmpeg -y -i "$in_file" \
    -af "highpass=f=90,lowpass=f=10000,loudnorm=I=-14:TP=-1.5:LRA=7,atrim=0:0.7,afade=t=out:st=0.58:d=0.12" \
    -ac 1 -ar 48000 -c:a libvorbis -q:a 5 "$out_file" >/dev/null 2>&1
}

require_tool ffmpeg

low_src="$(pick_file select_low || true)"
mid_src="$(pick_file select_mid || true)"
ok_src="$(pick_file select_ok_high || true)"
fail_src="$(pick_file select_fail_low || true)"

if [[ -z "$low_src" || -z "$mid_src" || -z "$ok_src" || -z "$fail_src" ]]; then
  echo "Missing source files in $RAW_DIR" >&2
  echo "Required stems: select_low, select_mid, select_ok_high, select_fail_low" >&2
  exit 1
fi

convert_to_ogg "$low_src" "$OUT_DIR/cardSelect1.ogg"
convert_to_ogg "$mid_src" "$OUT_DIR/cardSelect2.ogg"
convert_to_ogg "$ok_src" "$OUT_DIR/cardSelectOK.ogg"
convert_to_ogg "$fail_src" "$OUT_DIR/cardSelectFail.ogg"

echo "Done. Updated:"
echo "  $OUT_DIR/cardSelect1.ogg"
echo "  $OUT_DIR/cardSelect2.ogg"
echo "  $OUT_DIR/cardSelectOK.ogg"
echo "  $OUT_DIR/cardSelectFail.ogg"
