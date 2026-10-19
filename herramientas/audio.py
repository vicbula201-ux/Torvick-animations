#!/usr/bin/env python3
"""
audio.py — arma la pista de un reel: musica original + efectos en los momentos marcados.

    python3 herramientas/audio.py --dur 32 --cues cues.json --out pista.wav [--sin-musica]
                                  [--musica mi-tema.wav] [--bpm 118] [--semilla 3]

cues.json = [{"tipo": "error"|"bien"|"paso"|"marca"|"golpe", "t": segundos, "g": ganancia}, ...]
(lo escribe herramientas/grabar.js a partir de window.REEL.cues()).

Para los videos largos (herramientas/grabar-largo.js):
    --base voz.wav        la voz del video va debajo de todo, a volumen original
    --nivel-efectos -6    dB de los efectos (0 = como en los reels)
    tipos extra: pop, whoosh (cruza de izquierda a derecha, como la banda amarilla),
    ding, click, campana, subida
Con --base y musica, la musica baja sola cuando hay voz.

Todo se sintetiza aca, sin samples ajenos: la musica es original y libre de derechos.
Si se pasa --musica, usa ese archivo (wav) como fondo en vez del tema sintetizado.
Solo necesita numpy.
"""
import argparse
import json
import wave

import numpy as np

SR = 48000


# ---------------------------------------------------------------- utilidades

def seg(t):
    return int(round(t * SR))


def env_adsr(n, a=0.005, d=0.08, s=0.6, r=0.1):
    """envolvente simple, en muestras"""
    a, d, r = seg(a), seg(d), seg(r)
    e = np.ones(n) * s
    a = min(a, n)
    e[:a] = np.linspace(0, 1, a, endpoint=False)
    d2 = min(d, max(0, n - a))
    e[a:a + d2] = np.linspace(1, s, d2, endpoint=False)
    r = min(r, n)
    if r > 0:
        e[n - r:] *= np.linspace(1, 0, r)
    return e


def decae(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def pasabajos(x, corte):
    """FIR de ventana (sinc) por FFT: suave y sin dependencias"""
    taps = 255
    fc = corte / SR
    m = np.arange(taps) - (taps - 1) / 2
    h = np.sinc(2 * fc * m) * np.hamming(taps)
    h /= h.sum()
    nfft = 1 << int(np.ceil(np.log2(len(x) + taps)))
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(h, nfft), nfft)[:len(x) + taps - 1]
    return y[(taps - 1) // 2:(taps - 1) // 2 + len(x)]


def pasaaltos(x, corte):
    return x - pasabajos(x, corte)


def nota(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def poner(buf, x, t, g=1.0, pan=0.0):
    """suma x (mono) en buf (estereo) en el segundo t"""
    i = seg(t)
    if i >= buf.shape[0] or i + len(x) <= 0:
        return
    j0 = max(0, -i)
    x = x[j0:]
    i = max(0, i)
    n = min(len(x), buf.shape[0] - i)
    izq = np.sqrt(0.5 * (1 - pan))
    der = np.sqrt(0.5 * (1 + pan))
    buf[i:i + n, 0] += x[:n] * g * izq * 1.414
    buf[i:i + n, 1] += x[:n] * g * der * 1.414


# ---------------------------------------------------------------- instrumentos

def bombo(rng):
    n = seg(0.42)
    t = np.arange(n) / SR
    f = 48 + 110 * np.exp(-t / 0.035)
    fase = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(fase) * decae(n, 0.16)
    click = rng.standard_normal(seg(0.004)) * 0.25
    x[:len(click)] += click
    return np.tanh(1.6 * x) * 0.9


def palmas(rng):
    n = seg(0.22)
    x = np.zeros(n)
    for k, dt in enumerate((0, 0.011, 0.022)):
        r = rng.standard_normal(n - seg(dt)) * decae(n - seg(dt), 0.012 if k < 2 else 0.07)
        x[seg(dt):] += r
    x = pasaaltos(pasabajos(x, 6500), 900)
    return x / (np.abs(x).max() + 1e-9) * 0.6


def charles(rng, abierto=False):
    n = seg(0.18 if abierto else 0.05)
    x = rng.standard_normal(n) * decae(n, 0.05 if abierto else 0.012)
    x = pasaaltos(x, 7000)
    return x / (np.abs(x).max() + 1e-9) * 0.35


def bajo(f, dur):
    n = seg(dur)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    x *= env_adsr(n, a=0.004, d=0.09, s=0.55, r=0.05)
    return np.tanh(1.3 * x) * 0.55


def acorde(fs, dur):
    """pad suave: triangulos levemente desafinados"""
    n = seg(dur)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in fs:
        for det in (-0.12, 0.12):
            ph = 2 * np.pi * f * (1 + det / 100) * t
            x += (2 / np.pi) * np.arcsin(np.sin(ph))
    x *= env_adsr(n, a=0.03, d=0.25, s=0.55, r=0.2)
    return pasabajos(x / (len(fs) * 2), 2600) * 0.5


def pluck(f, dur=0.32):
    n = seg(dur)
    t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2 * f * t)) * decae(n, 0.09)
    return x * 0.3


