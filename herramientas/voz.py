#!/usr/bin/env python3
"""
voz.py — calza un reel con la voz grabada (lo usa herramientas/grabar.js --voz).

    python3 herramientas/voz.py --voz grabacion.m4a --guion guion.json
                                --out voz.json --wav voz.wav [--informe informe.txt]

guion.json = [{"nombre", "dur", "vo"}, ...]: las escenas del reel en orden, la ultima
es el cierre de marca (lo deja grabar.js a partir de window.REEL.guion).

La grabacion es UNA toma con todas las lineas del guion leidas en orden y una pausa
entre linea y linea (medio segundo o mas). No hace falta reconocer palabras: se buscan
las pausas y se eligen las que mejor reparten la grabacion entre las lineas segun lo
largas que son (en silabas). Cada escena dura lo que dura su linea, y la escena nueva
entra un instante antes de que empiece su linea.

Salida:
  voz.wav     la voz recortada a la linea de tiempo del video (mono, 48 kHz), con un
              poco de aire al principio y rellena con silencio hasta el final
  voz.json    { "durs": [...], "total", "offset", "tramos": [...], "avisos": [...] }
  informe     el mismo resumen en texto, para leerlo

No cambia la voz: no la acelera, no la corta por dentro ni le pone efectos. El volumen
lo nivela audio.py al mezclar. Solo necesita numpy y ffmpeg.
"""
import argparse
import json
import math
import re
import subprocess
import sys
import tempfile
import wave
import os

import numpy as np

SR = 48000
HOP = 0.01            # 10 ms por cuadro de energia
MIN_PAUSA = 0.22      # una pausa mas corta no separa lineas
HUECO_PALABRA = 0.12  # silencios mas cortos son parte de la frase
AIRE_INICIO = 0.2     # silencio antes de la primera palabra
ANTICIPO = 0.2        # la escena cambia este tanto antes de que arranque su linea
COLA = 0.5            # aire despues de la ultima palabra
DUR_MIN = 1.0         # ninguna escena dura menos que esto
PESO_PAUSA = 0.8      # cuanto pesa que una pausa sea larga al elegir los cortes


def leer_audio(ruta):
    with tempfile.TemporaryDirectory() as d:
        wav = os.path.join(d, 'a.wav')
        r = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', ruta, '-vn', '-ac', '1', '-ar', str(SR),
                            '-c:a', 'pcm_s16le', wav], capture_output=True, text=True)
        if r.returncode != 0:
            raise SystemExit('No pude leer la grabacion ' + ruta + ':\n' + r.stderr.strip())
        with wave.open(wav) as w:
            x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    if len(x) < SR:
        raise SystemExit('La grabacion dura menos de un segundo: ' + ruta)
    return x


