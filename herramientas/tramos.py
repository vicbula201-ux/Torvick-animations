#!/usr/bin/env python3
"""
tramos.py — para reeditar un video que YA tiene edicion encima (como disciplina):
marca en que tramos se ve la camara y en cuales hay un inserto viejo, para que el
plan nuevo los tape todos.

    python3 herramientas/tramos.py video.mp4 --camara 0-4,12-14 --out largos/<id>/fuente-tramos.json

--camara: dos o mas tramos (segundos) donde se ve la camara limpia; sirven de
referencia de color. Cada cuadro (10 por segundo) queda como:
  C camara · B inserto blanco · N inserto negro · O otro (clip de archivo, captura)
Con el video crudo (sin edicion) no hace falta.
"""
import argparse
import json
import subprocess

import numpy as np

W, H = 64, 36


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('--camara', required=True)
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    crudo = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.video, '-an', '-vf', 'fps=10,scale=%d:%d:flags=area' % (W, H),
                            '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    x = np.frombuffer(crudo, dtype=np.uint8).reshape(-1, H, W, 3).astype(np.int32)
    q = x // 64
    idx = q[..., 0] * 16 + q[..., 1] * 4 + q[..., 2]
    hist = np.stack([np.bincount(f.ravel(), minlength=64) for f in idx]).astype(float)
    hist /= hist.sum(1, keepdims=True)
    refs = [tuple(float(v) for v in r.split('-')) for r in a.camara.split(',')]
    ref = np.mean([hist[int(i * 10):int(j * 10)].mean(0) for i, j in refs], axis=0)
    sim = np.minimum(hist, ref).sum(1)
    blanco = (x.min(-1) > 225).mean((1, 2))
    negro = (x.max(-1) < 40).mean((1, 2))
    cls = np.where(blanco > 0.5, 'B', np.where(negro > 0.6, 'N', np.where(sim > 0.55, 'C', 'O')))
    tramos = []
    i = 0
    while i < len(cls):
        j = i
        while j < len(cls) and cls[j] == cls[i]:
            j += 1
        c, ini, fin = str(cls[i]), i / 10, j / 10
        if tramos and (fin - ini < 0.3 or tramos[-1][0] == c):
            tramos[-1][2] = fin
        else:
            tramos.append([c, ini, fin])
        i = j
    with open(a.out, 'w') as fh:
        json.dump([[c, round(s, 2), round(e, 2)] for c, s, e in tramos], fh)
    print(a.out, len(tramos), 'tramos;', 'camara %.0f%%' % (100 * (cls == 'C').mean()))


if __name__ == '__main__':
    main()
