#!/usr/bin/env python3
"""
montar.py — arma el corte de un video vertical a partir de las tomas en bruto
(cuando el autor manda el video sin cortar).

    python3 herramientas/montar.py cambios/<id>/corte.json

corte.json:
  {
    "salida": "cambios/<id>/media/fuente.mp4",
    "transcripcion": "cambios/<id>/transcripcion.json",   # la del corte (se escribe)
    "tomas": {
      "1": { "video": ".../toma1.mp4", "transcripcion": ".../t1/transcripcion.json" },
      "2": { "video": ".../toma2.mp4", "transcripcion": ".../t2/transcripcion.json" }
    },
    "encuadre": [600, 1067, 332, 623],      # recorte [ancho, alto, x, y] de la toma; sale en 1080x1920
    "piezas": [ ["1", 15.86, 19.22], ["1", 19.54, 20.58], ... ],   # en orden; segundos de la toma
    "cola": 3.2,                            # segundos de imagen despues de la ultima pieza (para la firma)
    "corregir": { "cotidiaridad": "cotidianidad" },
    "minusculas": true                      # subtitulos en minuscula, como se habla (por defecto)
  }

Cada pieza va del inicio de su primera palabra al final de la ultima (los
tiempos de transcripcion.json). La herramienta:
  - agrega un colchon de 0,12 s a cada lado sin comerse la palabra vecina, y
    recorta el final si la palabra "dura" mas de lo que suena (nivel del audio);
  - acorta a 0,24 s los silencios de mas de 0,4 s que quedan adentro de una pieza;
  - redondea los cortes a cuadros de 1/30 s (video y audio no se corren);
  - iguala el volumen de habla de las tomas y funde 8 ms en cada corte;
  - encuadra, escala a 1080x1920 (lanczos) a 30 fps y escribe el MP4;
  - traslada las palabras al tiempo del corte y escribe la transcripcion nueva
    (.json, .txt y .js, como transcribir.py) y un informe <salida>.txt.

Necesita ffmpeg y python3 con numpy.
"""
import json
import os
import subprocess
import sys

import numpy as np

SR = 16000
PASO = 0.01          # 10 ms por cuadro de nivel
FPS = 30
COLCHON = 0.12
SIL_MAX = 0.40
SIL_DEJA = 0.12      # a cada lado del silencio que se acorta


def niveles(video):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', video, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                       capture_output=True, check=True)
    x = np.frombuffer(r.stdout, dtype=np.int16).astype(np.float32) / 32768
    n = int(SR * PASO)
    fr = x[:len(x) // n * n].reshape(-1, n)
    return 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9)


def voz(db):
    """cuadros con voz: por encima del piso de ruido + 7 dB, con 60 ms de arrastre"""
    umbral = np.percentile(db, 10) + 7
    v = db > umbral
    k = 6
    v2 = v.copy()
    for s in range(1, k + 1):
        v2[s:] |= v[:-s]
        v2[:-s] |= v[s:]
    return v2, umbral


def redondear(t):
    return round(t * FPS) / FPS


