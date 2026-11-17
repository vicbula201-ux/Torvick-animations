#!/usr/bin/env python3
"""
seguir.py — sigue un objeto del video (el aguacate en la mano, el plato, el envase)
para que su rotulo vaya pegado a el aunque se mueva.

    python3 herramientas/seguir.py cambios/<id>/media/fuente.mp4 --id <id> --nombre aguacate \\
        --en 12.4 --caja 380,900,640,1180 [--desde 11.8] [--hasta 16] [--control hoja.png]

  --en      el segundo donde se marca la caja (un cuadro donde el objeto se vea bien)
  --caja    x0,y0,x1,y1 en pixeles del video (1080x1920 en los cortes de montar.py):
            lo mejor es la parte con textura del objeto (la cara del aguacate, la etiqueta
            del envase), sin fondo
  --desde / --hasta   el tramo a seguir (por defecto, 2 s antes y 4 s despues de --en);
            sigue hacia adelante y hacia atras desde --en
  --modo    flujo (por defecto: puntos de la textura con flujo optico; sigue bien lo que se
            mueve rapido y se acerca o se aleja) o csrt (rastreador CSRT de OpenCV)
  --control una hoja con 8 cuadros y la caja dibujada (amarilla: bien; roja: perdido o
            fuera de cuadro), para revisar a ojo antes de usarlo

Necesita OpenCV (pip install opencv-contrib-python-headless). Trabaja a 640 px de alto,
suaviza el recorrido (el rotulo no tiembla) y guarda todo en cambios/<id>/seguimientos.json
+ seguimientos.js (cambio.html lo carga solo). En el plan:

    p.rotulo(t('aguacate'), t.fin('aguacate') + 1.5, 'Aguacate', { sigue: 'aguacate' })

Las cajas van normalizadas (0..1 del cuadro), una por cuadro a 30 fps desde `ini`:
[cx, cy, ancho, alto, ok]. Donde ok = 0 (perdido o fuera de cuadro) el rotulo se va solo.
"""
import argparse
import json
import os
import subprocess
import sys

import numpy as np

FPS = 30
ALTO = 640


def leer(video, desde, hasta):
    """cuadros [desde, hasta) a 30 fps y 640 px de alto, en BGR (lo que usa OpenCV)"""
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                        '-of', 'csv=p=0', video], capture_output=True, text=True, check=True)
    W, H = [int(x) for x in r.stdout.strip().split(',')[:2]]
    w = int(round(W * ALTO / H / 2)) * 2
    r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', '%.3f' % desde, '-i', video, '-t', '%.3f' % (hasta - desde),
                        '-vf', 'fps=%d,scale=%d:%d' % (FPS, w, ALTO), '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'],
                       capture_output=True, check=True)
    cuadros = np.frombuffer(r.stdout, dtype=np.uint8).reshape(-1, ALTO, w, 3)
    return cuadros, W, H


def rastrear_csrt(cuadros, i0, caja, paso):
    import cv2
    tr = cv2.TrackerCSRT_create()
    x0, y0, x1, y1 = caja
    tr.init(cuadros[i0], (int(x0), int(y0), int(x1 - x0), int(y1 - y0)))
    out = {}
    ultima = (x0, y0, x1 - x0, y1 - y0)
    i = i0 + paso
    while 0 <= i < len(cuadros):
        ok, b = tr.update(cuadros[i])
        ok = bool(ok and b[2] > 2 and b[3] > 2)
        if ok:
            ultima = tuple(float(v) for v in b)
        out[i] = (ultima, ok)
        i += paso
    return out


def puntos(gris, caja, margen=0.12):
    """esquinas con textura dentro de la caja (un poco adentro del borde: sin fondo)"""
    import cv2
    x, y, w, h = caja
    m = np.zeros(gris.shape, np.uint8)
    a0, b0 = int(max(0, x + w * margen)), int(max(0, y + h * margen))
    a1, b1 = int(min(gris.shape[1], x + w * (1 - margen))), int(min(gris.shape[0], y + h * (1 - margen)))
    if a1 - a0 < 4 or b1 - b0 < 4:
        return None
    m[b0:b1, a0:a1] = 255
    return cv2.goodFeaturesToTrack(gris, 300, 0.01, 4, mask=m)