def energia_db(x):
    h = int(HOP * SR)
    n = len(x) // h
    rms = np.sqrt(np.mean(x[:n * h].reshape(n, h) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    return np.convolve(db, np.ones(3) / 3, mode='same')


def tramos_de(mask):
    """[(ini, fin)] en cuadros de cada racha de True"""
    d = np.diff(np.concatenate([[0], mask.astype(np.int8), [0]]))
    return list(zip(np.where(d == 1)[0], np.where(d == -1)[0]))


def voz_activa(db):
    piso = np.percentile(db, 10)
    techo = np.percentile(db, 97)
    if techo - piso < 10:
        raise SystemExit('No distingo la voz del ruido de fondo (diferencia de %.0f dB). '
                         'Graba mas cerca del microfono o en un lugar mas silencioso.' % (techo - piso))
    umbral = max(piso + 0.35 * (techo - piso), techo - 32)
    # histeresis: la voz se encuentra con el umbral alto y sus bordes (los comienzos
    # suaves, las eses del final) se siguen con uno bajo, apenas por encima del ruido
    bajo = piso + max(4.0, 0.15 * (techo - piso))
    alto = db > umbral
    activo = np.zeros_like(alto)
    for a, b in tramos_de(db > bajo):
        if alto[a:b].any():
            activo[a:b] = True
    # silencios muy cortos son parte de la frase; ruiditos sueltos no son voz
    for a, b in tramos_de(~activo):
        if (b - a) * HOP < HUECO_PALABRA and a > 0 and b < len(activo):
            activo[a:b] = True
    for a, b in tramos_de(activo):
        if (b - a) * HOP < 0.08:
            activo[a:b] = False
    if not activo.any():
        raise SystemExit('No encontre voz en la grabacion.')
    return activo


# los numeros escritos con cifras se leen con mas silabas de las que parecen:
# "1,6" = "uno coma seis", "154" = "ciento cincuenta y cuatro", "35 %" = "... por ciento"
SIL_CIFRAS = {1: 2, 2: 3, 3: 6, 4: 7}


def silabas_numero(m):
    entero, dec = m.group(1), m.group(2)
    n = SIL_CIFRAS.get(len(entero), 3 * len(entero))
    if dec:
        n += 2 + SIL_CIFRAS.get(len(dec), 2 * len(dec))
    return ' ' + ' '.join(['ba'] * n) + ' '


def silabas(txt):
    t = re.sub(r'^\s*tu cierre\s*:\s*', '', txt or '', flags=re.I)
    t = t.replace('%', ' por ciento ')
    t = re.sub(r'(\d+)(?:[.,](\d+))?', silabas_numero, t)
    return max(1, len(re.findall(r'[aeiouáéíóúü]+', t.lower())))


def elegir_cortes(pausas, pesos, hablado):
    """elige len(pesos)-1 pausas que repartan la voz entre las lineas segun su largo.
    hablado(a, b) = segundos con voz entre a y b (sin contar los silencios)"""
    n = len(pesos)
    g = len(pausas)
    if g < n - 1:
        raise SystemExit(
            'Encontre %d pausas en la grabacion y hacen falta %d (una entre cada linea).\n'
            'Deja un silencio de medio segundo entre linea y linea, o revisa que leiste '
            'todas las lineas del guion.' % (g, n - 1))
    total = hablado(None, None)
    esperado = [total * p / sum(pesos) for p in pesos]

    def costo(k, a, b):
        return math.log(max(hablado(a, b), 0.05) / esperado[k]) ** 2

    def premio(j):
        return PESO_PAUSA * min(pausas[j][1] - pausas[j][0], 1.2)

    INF = float('inf')
    mejor = [[INF] * g for _ in range(n - 1)]
    de = [[-1] * g for _ in range(n - 1)]
    for j in range(g):
        mejor[0][j] = costo(0, None, pausas[j][0]) - premio(j)
    for k in range(1, n - 1):
        for j in range(k, g):
            pj = premio(j)
            for i in range(k - 1, j):
                if mejor[k - 1][i] == INF:
                    continue
                c = mejor[k - 1][i] + costo(k, pausas[i][1], pausas[j][0]) - pj
                if c < mejor[k][j]:
                    mejor[k][j], de[k][j] = c, i
    fin_k = n - 2
    final = [mejor[fin_k][j] + costo(n - 1, pausas[j][1], None) for j in range(g)]
    j = int(np.argmin(final))
    elegidos = [j]
    for k in range(fin_k, 0, -1):
        j = de[k][j]
        elegidos.append(j)
    return [pausas[j] for j in reversed(elegidos)]


def fmt(s):
    return '%d:%04.1f' % (int(s // 60), s - 60 * int(s // 60))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voz', required=True)
    ap.add_argument('--guion', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--wav', required=True)
    ap.add_argument('--informe', default=None)
    a = ap.parse_args()

    with open(a.guion, encoding='utf-8') as fh:
        guion = json.load(fh)
    n = len(guion)
    x = leer_audio(a.voz)
    db = energia_db(x)
    activo = voz_activa(db)
    voz = tramos_de(activo)
    ini, fin = voz[0][0] * HOP, voz[-1][1] * HOP
    pausas = [(b * HOP, c * HOP) for (_, b), (c, _) in zip(voz[:-1], voz[1:])
              if (c - b) * HOP >= MIN_PAUSA]

    pesos = [silabas(e.get('vo')) for e in guion]
    acum = np.concatenate([[0], np.cumsum(activo)])

    def hablado(a, b):
        ia = 0 if a is None else int(round(a / HOP))
        ib = len(activo) if b is None else int(round(b / HOP))
        return (acum[max(ib, ia)] - acum[ia]) * HOP

    cortes = [] if n == 1 else elegir_cortes(pausas, pesos, hablado)

    # linea de tiempo del video: 0 = AIRE_INICIO antes de la primera palabra
    offset = ini - AIRE_INICIO
    limites = [0.0]
    for (p0, p1) in cortes:
        limites.append(max(p0 + 0.05, p1 - ANTICIPO) - offset)
    fin_voz = fin + COLA - offset
    durs = [limites[k + 1] - limites[k] for k in range(n - 1)]
    durs.append(max(fin_voz - limites[-1], float(guion[-1].get('dur', DUR_MIN))))
    durs = [round(max(DUR_MIN, d), 3) for d in durs]
    total = round(sum(durs), 3)

    # tramos de voz de cada linea (en segundos del video) y avisos
    bordes = [ini] + [c for p in cortes for c in p] + [fin]
    ritmo = [pesos[k] / max(hablado(bordes[2 * k], bordes[2 * k + 1]), 0.1) for k in range(n)]
    ritmo_medio = float(np.median(ritmo))
    claras = sum(1 for p in pausas if p[1] - p[0] >= 0.35)  # medio segundo real se mide algo mas corto
    tramos, avisos = [], []
    if n > 1 and claras < n - 1:
        avisos.append('Hay %d pausas claras entre frases y el guion tiene %d lineas: '
                      'si te saltaste una linea o leiste dos seguidas, los cortes pueden estar '
                      'corridos. Mira el video completo antes de publicarlo.' % (claras, n))
    acc = 0.0
    for k, e in enumerate(guion):
        v0, v1 = bordes[2 * k] - offset, bordes[2 * k + 1] - offset
        tramos.append({'nombre': e.get('nombre'), 'vo': e.get('vo'), 'ini': round(acc, 3),
                       'fin': round(acc + durs[k], 3), 'voz': [round(v0, 3), round(v1, 3)],
                       'dur_antes': e.get('dur'), 'dur': durs[k]})
        r = ritmo[k] / ritmo_medio
        if n > 2 and (r > 1.5 or r < 0.65):
            avisos.append('Escena %d (%s): esa parte de la grabacion suena %s que el resto '
                          '(%.1f s de voz para esta linea). Puede que falte, sobre o se repita '
                          'una linea cerca de aqui. Mira ese tramo del video.'
                          % (k + 1, e.get('nombre'), 'mucho mas rapida' if r > 1 else 'mucho mas lenta',
                             v1 - v0))
        d0 = float(e.get('dur') or 0)
        if d0 and durs[k] < 0.55 * d0 and k < n - 1:
            avisos.append('Escena %d (%s): quedo en %.1f s y estaba pensada para %.1f s; '
                          'la animacion va a ir mas rapido.' % (k + 1, e.get('nombre'), durs[k], d0))
        acc += durs[k]

    # casi sin pausas y con ritmos imposibles: el reparto salio mal, mejor no grabar el video
    raros = sum(1 for k in range(n) if not 0.65 <= ritmo[k] / ritmo_medio <= 1.5)
    if n > 2 and claras < (n - 1) / 2 and raros >= 2:
        raise SystemExit(
            'No pude separar las lineas: la grabacion casi no tiene pausas entre frases (%d claras '
            'para %d lineas) y %d lineas quedaron con un ritmo que no cuadra.\n'
            'Vuelve a grabar dejando medio segundo de silencio entre linea y linea.'
            % (claras, n, raros))
    if len(pausas) > 3 * n:
        avisos.append('La grabacion tiene muchas pausas (%d para %d lineas): si algo quedo '
                      'cruzado, deja pausas mas marcadas entre linea y linea.' % (len(pausas), n))

    # la voz en la linea de tiempo del video
    o = int(round(offset * SR))
    m = int(round(total * SR))
    pista = np.zeros(m, dtype=np.float32)
    src0, dst0 = max(0, o), max(0, -o)
    k = min(len(x) - src0, m - dst0)
    if k > 0:
        pista[dst0:dst0 + k] = x[src0:src0 + k]
    fade = int(0.01 * SR)
    pista[:fade] *= np.linspace(0, 1, fade)
    with wave.open(a.wav, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(pista, -1, 1) * 32767).astype(np.int16).tobytes())

    res = {'durs': durs, 'total': total, 'offset': round(offset, 3), 'pausas': len(pausas),
           'tramos': tramos, 'avisos': avisos}
    with open(a.out, 'w', encoding='utf-8') as fh:
        json.dump(res, fh, ensure_ascii=False, indent=1)

    lineas = ['VOZ -> VIDEO · %s' % os.path.basename(a.voz),
              'grabacion %.1f s · voz desde %.1f s · %d pausas · video %.1f s' %
              (len(x) / SR, ini, len(pausas), total), '']
    for k, t in enumerate(tramos):
        lineas.append('%d. %-14s %s - %s  (%.1f s; antes %.1f s)' %
                      (k + 1, (t['nombre'] or '')[:14], fmt(t['ini']), fmt(t['fin']), t['dur'],
                       float(t['dur_antes'] or 0)))
        lineas.append('   ' + (t['vo'] or ''))
    lineas.append('')
    lineas.append('Avisos:' if avisos else 'Sin avisos.')
    lineas += ['- ' + s for s in avisos]
    txt = '\n'.join(lineas) + '\n'
    if a.informe:
        with open(a.informe, 'w', encoding='utf-8') as fh:
            fh.write(txt)
    sys.stdout.write(txt)


if __name__ == '__main__':
    main()
