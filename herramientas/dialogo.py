#!/usr/bin/env python3
"""
dialogo.py — arma la pista de un video con DOS voces grabadas por separado (una colaboración).

    python3 herramientas/sincronizar.py <id> tor.m4a  out-tor   --plan --solo tor   --clips clips-tor
    python3 herramientas/sincronizar.py <id> passa.wav out-passa --plan --solo passa --clips clips-passa
    python3 herramientas/dialogo.py <id> guion.json tor=clips-tor passa=clips-passa [--salida videos/<id>-voz.wav]

guion.json es el de `grabar.js <id> --solo-guion` (cada escena con su `habla`). Cada escena toma la toma
elegida de quien la dice (clips-<quien>/NN.wav) y dura lo que dura esa toma más un respiro corto; las
escenas sin voz (la acción que no se grabó) conservan su duración. Cada voz se lleva por separado al
mismo volumen (-19 dBFS donde se habla: la misma ganancia para toda la voz de cada uno, sin tocar el
timbre) y después se juntan. Avisa si una toma empieza o termina con sonido fuerte (una palabra cortada).
Deja la pista y escribe las duraciones (para voz.py --pista --tiempos y grabar.js --tiempos), y al lado
<salida>.palabras.json: las palabras de cada escena con el tiempo en que se dicen (las de la transcripcion de
cada grabacion, pasadas a la pista), para `voz.py --oidas`: los subtitulos salen justo cuando se dice cada
palabra aunque la grabacion tenga ruido y whisper no la oiga entera.
"""
import argparse
import json
import os
import wave

import numpy as np

SR = 48000
RESPIRO = 0.1


def leer(ruta):
    with wave.open(ruta) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        if w.getnchannels() > 1:
            x = x.reshape(-1, w.getnchannels()).mean(axis=1)
        assert w.getframerate() == SR, ruta
    return x


def escribir(ruta, y):
    pcm = (np.clip(y, -1, 1) * 32767).astype(np.int16)
    with wave.open(ruta, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)


def ganancia(clips):
    """la misma ganancia para todas las tomas de una voz: -19 dBFS RMS donde se habla"""
    if not clips:
        return 1.0
    todo = np.concatenate(clips)
    hop = SR // 20
    nb = len(todo) // hop
    rms = np.sqrt(np.mean(todo[:nb * hop].reshape(nb, hop) ** 2, axis=1) + 1e-12)
    habl = rms[rms > np.percentile(rms, 50)]
    return 10 ** ((-19 - 20 * np.log10(np.sqrt(np.mean(habl ** 2)) + 1e-12)) / 20)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('id')
    ap.add_argument('guion')
    ap.add_argument('voces', nargs='+', help='quien=carpeta de clips')
    ap.add_argument('--salida')
    a = ap.parse_args()
    guion = json.load(open(a.guion))
    carpetas = dict(v.split('=', 1) for v in a.voces)
    # las tomas de cada escena, de la carpeta de quien la dice
    clips, quien, dichas = [], [], []
    infos = {}
    for q, c in carpetas.items():
        r = os.path.join(c, 'clips.json')
        infos[q] = json.load(open(r)) if os.path.exists(r) else {}
    for k, e in enumerate(guion):
        q = e.get('habla') or 'tor'
        ruta = os.path.join(carpetas.get(q, ''), '%02d.wav' % (k + 1))
        clips.append(leer(ruta) if os.path.exists(ruta) else None)
        quien.append(q)
        dichas.append(infos.get(q, {}).get(str(k + 1), {}).get('palabras'))
    g = {q: ganancia([c for c, w in zip(clips, quien) if w == q and c is not None]) for q in set(quien)}
    piezas, t, limites, oidas = [], 0.05, [0.0], {}
    for k, (e, c) in enumerate(zip(guion, clips)):
        ultima = k == len(guion) - 1
        if c is not None and len(c):
            c = c * g[quien[k]]
            # fundido de 12 ms en las puntas: la toma arranca antes de la voz, asi que no se come nada,
            # pero el ruido de fondo de una grabacion no entra ni sale de golpe (sin clic)
            n = min(int(0.012 * SR), len(c) // 4)
            c[:n] *= np.linspace(0, 1, n)
            c[-n:] *= np.linspace(1, 0, n)
            # una toma que arranca o termina con sonido fuerte puede tener una palabra cortada
            ini, fin = db(c[n:n + int(0.03 * SR)]), db(c[-n - int(0.03 * SR):-n])
            if ini > -32 or fin > -32:
                print('  ojo, escena %d (%s): %s' % (k + 1, quien[k], ('empieza fuerte %.0f dB ' % ini if ini > -32 else '') + ('termina fuerte %.0f dB' % fin if fin > -32 else '')))
            d = max(3.0 if ultima else 1.4, t + len(c) / SR + (0.5 if ultima else RESPIRO) - limites[-1] - (0 if ultima else 0.06))
            piezas.append((t, c))
            if dichas[k]:
                # en el tiempo de la escena (voz.py las alinea contra el guion de cada linea)
                oidas[k] = [[round(w[0] + t - limites[-1], 3), round(w[1] + t - limites[-1], 3), w[2]] for w in dichas[k]]
        else:
            d = e['dur']
        limites.append(limites[-1] + d)
        t = limites[-1] + 0.06
    total = limites[-1]
    pista = np.zeros(int(np.ceil((total + 0.1) * SR)), dtype=np.float32)
    for t0, c in piezas:
        i = int(round(t0 * SR))
        n = min(len(c), len(pista) - i)
        pista[i:i + n] += c[:n]
    pico = np.abs(pista).max()
    if pico > 0.95:
        pista *= 0.95 / pico
    salida = a.salida or os.path.join('videos', a.id + '-voz.wav')
    escribir(salida, pista)
    json.dump(oidas, open(os.path.splitext(salida)[0] + '.palabras.json', 'w'), ensure_ascii=False)
    durs = [round(limites[k + 1] - limites[k], 3) for k in range(len(guion))]
    for k, e in enumerate(guion):
        print('%2d. %-6s %5.2f s  %s' % (k + 1, quien[k], durs[k], e['nombre']))
    print('listo: %s · %.1f s' % (salida, total))
    print('tiempos:', ','.join('%.3f' % d for d in durs))


if __name__ == '__main__':
    main()
