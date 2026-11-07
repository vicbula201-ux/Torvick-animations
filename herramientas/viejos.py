#!/usr/bin/env python3
"""
viejos.py — para reeditar en el estilo P4 un video vertical que YA trae edicion quemada.

    python3 herramientas/viejos.py <video> [--banda 0.52-0.57] [--contador 0.25,0.0,0.75,0.2] [--out viejos.json]

Busca lo que hay que tapar y lo deja listo para el plan (cambios/<id>/plan.jsx):

  --banda a-b        franja (fraccion del alto) donde estan los subtitulos viejos. Detecta el
                     texto (relleno blanco o amarillo con borde negro), cuadro a cuadro, y
                     devuelve 'tapar': [[ini, fin, x0, x1], ...] en px del lienzo 1080x1920,
                     partido donde cambia el ancho. Va en subs.tapar (con subs.fondo: true y
                     subs.y en el centro de la franja: y = 1920 * (a + b) / 2).
  --contador x0,y0,x1,y1   caja (fracciones) de un contador viejo de repeticiones (digitos
                     blancos con borde negro). Devuelve 'contador': cada cambio de numero con
                     su segundo, para los tiempos de p.contador.

Los memes y las barras de suscripcion no se detectan solos: se miden a ojo (una foto con
grilla) y se tapan con p.tarjeta({ tapa: [x0, y0, x1, y1] }) / p.suscribete({ tapa }). Los
falsos positivos (un poste blanco, una foto) agrandan la barra: revisar la lista.
Necesita ffmpeg y numpy. Detalle del flujo: CAMBIO.md, "Reeditar un video viejo".
"""
import argparse
import json
import subprocess

import numpy as np

ANCHO, ALTO = 1080, 1920


def medidas(video):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate',
                          '-of', 'csv=p=0', video], check=True, capture_output=True, text=True).stdout.strip().split(',')
    a, b = out[2].split('/')
    return int(out[0]), int(out[1]), float(a) / float(b)


def cuadros(video, w, h):
    """los cuadros de a uno (rgb, int16)"""
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', video, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    n = w * h * 3
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        yield np.frombuffer(b, dtype=np.uint8).reshape(h, w, 3).astype(np.int16)
    p.wait()


def texto_con_borde(f, r, amarillo=True, umbral=205):
    """pixeles de relleno claro (blanco o amarillo) con un pixel oscuro a <= r px"""
    mx, mn = f.max(axis=2), f.min(axis=2)
    claro = (mn > umbral) & (mx - mn < 45)
    if amarillo:
        claro |= (f[..., 0] > 200) & (f[..., 1] > 170) & (f[..., 2] < 110)
    oscuro = mx < 70
    d = oscuro.copy()
    for s in range(1, r + 1):
        for k in (-s, s):
            d |= np.roll(oscuro, k, axis=0) | np.roll(oscuro, k, axis=1)
    return claro & d


def tramos_subs(por_cuadro, fps, minimo=6):
    """[(i, x0, x1)] -> tramos [ini, fin, x0, x1] en px del lienzo, partidos donde cambia el ancho"""
    corridas, act = [], []
    for f in por_cuadro:
        if act and f[0] != act[-1][0] + 1:
            corridas.append(act)
            act = []
        act.append(f)
    if act:
        corridas.append(act)
    segs = []
    for c in corridas:
        if len(c) < minimo:
            continue
        cur = [c[0]]
        for f in c[1:]:
            if abs(f[1] - cur[-1][1]) > 0.025 or abs(f[2] - cur[-1][2]) > 0.025:
                segs.append(cur)
                cur = []
            cur.append(f)
        segs.append(cur)
    out = []
    for s in segs:
        t0, t1 = s[0][0] / fps, (s[-1][0] + 1) / fps
        x0, x1 = min(f[1] for f in s), max(f[2] for f in s)
        if out and (len(s) < 4 or out[-1][4] < 4) and abs(out[-1][1] - t0) < 0.04:
            o = out[-1]
            out[-1] = [o[0], t1, min(o[2], x0), max(o[3], x1), o[4] + len(s)]
        else:
            out.append([t0, t1, x0, x1, len(s)])
    return [[round(o[0], 3), round(o[1], 3), int(o[2] * ANCHO), int(np.ceil(o[3] * ANCHO))] for o in out]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('--banda', default='0.52-0.57', help='franja de los subtitulos viejos (fraccion del alto)')
    ap.add_argument('--contador', default=None, help='x0,y0,x1,y1 (fracciones) de un contador viejo')
    ap.add_argument('--out', default=None)
    a = ap.parse_args()
    w, h, fps = medidas(a.video)
    esc = w / 360.0
    r = max(1, int(round(2 * esc)))
    b0, b1 = [float(v) for v in a.banda.split('-')]
    y0, y1 = int(b0 * h), int(b1 * h)
    caja = [float(v) for v in a.contador.split(',')] if a.contador else None

    subs, cont = [], []
    prev, act = None, None
    for i, f in enumerate(cuadros(a.video, w, h)):
        t = texto_con_borde(f[y0:y1], r)
        cols = np.where(t.sum(axis=0) >= 2)[0]
        if len(cols) >= 18 * esc:
            c = cols[(cols >= np.percentile(cols, 2) - 6 * esc) & (cols <= np.percentile(cols, 98) + 6 * esc)]
            subs.append((i, c.min() / w, (c.max() + 1) / w))
        if caja:
            cx0, cy0, cx1, cy1 = int(caja[0] * w), int(caja[1] * h), int(caja[2] * w), int(caja[3] * h)
            m = texto_con_borde(f[cy0:cy1, cx0:cx1], r, amarillo=False, umbral=215)
            if m.sum() < 40 * esc * esc:
                m = None
            cambio = (m is None) != (prev is None) or (m is not None and (m & prev).sum() / max(1, (m | prev).sum()) < 0.55)
            if cambio:
                if act and act[1] - act[0] >= 3:
                    cont.append(act)
                act = None if m is None else [i, i, cx0 + np.where(m)[1].min(), cx0 + np.where(m)[1].max()]
            elif act:
                act[1] = i
            prev = m
    if act and act[1] - act[0] >= 3:
        cont.append(act)

    res = {'tapar': tramos_subs(subs, fps)}
    if caja:
        res['contador'] = [{'ini': round(c[0] / fps, 2), 'fin': round((c[1] + 1) / fps, 2),
                            'x0': int(c[2] * ANCHO / w), 'x1': int(c[3] * ANCHO / w)} for c in cont]
    print('subtitulos viejos: %d tramos (subs.y = %d)' % (len(res['tapar']), round(ALTO * (b0 + b1) / 2)))
    for t in res['tapar']:
        print('  %6.2f-%6.2f  x %4d-%4d' % tuple(t))
    if caja:
        print('contador viejo: %d numeros' % len(res['contador']))
        print('  tiempos:', ', '.join('%.2f' % c['ini'] for c in res['contador']))
    if a.out:
        json.dump(res, open(a.out, 'w'), indent=1)
        print('->', a.out)


if __name__ == '__main__':
    main()