def rastrear_flujo(cuadros, i0, caja, paso):
    """flujo optico (Lucas-Kanade) con ida y vuelta: se mueve con la mediana de los puntos
    buenos y cambia de tamano con la mediana de cuanto se alejan o acercan entre ellos"""
    import cv2
    gris = lambda i: cv2.cvtColor(cuadros[i], cv2.COLOR_BGR2GRAY)
    x0, y0, x1, y1 = caja
    bx = [x0, y0, x1 - x0, y1 - y0]
    prev = gris(i0)
    pts = puntos(prev, bx)
    n0 = 0 if pts is None else len(pts)
    out = {}
    lk = dict(winSize=(21, 21), maxLevel=3, criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 30, 0.01))
    i = i0 + paso
    while 0 <= i < len(cuadros):
        cur = gris(i)
        ok = False
        if pts is not None and len(pts) >= 6:
            nxt, st, _ = cv2.calcOpticalFlowPyrLK(prev, cur, pts, None, **lk)
            vuelta, st2, _ = cv2.calcOpticalFlowPyrLK(cur, prev, nxt, None, **lk)
            err = np.linalg.norm((pts - vuelta).reshape(-1, 2), axis=1)
            bueno = (st.ravel() == 1) & (st2.ravel() == 1) & (err < 1.0)
            if bueno.sum() >= 6:
                p0, p1 = pts.reshape(-1, 2)[bueno], nxt.reshape(-1, 2)[bueno]
                d = np.median(p1 - p0, axis=0)
                # escala: cuanto cambian las distancias entre pares de puntos
                n = len(p0)
                ia = np.random.default_rng(i).integers(0, n, size=min(400, n * n))
                ib = np.random.default_rng(i + 7).integers(0, n, size=len(ia))
                d0 = np.linalg.norm(p0[ia] - p0[ib], axis=1)
                d1 = np.linalg.norm(p1[ia] - p1[ib], axis=1)
                sel = d0 > 8
                s = float(np.clip(np.median(d1[sel] / d0[sel]), 0.92, 1.08)) if sel.sum() > 10 else 1.0
                cx, cy = bx[0] + bx[2] / 2 + d[0], bx[1] + bx[3] / 2 + d[1]
                bx = [cx - bx[2] * s / 2, cy - bx[3] * s / 2, bx[2] * s, bx[3] * s]
                pts = p1.reshape(-1, 1, 2).astype(np.float32)
                ok = True
        # se renuevan los puntos cuando quedan pocos (siempre adentro de la caja)
        if pts is None or len(pts) < max(20, 0.5 * n0):
            nuevos = puntos(cur, bx, 0.2)
            if nuevos is not None:
                pts = nuevos
        dentro = 0 <= bx[0] + bx[2] / 2 <= cur.shape[1] and 0 <= bx[1] + bx[3] / 2 <= cur.shape[0]
        out[i] = (tuple(bx), ok and dentro)
        prev = cur
        i += paso
    return out