# ---------------------------------------------------------------- musica

def musica(dur, bpm=118, semilla=3):
    rng = np.random.default_rng(semilla)
    buf = np.zeros((seg(dur) + SR, 2))
    pulso = 60.0 / bpm
    compas = 4 * pulso
    # La menor: Am - F - C - G (i VI III VII), energica sin ser agresiva
    progresion = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [55, 60, 64]), (55, [55, 59, 62])]
    melodia = [76, 74, 72, 74, 76, 79, 76, 72]
    k_bombo, k_palmas = bombo(rng), palmas(rng)
    hh, hh_ab = charles(rng), charles(rng, True)
    ducker = np.ones(buf.shape[0])
    c = 0
    t0 = 0.0
    while t0 < dur:
        raiz, notas = progresion[c % 4]
        # pad + compresion de lado (baja en cada bombo)
        poner(buf, acorde([nota(m) for m in notas], compas), t0, 0.55)
        for b in range(4):
            tb = t0 + b * pulso
            poner(buf, k_bombo, tb, 0.9)
            i = seg(tb)
            m = seg(0.18)
            ducker[i:i + m] = np.minimum(ducker[i:i + m], 0.45 + 0.55 * np.linspace(0, 1, len(ducker[i:i + m])))
            if b in (1, 3):
                poner(buf, k_palmas, tb, 0.75, pan=0.05)
            # bajo en corcheas, octava arriba en el contratiempo
            poner(buf, bajo(nota(raiz - 12), pulso * 0.48), tb, 0.8)
            poner(buf, bajo(nota(raiz), pulso * 0.42), tb + pulso / 2, 0.5)
            poner(buf, hh, tb, 0.35, pan=-0.3)
            poner(buf, hh_ab if b == 3 else hh, tb + pulso / 2, 0.55, pan=0.3)
        # pluck melodico cada dos compases, para que no sea monotono
        if c % 2 == 1:
            for j, mm in enumerate(melodia):
                poner(buf, pluck(nota(mm)), t0 + j * pulso / 2, 0.45, pan=0.2 if j % 2 else -0.2)
        t0 += compas
        c += 1
    buf[:, 0] *= ducker
    buf[:, 1] *= ducker
    buf = buf[:seg(dur)]
    # entrada y salida suaves
    fi, fo = seg(0.25), seg(1.2)
    buf[:fi] *= np.linspace(0, 1, fi)[:, None]
    buf[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return buf


# ---------------------------------------------------------------- efectos

def fx_error():
    """'eh-eh' de respuesta incorrecta: dos tonos graves y asperos"""
    out = []
    for f, d in ((233, 0.14), (175, 0.24)):
        n = seg(d)
        t = np.arange(n) / SR
        x = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + 0.5 * np.sin(2 * np.pi * f * 1.01 * t)
        x = pasabajos(x, 2400) * env_adsr(n, a=0.004, d=0.05, s=0.8, r=0.04)
        out.append(x)
        out.append(np.zeros(seg(0.03)))
    x = np.concatenate(out)
    return x / (np.abs(x).max() + 1e-9) * 0.8


def fx_bien():
    """'tin' brillante de campanita"""
    n = seg(0.9)
    t = np.arange(n) / SR
    f = 1975.5  # Si6
    x = (np.sin(2 * np.pi * f * t) * decae(n, 0.32)
         + 0.45 * np.sin(2 * np.pi * f * 2.0 * t) * decae(n, 0.16)
         + 0.25 * np.sin(2 * np.pi * f * 2.76 * t) * decae(n, 0.08)
         + 0.12 * np.sin(2 * np.pi * f * 5.4 * t) * decae(n, 0.03))
    x[:seg(0.002)] *= np.linspace(0, 1, seg(0.002))
    return x / (np.abs(x).max() + 1e-9) * 0.62


def fx_paso(rng):
    """barrido de aire corto para el cambio de escena"""
    n = seg(0.36)
    x = rng.standard_normal(n)
    x = pasaaltos(pasabajos(x, 5000), 600)
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return x * e / (np.abs(x * e).max() + 1e-9) * 0.22


def fx_marca():
    """arpegio ascendente para el cierre de marca"""
    out = np.zeros(seg(1.2))
    for j, m in enumerate((72, 76, 79, 84)):
        p = pluck(nota(m), 0.7) * 1.6
        i = seg(j * 0.07)
        out[i:i + len(p)] += p[:len(out) - i]
    return out / (np.abs(out).max() + 1e-9) * 0.55


def fx_golpe(rng):
    k = bombo(rng)
    return k * 0.7


def fx_pop():
    """'bloop' corto: un tono que cae rapido, para stickers y textos"""
    n = seg(0.12)
    t = np.arange(n) / SR
    f = 320 + 700 * np.exp(-t / 0.025)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * decae(n, 0.045)
    x[:seg(0.003)] *= np.linspace(0, 1, seg(0.003))
    return x / (np.abs(x).max() + 1e-9) * 0.7


def fx_whoosh(rng):
    """aire que cruza de izquierda a derecha (estereo): la banda amarilla"""
    n = seg(0.5)
    x = pasaaltos(pasabajos(rng.standard_normal(n), 4200), 500)
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    x = x * e / (np.abs(x * e).max() + 1e-9) * 0.5
    pan = np.linspace(-0.8, 0.8, n)
    izq, der = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    return np.stack([x * izq, x * der], axis=1) * 1.414


def fx_click():
    n = seg(0.03)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 2300 * t) * decae(n, 0.006)
    return x / (np.abs(x).max() + 1e-9) * 0.6


