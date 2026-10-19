#!/usr/bin/env python3
"""
recortar.py — separa a la persona del fondo para poner textos DETRAS de ella
(el efecto de Jeff Nippard). Usa Robust Video Matting (MIT), que mira los
cuadros anteriores y por eso el borde no tiembla.

    python3 herramientas/recortar.py <video> --tramos 12.5-15,80-83.2 --out largos/<id>/media/recorte

Deja una mascara por cuadro (PNG en grises, blanco = persona) con el numero de
cuadro del video a 30 fps: 000375.png es el segundo 12.5. Las que ya existen no
se vuelven a calcular. grabar-largo.js lo llama solo con los tramos que pide el
plan (p.detras), asi que normalmente no hace falta correrlo a mano.

La primera vez baja el modelo (15 MB) de GitHub a ~/.torvick/modelos/.
Necesita python3 con numpy y onnxruntime (pip install onnxruntime) y ffmpeg.
"""
import argparse
import os
import subprocess
import sys
import urllib.request

import numpy as np

FPS = 30
URL = 'https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.onnx'
PREVIO = 1.5   # segundos que mira antes de cada tramo para que el borde arranque estable


def modelo(ruta):
    if not os.path.exists(ruta):
        os.makedirs(os.path.dirname(ruta), exist_ok=True)
        print('bajando el modelo de recorte a', ruta)
        urllib.request.urlretrieve(URL, ruta + '.tmp')
        os.replace(ruta + '.tmp', ruta)
    import onnxruntime as ort
    return ort.InferenceSession(ruta, providers=['CPUExecutionProvider'])


def medidas(video):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                          '-of', 'csv=p=0', video], check=True, capture_output=True, text=True).stdout
    w, h = [int(v) for v in out.strip().split(',')[:2]]
    return w, h


def tramo(sesion, video, a, b, out, alto, ancho_src, alto_src):
    h = alto
    w = int(round(ancho_src * h / alto_src / 2)) * 2
    i0, i1 = int(round(a * FPS)), int(round(b * FPS))
    faltan = [i for i in range(i0, i1 + 1) if not os.path.exists(os.path.join(out, '%06d.png' % i))]
    if not faltan:
        return 0
    desde = max(0.0, a - PREVIO)
    j0 = int(round(desde * FPS))
    n = i1 - j0 + 1
    lector = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', '%.4f' % (j0 / FPS), '-i', video, '-frames:v', str(n),
                               '-vf', 'fps=%d,scale=%d:%d:flags=area' % (FPS, w, h), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                              stdout=subprocess.PIPE)
    escritor = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', '%dx%d' % (w, h),
                                 '-r', str(FPS), '-i', '-', '-start_number', str(i0), os.path.join(out, '%06d.png')],
                                stdin=subprocess.PIPE)
    # resolucion interna de la red: ~512 px de ancho (lo que recomienda RVM)
    ratio = np.array([min(1.0, 512.0 / w)], dtype=np.float32)
    rec = [np.zeros((1, 1, 1, 1), dtype=np.float32)] * 4
    hechos = 0
    for j in range(j0, i1 + 1):
        crudo = lector.stdout.read(w * h * 3)
        if len(crudo) < w * h * 3:
            break
        src = np.frombuffer(crudo, dtype=np.uint8).reshape(h, w, 3).astype(np.float32).transpose(2, 0, 1)[None] / 255.0
        fgr, pha, *rec = sesion.run(None, {'src': src, 'r1i': rec[0], 'r2i': rec[1], 'r3i': rec[2], 'r4i': rec[3],
                                           'downsample_ratio': ratio})
        if j >= i0:
            m = np.clip(pha[0, 0] * 255.0 + 0.5, 0, 255).astype(np.uint8)
            escritor.stdin.write(m.tobytes())
            hechos += 1
    lector.stdout.close()
    lector.wait()
    escritor.stdin.close()
    escritor.wait()
    return hechos


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('--tramos', required=True, help='a-b,c-d en segundos')
    ap.add_argument('--out', required=True)
    ap.add_argument('--alto', type=int, default=720, help='alto de las mascaras (por defecto 720)')
    ap.add_argument('--modelo', default=os.path.expanduser('~/.torvick/modelos/rvm_mobilenetv3_fp32.onnx'))
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    tramos = []
    for t in a.tramos.split(','):
        if t.strip():
            x, y = t.split('-')
            tramos.append((float(x), float(y)))
    sesion = modelo(a.modelo)
    w, h = medidas(a.video)
    total = 0
    for x, y in sorted(tramos):
        total += tramo(sesion, a.video, x, y, a.out, min(a.alto, h), w, h)
        print('recorte %.2f-%.2f listo' % (x, y), file=sys.stderr)
    print('mascaras nuevas:', total)


if __name__ == '__main__':
    main()