def main():
    cfg = json.load(open(sys.argv[1]))
    corregir = cfg.get('corregir', {})
    tomas = {}
    for k, tm in cfg['tomas'].items():
        db = niveles(tm['video'])
        v, umbral = voz(db)
        tr = json.load(open(tm['transcripcion']))
        hablado = db[v]
        tomas[k] = {'video': tm['video'], 'db': db, 'voz': v, 'umbral': umbral,
                    'palabras': tr['palabras'], 'nivel': float(np.median(hablado)) if len(hablado) else -30.0}
    ref = max(t['nivel'] for t in tomas.values())
    for t in tomas.values():
        t['ganancia'] = ref - t['nivel']

    # ---- cada pieza: colchon, final por nivel, silencios internos ----
    tramos = []   # (toma, a, b) ya en segundos de la toma
    for toma, ini, fin in cfg['piezas']:
        t = tomas[str(toma)]
        pal = t['palabras']
        antes = [w['fin'] for w in pal if w['fin'] <= ini + 0.01]
        despues = [w['ini'] for w in pal if w['ini'] >= fin - 0.01]
        a = max(ini - COLCHON, (max(antes) + 0.03) if antes else 0)
        b_lim = (min(despues) - 0.03) if despues else len(t['db']) * PASO
        # final: el ultimo cuadro con voz antes de fin + colchon (la ultima palabra no "dura" mas de 0,9 s:
        # la transcripcion a veces la estira sobre el silencio que sigue)
        ult = [w for w in pal if ini - 0.01 <= w['ini'] < fin]
        if ult:
            fin = min(fin, max(w['ini'] for w in ult) + 0.9)
        i0, i1 = int(ini / PASO), int(min(fin + COLCHON, b_lim) / PASO)
        idx = np.nonzero(t['voz'][i0:i1])[0]
        ultimo = (i0 + idx[-1]) * PASO if len(idx) else fin
        b = min(max(ultimo + 0.06, min(fin, ultimo + 0.06)), b_lim)
        b = min(b, fin + COLCHON)
        # silencios internos largos
        cortes = []
        ia, ib = int(a / PASO), int(b / PASO)
        seg = t['voz'][ia:ib].copy()
        # nunca se corta dentro de una palabra (las suaves quedan bajo el umbral)
        for w in pal:
            c0, c1 = w['ini'] - 0.04, min(w['fin'], w['ini'] + 0.9) + 0.04
            if c1 > a and c0 < b:
                seg[max(0, int(c0 / PASO) - ia):max(0, int(c1 / PASO) - ia)] = True
        j = 0
        while j < len(seg):
            if not seg[j]:
                k = j
                while k < len(seg) and not seg[k]:
                    k += 1
                largo = (k - j) * PASO
                if largo > SIL_MAX and j > 0 and k < len(seg):
                    cortes.append(((ia + j) * PASO + SIL_DEJA, (ia + k) * PASO - SIL_DEJA))
                j = k
            else:
                j += 1
        # y los huecos entre palabras de la transcripcion (ahi suena el perro, la calle, la respiracion)
        dentro = sorted((w['ini'], min(w['fin'], w['ini'] + 0.9)) for w in pal if w['ini'] >= a - 0.01 and w['ini'] < b)
        for (p0, p1), (q0, q1) in zip(dentro, dentro[1:]):
            if q0 - p1 > SIL_MAX:
                cortes.append((p1 + SIL_DEJA, q0 - 0.10))
        cortes.sort()
        unidos = []
        for c0, c1 in cortes:
            if c1 - c0 < 0.05:
                continue
            if unidos and c0 <= unidos[-1][1]:
                unidos[-1] = (unidos[-1][0], max(unidos[-1][1], c1))
            else:
                unidos.append((c0, c1))
        cortes = unidos
        x = a
        for c0, c1 in cortes:
            tramos.append((str(toma), x, c0))
            x = c1
        tramos.append((str(toma), x, b))

    # cola para la firma
    if cfg.get('cola'):
        toma, _, _ = cfg['piezas'][-1]
        ta, tb = tramos[-1][1], tramos[-1][2]
        tramos[-1] = (tramos[-1][0], ta, tb + float(cfg['cola']))

    # redondear a cuadros y descartar lo que quedo vacio
    piezas = []
    for toma, a, b in tramos:
        a, b = redondear(a), redondear(b)
        if b - a >= 1.0 / FPS:
            piezas.append((toma, a, b))

    # ---- video: pieza por pieza (poca memoria) y despues se unen ----
    nombres = sorted(tomas)
    w, h, x0, y0 = cfg.get('encuadre', [1080, 1920, 0, 0])
    tmp = cfg['salida'] + '.piezas'
    os.makedirs(tmp, exist_ok=True)
    lista = []
    for i, (toma, a, b) in enumerate(piezas):
        d = b - a
        cuadros = int(round(d * FPS))
        g = tomas[toma]['ganancia']
        f = os.path.join(tmp, '%04d.mkv' % i)
        vf = 'fps=%d,crop=%d:%d:%d:%d,scale=1080:1920:flags=lanczos,setsar=1' % (FPS, w, h, x0, y0)
        af = ('aresample=48000,aformat=sample_rates=48000:channel_layouts=stereo,volume=%.2fdB,'
              'afade=t=in:d=0.008,afade=t=out:st=%.4f:d=0.008,apad,atrim=end=%.4f' % (g, max(0, d - 0.008), cuadros / FPS))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '%.4f' % a, '-i', tomas[toma]['video'], '-t', '%.4f' % (d + 0.2),
                        '-vf', vf, '-af', af, '-frames:v', str(cuadros), '-r', str(FPS),
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p',
                        '-c:a', 'pcm_s16le', f], check=True)
        lista.append("file '%s'" % os.path.abspath(f))
        print('\r  pieza %d/%d' % (i + 1, len(piezas)), end='', flush=True)
    print()
    fl = os.path.join(tmp, 'lista.txt')
    open(fl, 'w').write('\n'.join(lista) + '\n')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', fl,
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', cfg['salida']], check=True)
    for x in os.listdir(tmp):
        os.remove(os.path.join(tmp, x))
    os.rmdir(tmp)
    piezas = [(t, a, a + round((b - a) * FPS) / FPS) for t, a, b in piezas]

    # ---- transcripcion trasladada ----
    # cada palabra va una sola vez: a la pieza que mas cubre su nucleo
    duena = {}
    for n, (toma, a, b) in enumerate(piezas):
        for i, wd in enumerate(tomas[toma]['palabras']):
            c0, c1 = wd['ini'], min(wd['fin'], wd['ini'] + 0.9)
            ov = min(b, c1) - max(a, c0)
            if ov > 0.02 and ov > duena.get((toma, i), (None, 0))[1]:
                duena[(toma, i)] = (n, ov)
    nuevas, informe, pos = [], [], 0.0
    for n, (toma, a, b) in enumerate(piezas):
        for i, wd in enumerate(tomas[toma]['palabras']):
            if duena.get((toma, i), (None,))[0] == n:
                p = wd['p']
                for mal, bien in corregir.items():
                    if p.lower().strip('.,;:¿?¡!…') == mal.lower():
                        p = p.replace(mal, bien).replace(mal.capitalize(), bien.capitalize())
                if cfg.get('minusculas', True):
                    p = p.lower()
                ni = pos + max(0.0, wd['ini'] - a)
                nf = pos + min(b - a, wd['fin'] - a)
                nuevas.append({'p': p, 'ini': round(ni, 3), 'fin': round(max(nf, ni + 0.05), 3)})
        informe.append(f'{pos:7.2f}  toma {toma}  {a:7.2f} - {b:7.2f}  ({b - a:4.2f} s)')
        pos += b - a
    for i in range(len(nuevas) - 1):
        if nuevas[i]['fin'] > nuevas[i + 1]['ini']:
            nuevas[i]['fin'] = max(nuevas[i]['ini'] + 0.04, nuevas[i + 1]['ini'])
    # frases: se corta en la puntuacion fuerte o en silencios de 0,35 s
    frases, cur = [], []
    for i, wd in enumerate(nuevas):
        cur.append(wd)
        fin_frase = wd['p'].rstrip().endswith(('.', '?', '!', '…'))
        hueco = i + 1 < len(nuevas) and nuevas[i + 1]['ini'] - wd['fin'] > 0.35
        if fin_frase or hueco or i == len(nuevas) - 1:
            frases.append({'ini': cur[0]['ini'], 'fin': cur[-1]['fin'], 'texto': ' '.join(x['p'] for x in cur)})
            cur = []
    tr = {'dur': round(pos, 3), 'palabras': nuevas, 'frases': frases}
    out = cfg['transcripcion']
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
    json.dump(tr, open(out, 'w'), ensure_ascii=False, indent=1)
    fmt = lambda s: '%02d:%05.2f' % (int(s // 60), s - 60 * int(s // 60))
    with open(os.path.splitext(out)[0] + '.txt', 'w') as fh:
        for f in frases:
            fh.write('[%s - %s] %s\n' % (fmt(f['ini']), fmt(f['fin']), f['texto']))
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    subprocess.run([sys.executable, os.path.join(raiz, 'herramientas', 'transcribir.py'), '--solo-js', '--out', out, cfg['salida']], check=True)

    sil = sum(1 for i in range(len(nuevas) - 1) if nuevas[i + 1]['ini'] - nuevas[i]['fin'] > 0.5)
    resumen = (f'{len(piezas)} cortes, {pos:.1f} s, {len(nuevas)} palabras '
               f'({len(nuevas) / max(pos, 1) * 60:.0f} por minuto), {sil} huecos de mas de 0,5 s; '
               + ', '.join(f'toma {k}: {t["ganancia"]:+.1f} dB' for k, t in sorted(tomas.items())))
    open(cfg['salida'] + '.txt', 'w').write(resumen + '\n\n' + '\n'.join(informe) + '\n')
    print(resumen)


if __name__ == '__main__':
    main()