def fx_campana():
    """dos golpes de campanita (suscribirse)"""
    out = np.zeros(seg(1.1))
    for j, f in enumerate((1318.5, 1760.0)):
        n = seg(0.9)
        t = np.arange(n) / SR
        x = (np.sin(2 * np.pi * f * t) * decae(n, 0.3) + 0.4 * np.sin(2 * np.pi * f * 2.0 * t) * decae(n, 0.12))
        i = seg(j * 0.13)
        out[i:i + n] += x[:len(out) - i]
    return out / (np.abs(out).max() + 1e-9) * 0.55


def fx_subida(rng):
    """subida de tension: ruido y tono que suben"""
    n = seg(1.1)
    t = np.arange(n) / SR
    f = 260 * (4 ** (t / t[-1]))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + pasaaltos(rng.standard_normal(n), 2000) * 0.25
    x *= np.linspace(0, 1, n) ** 2
    x[-seg(0.05):] *= np.linspace(1, 0, seg(0.05))
    return x / (np.abs(x).max() + 1e-9) * 0.5


def poner2(buf, x, t, g=1.0):
    """como poner, pero x ya es estereo"""
    i = seg(t)
    if i >= buf.shape[0] or i + len(x) <= 0:
        return
    j0 = max(0, -i)
    x = x[j0:]
    i = max(0, i)
    n = min(len(x), buf.shape[0] - i)
    buf[i:i + n] += x[:n] * g


def normalizar_voz(voz, objetivo=-19.0):
    """lleva la voz a ~-19 dBFS RMS medido solo donde se habla"""
    mono = np.abs(voz).mean(axis=1)
    w = seg(0.05)
    n = len(mono) // w
    rms = np.sqrt(np.mean(mono[:n * w].reshape(n, w) ** 2, axis=1) + 1e-12)
    hablado = rms[rms > np.percentile(rms, 50)]
    actual = 20 * np.log10(np.sqrt(np.mean(hablado ** 2)) + 1e-12)
    return voz * 10 ** ((objetivo - actual) / 20)


def limitar(x, techo=0.92):
    """limitador de picos: baja la ganancia rapido y la devuelve despacio"""
    w = seg(0.005)
    n = len(x) // w + 1
    pad = np.zeros((n * w, 2))
    pad[:len(x)] = x
    picos = np.abs(pad).reshape(n, w, 2).max(axis=(1, 2))
    g = np.minimum(1.0, techo / (picos + 1e-9))
    # mira hacia adelante un bloque y suelta en ~120 ms
    g = np.minimum(g, np.concatenate([g[1:], [1.0]]))
    suelta = np.exp(-1 / (0.12 / 0.005))
    for i in range(1, n):
        g[i] = min(g[i], g[i - 1] * suelta + (1 - suelta))
    gm = np.repeat(g, w)[:len(x)]
    return x * gm[:, None]


