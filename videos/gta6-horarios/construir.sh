#!/usr/bin/env bash
# construir.sh — render completo: video (4 procesos) + audio (-16 LUFS) + MP4 final + verificación.
#   ./construir.sh          versión completa (92,5 s)
#   ./construir.sh corto    versión de 30 s
# Requisitos: node con playwright, python3 con numpy, ffmpeg/ffprobe.
set -euo pipefail
cd "$(dirname "$0")"
V="${1:-completo}"
SUF=""; [ "$V" != "completo" ] && SUF="-$V"
FINAL="salida/gta6-a-que-hora-sale-modo-vice$SUF.mp4"

echo "1/4  Render de cuadros ($V)…"
node render.js --version "$V"

echo "2/4  Audio (música + efectos desde salida/cues$SUF.json)…"
python3 audio.py "$V"

echo "3/4  MP4 final…"
ffmpeg -hide_banner -loglevel error -y -i "salida/video-sin-audio$SUF.mp4" -i "salida/audio$SUF.wav" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$FINAL"

echo "4/4  Verificación"
ffprobe -v error -select_streams v:0 -count_packets \
  -show_entries stream=width,height,r_frame_rate,nb_read_packets,pix_fmt -show_entries format=duration,size \
  -of default=noprint_wrappers=1 "$FINAL"
ffmpeg -hide_banner -nostats -i "$FINAL" -map 0:a -af ebur128=peak=true -f null - 2>&1 \
  | sed -n '/Summary/,$p' | grep -E "I:|LRA:|Peak:" || true
echo "Listo: $FINAL  y  salida/miniatura$SUF.png"
