#!/usr/bin/env bash
# build-native.sh — prepare www/ and sync to Capacitor native projects
# Usage:
#   ./tools/build-native.sh         # sync only
#   ./tools/build-native.sh ios     # sync + open Xcode
#   ./tools/build-native.sh android # sync + open Android Studio

set -e
cd "$(dirname "$0")/.."

# Verify fonts are present (P1 requirement)
FONTS_DIR="www/fonts"
REQUIRED_FONTS=(
  "cinzel-700.woff2"
  "cinzel-900.woff2"
  "cinzel-dec-700.woff2"
  "cinzel-dec-900.woff2"
)
MISSING=0
for f in "${REQUIRED_FONTS[@]}"; do
  if [ ! -f "$FONTS_DIR/$f" ]; then
    echo "MISSING font: $FONTS_DIR/$f"
    MISSING=1
  fi
done
if [ $MISSING -eq 1 ]; then
  echo "Run: node tools/download-fonts.js  (or re-download manually)"
  exit 1
fi

# Verify www/index.html uses local fonts (P2 check)
if grep -q "fonts.googleapis.com" www/index.html; then
  echo "WARNING: www/index.html still references Google Fonts CDN"
  echo "This will fail offline on native. Replace with local @font-face."
  exit 1
fi

echo "Syncing to Capacitor native projects..."
npx cap sync

TARGET="${1:-}"
if [ "$TARGET" = "ios" ]; then
  echo "Opening Xcode..."
  npx cap open ios
elif [ "$TARGET" = "android" ]; then
  echo "Opening Android Studio..."
  npx cap open android
else
  echo "Done. Run with 'ios' or 'android' to open the IDE."
fi
