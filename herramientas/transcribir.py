#!/usr/bin/env python3
"""
transcribir.py — transcripcion con tiempos por palabra para los videos largos.

    python3 herramientas/transcribir.py video.mp4 --out largos/<id>/transcripcion.json
                                        [--modelos ~/.torvick/modelos] [--sin-whisper]

Dos modelos, los dos corren en CPU y sin internet una vez bajados:
  - parakeet TDT 0.6b v3 (sherpa-onnx): da el tiempo de cada palabra. En tramos
    largos con musica de fondo se pasa al ingles, asi que se le dan tramos de 4-9 s
    cortados en las pausas.
  - whisper turbo (sherpa-onnx) con idioma 'es': corrige el texto (ortografia,
    puntuacion). No da tiempos; se alinea contra las palabras de parakeet.

Modelos (una sola vez, ~1 GB):
  https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2
  https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-turbo.tar.bz2
  descomprimidos dentro de --modelos.   pip install sherpa-onnx numpy

Salida JSON:
  { "dur": s, "palabras": [{"p", "ini", "fin"}], "frases": [{"ini", "fin", "texto"}] }
y al lado un .txt legible con una frase por linea y su tiempo, y un .js con lo mismo
para largo.html (bajo file:// el navegador no deja leer un .json): el id del video
es el nombre de la carpeta (largos/<id>/transcripcion.json).
"""
import argparse
import difflib
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import unicodedata
import wave

import numpy as np

SR = 16000


def leer_audio(ruta):
    with tempfile.TemporaryDirectory() as d:
        wav = os.path.join(d, 'a.wav')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', ruta, '-ac', '1', '-ar', str(SR),
                        '-c:a', 'pcm_s16le', wav], check=True)
        with wave.open(wav) as w:
            return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0


def cortes(x, lo, hi):
    """tramos de lo a hi segundos, cortados en el punto mas silencioso de cada ventana"""
    hop = int(0.02 * SR)
    n = len(x) // hop
    e = np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    es = np.convolve(e, np.ones(7) / 7, mode='same')
    c = [0]
    while True:
        a = c[-1] + int(lo / 0.02)
        b = c[-1] + int(hi / 0.02)
        if b >= n:
            break
        c.append(a + int(np.argmin(es[a:b])))
    c.append(n)
    return [(c[i] * hop, c[i + 1] * hop) for i in range(len(c) - 1) if c[i + 1] > c[i]]


def norm(p):
    p = unicodedata.normalize('NFD', p.lower())
    p = ''.join(ch for ch in p if unicodedata.category(ch) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', p)


def con_parakeet(x, d, hilos):
    import sherpa_onnx
    rec = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=d + '/encoder.int8.onnx', decoder=d + '/decoder.int8.onnx',
        joiner=d + '/joiner.int8.onnx', tokens=d + '/tokens.txt',
        num_threads=hilos, model_type='nemo_transducer', decoding_method='greedy_search')
    pal = []
    for a, b in cortes(x, 4.0, 9.0):
        s = rec.create_stream()
        s.accept_waveform(SR, x[a:b])
        rec.decode_stream(s)
        r = s.result
        off = a / SR
        toks, ts = list(r.tokens), list(r.timestamps)
        durs = list(r.durations) if len(r.durations) == len(toks) else [0.0] * len(toks)
        actual = []
        for tok, t, du in zip(toks, ts, durs):
            if tok.startswith('▁') or tok.startswith(' ') or not actual:
                actual.append({'p': tok.lstrip('▁ '), 'ini': off + t, 'fin': off + t + max(du, 0.08)})
            else:
                actual[-1]['p'] += tok
                actual[-1]['fin'] = off + t + max(du, 0.08)
        pal += [w for w in actual if w['p']]
    # el fin de cada palabra no pasa el inicio de la siguiente
    for i in range(len(pal) - 1):
        pal[i]['fin'] = min(pal[i]['fin'], pal[i + 1]['ini'])
    return pal


def con_whisper(x, d, hilos):
    import sherpa_onnx
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=d + '/turbo-encoder.int8.onnx', decoder=d + '/turbo-decoder.int8.onnx',
        tokens=d + '/turbo-tokens.txt', language='es', task='transcribe', num_threads=hilos)
    txt = []
    for a, b in cortes(x, 14.0, 26.0):
        s = rec.create_stream()
        s.accept_waveform(SR, x[a:b])
        rec.decode_stream(s)
        t = s.result.text.strip()
        # whisper a veces repite una frase en bucle: se deja una sola vez
        t = re.sub(r'(\b.{12,}?)\1{2,}', r'\1', t)
        if t.endswith('...'):
            t = t[:-3].rstrip()
        txt.append(t)
    return ' '.join(txt).split()