def suavizar(serie, ventana):
    """media movil centrada (los bordes con la ventana que entra)"""
    s = np.asarray(serie, dtype=float)
    if len(s) < 3 or ventana < 2:
        return s
    m = ventana // 2
    out = np.empty_like(s)
    for i in range(len(s)):
        a, b = max(0, i - m), min(len(s), i + m + 1)
        out[i] = s[a:b].mean()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('--id', required=True)
    ap.add_argument('--nombre', required=True)
    ap.add_argument('--en', type=float, required=True)
    ap.add_argument('--caja', required=True)
    ap.add_argument('--desde', type=float)
    ap.add_argument('--hasta', type=float)
    ap.add_argument('--modo', choices=['flujo', 'csrt'], default='flujo')
    ap.add_argument('--control')
    a = ap.parse_args()

    desde = max(0.0, a.desde if a.desde is not None else a.en - 2)
    hasta = a.hasta if a.hasta is not None else a.en + 4
    desde = round(desde * FPS) / FPS
    cuadros, W, H = leer(a.video, desde, hasta)
    if not len(cuadros):
        sys.exit('no hay cuadros en ese tramo')
    k = ALTO / H
    caja = [float(v) * k for v in a.caja.split(',')]
    i0 = min(len(cuadros) - 1, max(0, int(round((a.en - desde) * FPS))))

    rastrear = rastrear_flujo if a.modo == 'flujo' else rastrear_csrt
    res = dict(rastrear(cuadros, i0, caja, 1))
    res.update(rastrear(cuadros, i0, caja, -1))
    res[i0] = ((caja[0], caja[1], caja[2] - caja[0], caja[3] - caja[1]), True)
    orden = [res[i] for i in range(len(cuadros))]
    oks = [1 if o[1] else 0 for o in orden]
    # un cuadro perdido suelto entre buenos no cuenta (el rotulo no parpadea)
    for i in range(1, len(oks) - 1):
        if not oks[i] and oks[i - 1] and oks[i + 1]:
            oks[i] = 1
    cajas = [o[0] for o in orden]
    cx = suavizar([b[0] + b[2] / 2 for b in cajas], 5)
    cy = suavizar([b[1] + b[3] / 2 for b in cajas], 5)
    bw = suavizar([b[2] for b in cajas], 11)
    bh = suavizar([b[3] for b in cajas], 11)
    wk = cuadros.shape[2]
    norm = [[round(cx[i] / wk, 4), round(cy[i] / ALTO, 4), round(bw[i] / wk, 4), round(bh[i] / ALTO, 4), oks[i]]
            for i in range(len(cajas))]

    carpeta = os.path.join('cambios', a.id)
    os.makedirs(carpeta, exist_ok=True)
    fj = os.path.join(carpeta, 'seguimientos.json')
    todo = json.load(open(fj)) if os.path.exists(fj) else {}
    todo[a.nombre] = {'fps': FPS, 'ini': round(desde, 3), 'cajas': norm}
    json.dump(todo, open(fj, 'w'), ensure_ascii=False)
    with open(os.path.join(carpeta, 'seguimientos.js'), 'w') as fh:
        fh.write('/* GENERADO por herramientas/seguir.py — no editar a mano. */\n')
        fh.write('window.SEGUIMIENTOS = window.SEGUIMIENTOS || {};\n')
        fh.write('window.SEGUIMIENTOS[%s] = %s;\n' % (json.dumps(a.id), json.dumps(todo, ensure_ascii=False)))

    if a.control:
        import cv2
        idx = np.linspace(0, len(cuadros) - 1, 8).round().astype(int)
        tiras = []
        for i in idx:
            im = cuadros[i].copy()
            c = norm[i]
            x0, y0 = int((c[0] - c[2] / 2) * wk), int((c[1] - c[3] / 2) * ALTO)
            x1, y1 = int((c[0] + c[2] / 2) * wk), int((c[1] + c[3] / 2) * ALTO)
            cv2.rectangle(im, (x0, y0), (x1, y1), (0, 212, 255) if c[4] else (47, 58, 224), 3)
            cv2.putText(im, '%.2f' % (desde + i / FPS), (8, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
            tiras.append(cv2.resize(im, (wk // 2, ALTO // 2)))
        cv2.imwrite(a.control, np.hstack(tiras))

    malos = [i for i, c in enumerate(norm) if not c[4]]
    aviso = ''
    if malos:
        aviso = ' · perdido o fuera de cuadro en %d cuadros (%.2f-%.2f s): el rotulo se va ahi' % (
            len(malos), desde + malos[0] / FPS, desde + malos[-1] / FPS)
    print('%s: %d cuadros (%.2f-%.2f s), modo %s%s' % (a.nombre, len(norm), desde, desde + len(norm) / FPS, a.modo, aviso))


if __name__ == '__main__':
    main()