def envolvente_voz(voz):
    """0..1 segun cuanto se habla (ventanas de 50 ms, suavizado)"""
    mono = np.abs(voz).mean(axis=1)
    w = seg(0.05)
    n = len(mono) // w
    rms = np.sqrt(np.mean(mono[:n * w].reshape(n, w) ** 2, axis=1) + 1e-12)
    ref = np.percentile(rms, 90) + 1e-9
    k = np.clip(rms / ref, 0, 1)
    k = np.convolve(k, np.ones(8) / 8, mode='same')
    return np.interp(np.arange(len(mono)), np.arange(n) * w + w / 2, k)


# ---------------------------------------------------------------- mezcla

def leer_wav(ruta, dur, fundido=True):
    w = wave.open(ruta)
    sr, ch, n = w.getframerate(), w.getnchannels(), w.getnframes()
    x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(float) / 32768
    x = x.reshape(-1, ch)
    if ch == 1:
        x = np.repeat(x, 2, axis=1)
    if sr != SR:
        idx = np.arange(0, len(x), sr / SR)
        x = np.stack([np.interp(idx, np.arange(len(x)), x[:, c]) for c in range(2)], axis=1)
    reps = int(np.ceil(seg(dur) / len(x)))
    x = np.tile(x, (reps, 1))[:seg(dur)]
    if fundido:
        fo = seg(1.2)
        x[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return x


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dur', type=float, required=True)
    ap.add_argument('--cues', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--sin-musica', action='store_true')
    ap.add_argument('--musica', default=None, help='wav propio para el fondo')
    ap.add_argument('--bpm', type=float, default=118)
    ap.add_argument('--semilla', type=int, default=3)
    ap.add_argument('--nivel-musica', type=float, default=-21.0, help='dB RMS del fondo')
    ap.add_argument('--base', default=None, help='wav de la voz (videos largos): va a volumen original')
    ap.add_argument('--nivel-efectos', type=float, default=0.0, help='dB de los efectos')
    a = ap.parse_args()

    rng = np.random.default_rng(a.semilla)
    total = np.zeros((seg(a.dur), 2))
    voz = normalizar_voz(leer_wav(a.base, a.dur, fundido=False)) if a.base else None

    if not a.sin_musica:
        fondo = leer_wav(a.musica, a.dur) if a.musica else musica(a.dur, a.bpm, a.semilla)
        rms = np.sqrt(np.mean(fondo ** 2)) + 1e-9
        fondo *= 10 ** (a.nivel_musica / 20) / rms
        fondo = fondo[:len(total)]
        if voz is not None:
            # la musica baja hasta -10 dB mientras se habla
            k = envolvente_voz(voz)[:len(fondo)]
            fondo *= (1 - 0.68 * k)[:, None]
        total[:len(fondo)] += fondo

    efectos = {'error': fx_error(), 'bien': fx_bien(), 'ding': fx_bien(), 'paso': fx_paso(rng),
               'marca': fx_marca(), 'golpe': fx_golpe(rng), 'pop': fx_pop(), 'whoosh': fx_whoosh(rng),
               'click': fx_click(), 'campana': fx_campana(), 'subida': fx_subida(rng)}
    ganancia = {'error': 0.85, 'bien': 0.75, 'ding': 0.6, 'paso': 0.5, 'marca': 0.7, 'golpe': 0.6,
                'pop': 0.55, 'whoosh': 0.7, 'click': 0.6, 'campana': 0.6, 'subida': 0.5}
    if voz is not None:
        # en los largos los efectos acompanan a la voz: quedan unos dB por debajo
        ganancia.update({'error': 0.3, 'golpe': 0.35, 'ding': 0.45, 'bien': 0.45, 'pop': 0.6, 'whoosh': 0.8,
                         'click': 0.5, 'campana': 0.45, 'subida': 0.4, 'marca': 0.5})
    nivel = 10 ** (a.nivel_efectos / 20)
    with open(a.cues) as fh:
        cues = json.load(fh)
    for c in cues:
        x = efectos.get(c['tipo'])
        if x is None:
            continue
        g = ganancia[c['tipo']] * float(c.get('g', 1)) * nivel
        if x.ndim == 2:
            poner2(total, x, max(0.0, float(c['t'])), g)
        else:
            poner(total, x, max(0.0, float(c['t'])), g)
    if voz is not None:
        total += voz[:len(total)]

    if voz is not None:
        total = limitar(total)
    pico = np.abs(total).max()
    if pico > 0.89:
        total *= 0.89 / pico
    pcm = (np.clip(total, -1, 1) * 32767).astype(np.int16)
    w = wave.open(a.out, 'wb')
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
    w.close()
    print('pista', a.out, '·', round(a.dur, 2), 's ·', len(cues), 'efectos')


if __name__ == '__main__':
    main()