def fusionar(pk, wh):
    """texto de whisper con los tiempos de parakeet"""
    a = [norm(w['p']) for w in pk]
    b = [norm(w) for w in wh]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    out = []
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == 'equal':
            for k in range(i2 - i1):
                w = dict(pk[i1 + k])
                w['p'] = wh[j1 + k]
                out.append(w)
        elif op == 'replace':
            nuevos = wh[j1:j2]
            # si whisper trae mucho mas texto del que oyo parakeet, se desconfia de whisper
            if len(nuevos) > 2 * (i2 - i1) + 3:
                out += [dict(w) for w in pk[i1:i2]]
                continue
            ini, fin = pk[i1]['ini'], pk[i2 - 1]['fin']
            largos = [max(1, len(norm(w))) for w in nuevos]
            tot = float(sum(largos))
            acc = 0.0
            for w, l in zip(nuevos, largos):
                wi = ini + (fin - ini) * acc / tot
                acc += l
                out.append({'p': w, 'ini': wi, 'fin': ini + (fin - ini) * acc / tot})
        elif op == 'delete':
            out += [dict(w) for w in pk[i1:i2]]
        # 'insert': palabras que solo oyo whisper; sin tiempo confiable, se descartan
    for w in out:
        w['ini'] = round(w['ini'], 3)
        w['fin'] = round(max(w['fin'], w['ini'] + 0.05), 3)
    return out


def frases(pal):
    fr, act = [], []
    for i, w in enumerate(pal):
        act.append(w)
        corta = w['p'].endswith(('.', '?', '!', '…'))
        pausa = i + 1 < len(pal) and pal[i + 1]['ini'] - w['fin'] > 0.7
        if corta or pausa or len(act) >= 40 or i == len(pal) - 1:
            fr.append({'ini': act[0]['ini'], 'fin': act[-1]['fin'], 'texto': ' '.join(x['p'] for x in act)})
            act = []
    return fr


def escribir_js(ruta_json):
    """transcripcion.js: la misma transcripcion como script, para cargarla con doble clic"""
    vid = os.path.basename(os.path.dirname(os.path.abspath(ruta_json)))
    with open(ruta_json) as fh:
        datos = json.load(fh)
    with open(os.path.splitext(ruta_json)[0] + '.js', 'w') as fh:
        fh.write('/* GENERADO por herramientas/transcribir.py — no editar a mano. */\n')
        fh.write('window.TRANSCRIPCIONES = window.TRANSCRIPCIONES || {};\n')
        fh.write('window.TRANSCRIPCIONES[%s] = %s;\n' % (json.dumps(vid), json.dumps(datos, ensure_ascii=False)))


def fmt(s):
    return '%02d:%05.2f' % (int(s // 60), s - 60 * int(s // 60))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('--out', required=True)
    ap.add_argument('--modelos', default=os.path.expanduser('~/.torvick/modelos'))
    ap.add_argument('--sin-whisper', action='store_true')
    ap.add_argument('--hilos', type=int, default=max(1, min(8, os.cpu_count() or 1)))
    ap.add_argument('--solo-js', action='store_true', help='rehace el .js desde un .json ya corregido a mano')
    a = ap.parse_args()
    if a.solo_js:
        escribir_js(a.out)
        return

    t0 = time.time()
    x = leer_audio(a.video)
    dur = len(x) / SR
    pk = con_parakeet(x, os.path.join(a.modelos, 'sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8'), a.hilos)
    print('parakeet:', len(pk), 'palabras', round(time.time() - t0), 's', file=sys.stderr)
    pal = pk
    dw = os.path.join(a.modelos, 'sherpa-onnx-whisper-turbo')
    if not a.sin_whisper and os.path.isdir(dw):
        wh = con_whisper(x, dw, a.hilos)
        print('whisper:', len(wh), 'palabras', round(time.time() - t0), 's', file=sys.stderr)
        pal = fusionar(pk, wh)
    else:
        for w in pal:
            w['ini'], w['fin'] = round(w['ini'], 3), round(w['fin'], 3)
    fr = frases(pal)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, 'w') as fh:
        json.dump({'dur': round(dur, 3), 'palabras': pal, 'frases': fr}, fh, ensure_ascii=False, indent=0)
    with open(os.path.splitext(a.out)[0] + '.txt', 'w') as fh:
        for f in fr:
            fh.write('[%s - %s] %s\n' % (fmt(f['ini']), fmt(f['fin']), f['texto']))
    escribir_js(a.out)
    print('listo', a.out, len(pal), 'palabras,', len(fr), 'frases,', round(time.time() - t0), 's', file=sys.stderr)


if __name__ == '__main__':
    main()
