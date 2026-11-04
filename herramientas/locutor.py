#!/usr/bin/env python3
"""
locutor.py — la voz de Torvick para los reels (doblaje automatico).

  1) preparar el perfil de voz (una vez, o cada vez que haya mas videos terminados):
       python3 herramientas/locutor.py preparar VIDEO_TERMINADO.mp4 [...]
     separa la voz de la musica y los efectos (UVR MDX-Net), la guarda en
     ~/.torvick/voz/fuentes/ y calcula el perfil: el espectro medio de la voz,
     el tono y el ritmo (palabras por segundo, con whisper).

  2) decir las lineas de un reel:
       python3 herramientas/locutor.py decir lineas.json carpeta/
     lineas.json = [{"i": 0, "texto": "Estas haciendo mal..."}, ...]
     deja carpeta/linea-00.wav ... y carpeta/lineas.json con la duracion de cada una.

  3) armar la pista de voz:  python3 herramientas/locutor.py pista plan.json voz.wav
     plan.json = {"dur": s, "lineas": [{"archivo": "...wav", "t": segundo}]}

  Lo usa grabar.js con --voz: dice las lineas, alarga cada escena a lo que dura su
  linea, graba el video y mezcla voz + musica (que baja sola cuando se habla) + efectos.

Motor local (todo corre aca, sin internet una vez bajados los modelos):
  Supertonic 3 (MIT, 31 idiomas) dice el texto en espanol con la voz masculina que mas
  se parece (sid 9) y al ritmo del perfil; despues se ecualiza con el espectro medio de
  la voz real. NO es un clon: se acerca al timbre (parecido 0,74 contra 0,94 de la voz
  real con ella misma, medido con WeSpeaker). Para un clon de verdad hace falta un
  conversor de voz o un servicio de clonacion (ver CLAUDE.md, "Doblaje").

Modelos en ~/.torvick/modelos (los mismos de transcribir.py), una sola vez:
  https://github.com/k2-fsa/sherpa-onnx/releases/download/source-separation-models/UVR-MDX-NET-Voc_FT.onnx
  https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/sherpa-onnx-supertonic-3-tts-int8-2026-05-11.tar.bz2
  https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-turbo.tar.bz2
  pip install sherpa-onnx soundfile numpy
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf

MODELOS = os.path.expanduser(os.environ.get('TORVICK_MODELOS', '~/.torvick/modelos'))
VOZ = os.path.expanduser(os.environ.get('TORVICK_VOZ', '~/.torvick/voz'))
SR = 44100
N, H = 1024, 256          # ventana y salto del ecualizador
SID = 9                   # la voz de Supertonic que mas se parece a la de Torvick
RITMO_BASE = 2.15         # palabras por segundo de esa voz a velocidad 1


def so():
    import sherpa_onnx
    return sherpa_onnx


def leer_mono(ruta, sr=SR):
    x, s = sf.read(ruta, dtype='float32', always_2d=True)
    x = x.mean(1)
    if s != sr:
        n = int(len(x) * sr / s)
        x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)
    return x


def stft(x):
    w = np.hanning(N)
    return np.array([np.fft.rfft(x[i:i + N] * w) for i in range(0, max(1, len(x) - N), H)])


def istft(F, n):
    w = np.hanning(N)
    y = np.zeros(n + N)
    norm = np.zeros(n + N)
    for k, f in enumerate(F):
        i = k * H
        y[i:i + N] += np.fft.irfft(f) * w
        norm[i:i + N] += w ** 2
    return (y / np.maximum(norm, 1e-6))[:n]


def espectro_medio(x):
    """espectro medio (dB) de los cuadros con voz"""
    m = np.abs(stft(x))
    e = m.sum(1)
    voz = e > np.percentile(e, 40)
    return 20 * np.log10(m[voz].mean(0) + 1e-7)


def suave(v, k=9):
    return np.convolve(np.pad(v, k, mode='edge'), np.ones(2 * k + 1) / (2 * k + 1), 'same')[k:-k]


def tono_medio(x, sr=SR):
    y = x[::max(1, sr // 16000)]
    s16 = sr / max(1, sr // 16000)
    w = int(0.04 * s16)
    f0 = []
    for i in range(0, len(y) - w, w // 2):
        q = y[i:i + w] - y[i:i + w].mean()
        if np.sqrt(np.mean(q ** 2)) < 0.02:
            continue
        ac = np.correlate(q, q, 'full')[w - 1:]
        lo, hi = int(s16 / 400), int(s16 / 70)
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.5 * ac[0]:
            f0.append(s16 / k)
    return float(np.median(f0)) if f0 else 0.0


# ------------------------------------------------------------ preparar

def separar(video, salida):
    s = so()
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, 'a.wav')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-vn', '-acodec', 'pcm_s16le', '-ar', str(SR), '-ac', '2', wav], check=True)
        x, sr = sf.read(wav, dtype='float32', always_2d=True)
    cfg = s.OfflineSourceSeparationConfig(model=s.OfflineSourceSeparationModelConfig(
        uvr=s.OfflineSourceSeparationUvrModelConfig(model=os.path.join(MODELOS, 'UVR-MDX-NET-Voc_FT.onnx')),
        num_threads=4, provider='cpu'))
    out = s.OfflineSourceSeparation(cfg).process(sample_rate=sr, samples=np.ascontiguousarray(x.T))
    voz = out.stems[0].data.T.mean(1)
    sf.write(salida, voz.astype(np.float32), out.sample_rate)
    return voz


def ritmo(voz):
    """palabras por segundo de habla (whisper, en tramos de 25 s)"""
    s = so()
    w = os.path.join(MODELOS, 'sherpa-onnx-whisper-turbo')
    if not os.path.isdir(w):
        return None
    rec = s.OfflineRecognizer.from_whisper(encoder=os.path.join(w, 'turbo-encoder.int8.onnx'),
                                           decoder=os.path.join(w, 'turbo-decoder.int8.onnx'),
                                           tokens=os.path.join(w, 'turbo-tokens.txt'), language='es', task='transcribe', num_threads=4)
    x = voz[::max(1, SR // 16000)]
    x = np.interp(np.linspace(0, len(x) - 1, int(len(voz) * 16000 / SR)), np.arange(len(x)), x).astype(np.float32)
    palabras, textos = 0, []
    for i in range(0, len(x), 16000 * 25):
        st = rec.create_stream()
        st.accept_waveform(16000, x[i:i + 16000 * 25])
        rec.decode_stream(st)
        textos.append(st.result.text.strip())
        palabras += len(st.result.text.split())
    # el ritmo con las pausas incluidas (como se mide RITMO_BASE: palabras / duracion del audio)
    habla = len(x) / 16000
    return {'palabras': palabras, 'habla': habla, 'pps': palabras / max(habla, 1e-6), 'texto': ' '.join(textos)}


def preparar(videos):
    os.makedirs(os.path.join(VOZ, 'fuentes'), exist_ok=True)
    voces = []
    for v in videos:
        nombre = os.path.splitext(os.path.basename(v))[0]
        destino = os.path.join(VOZ, 'fuentes', nombre + '.wav')
        print('separando', v)
        voces.append(separar(v, destino))
    todo = np.concatenate(voces)
    r = ritmo(todo)
    perfil = {
        'espectro': espectro_medio(todo).round(3).tolist(),
        'tono': tono_medio(todo),
        'pps': r['pps'] if r else 2.4,
        'segundos': len(todo) / SR,
        'fuentes': [os.path.basename(v) for v in videos]
    }
    with open(os.path.join(VOZ, 'perfil.json'), 'w') as fh:
        json.dump(perfil, fh)
    print('perfil listo: %.0f s de voz, tono %.0f Hz, %.2f palabras/s' % (perfil['segundos'], perfil['tono'], perfil['pps']))


# ------------------------------------------------------------ decir

def motor_supertonic():
    s = so()
    d = os.path.join(MODELOS, 'sherpa-onnx-supertonic-3-tts-int8-2026-05-11') + '/'
    return s.OfflineTts(s.OfflineTtsConfig(model=s.OfflineTtsModelConfig(supertonic=s.OfflineTtsSupertonicModelConfig(
        duration_predictor=d + 'duration_predictor.int8.onnx', text_encoder=d + 'text_encoder.int8.onnx',
        vector_estimator=d + 'vector_estimator.int8.onnx', vocoder=d + 'vocoder.int8.onnx', tts_json=d + 'tts.json',
        unicode_indexer=d + 'unicode_indexer.bin', voice_style=d + 'voice.bin'), num_threads=4, provider='cpu')))


def ecualizar(x, perfil):
    F = stft(x)
    g = np.clip(suave(np.array(perfil['espectro']) - espectro_medio(x)), -12, 12)
    g -= np.median(g)
    return istft(F * (10 ** (g / 20))[None], len(x)).astype(np.float32)


def recortar(x, umbral=-45):
    """saca el silencio del principio y del final (deja 40 ms)"""
    fr = 441
    n = len(x) // fr
    db = 20 * np.log10(np.sqrt((x[:n * fr].reshape(n, fr) ** 2).mean(1)) + 1e-9)
    voz = np.where(db > db.max() + umbral)[0]
    if not len(voz):
        return x
    a = max(0, (voz[0] - 4) * fr)
    b = min(len(x), (voz[-1] + 5) * fr)
    return x[a:b]


def decir(archivo, carpeta):
    with open(os.path.join(VOZ, 'perfil.json')) as fh:
        perfil = json.load(fh)
    with open(archivo) as fh:
        lineas = json.load(fh)
    os.makedirs(carpeta, exist_ok=True)
    tts = motor_supertonic()
    s = so()
    velocidad = max(0.8, min(1.4, perfil['pps'] / RITMO_BASE))
    out = []
    for ln in lineas:
        texto = ln['texto'].strip()
        if not texto:
            out.append({'i': ln['i'], 'archivo': None, 'dur': 0})
            continue
        g = s.GenerationConfig()
        g.sid = SID
        g.num_steps = 8
        g.speed = velocidad
        g.extra['lang'] = 'es'
        a = tts.generate(texto, g)
        x = np.array(a.samples, dtype=np.float32)
        if a.sample_rate != SR:
            x = np.interp(np.linspace(0, len(x) - 1, int(len(x) * SR / a.sample_rate)), np.arange(len(x)), x).astype(np.float32)
        x = recortar(ecualizar(x, perfil))
        x = x / (np.sqrt(np.mean(x ** 2)) + 1e-9) * 0.1      # todas las lineas al mismo nivel
        x = np.clip(x, -0.98, 0.98)
        ruta = os.path.join(carpeta, 'linea-%02d.wav' % ln['i'])
        sf.write(ruta, x, SR)
        out.append({'i': ln['i'], 'archivo': ruta, 'dur': len(x) / SR, 'texto': texto})
        print('linea %d: %.2f s  %s' % (ln['i'], len(x) / SR, texto[:60]))
    with open(os.path.join(carpeta, 'lineas.json'), 'w') as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)


def pista(plan, salida):
    """arma la pista de voz: plan.json = {"dur": s, "lineas": [{"archivo", "t"}]}"""
    with open(plan) as fh:
        pl = json.load(fh)
    y = np.zeros(int(pl['dur'] * SR) + SR)
    for ln in pl['lineas']:
        if not ln.get('archivo'):
            continue
        x = leer_mono(ln['archivo'])
        i = int(ln['t'] * SR)
        y[i:i + len(x)] += x[:max(0, len(y) - i)]
    y = y[:int(pl['dur'] * SR)]
    sf.write(salida, np.clip(y, -0.98, 0.98).astype(np.float32), SR)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    p = sub.add_parser('preparar')
    p.add_argument('videos', nargs='+')
    d = sub.add_parser('decir')
    d.add_argument('lineas')
    d.add_argument('carpeta')
    t = sub.add_parser('pista')
    t.add_argument('plan')
    t.add_argument('salida')
    a = ap.parse_args()
    if a.cmd == 'preparar':
        preparar(a.videos)
    elif a.cmd == 'decir':
        decir(a.lineas, a.carpeta)
    else:
        pista(a.plan, a.salida)


if __name__ == '__main__':
    sys.exit(main())
