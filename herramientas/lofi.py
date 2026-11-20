#!/usr/bin/env python3
"""
lofi.py — compone un tema lo-fi / chill hop original (sintetizado aca, sin samples ajenos:
libre de derechos) para ponerle debajo a la voz.

    python3 herramientas/lofi.py --dur 72 --out videos/lofi.wav [--version 2] [--bpm 88] [--semilla 7]

Version 1: en Fa, 88 BPM, calida. Version 2: en La menor, 92 BPM, mas nostalgica y opaca.

Piano electrico (tipo Rhodes) con acordes de septima y novena, bajo redondo, bateria
suave con swing (con --melodia, una campanita cada tanto), crujido de vinilo y un filtro calido. El
nivel es parejo de principio a fin (sin subidas ni cortes): pensado para ir ~20 dB debajo
de la voz. Se mezcla con: node herramientas/grabar-cambio.js <id> --musica-wav videos/lofi.wav
"""
import argparse
import wave

import numpy as np

SR = 48000

# ii - V - I - vi en Fa (Gm9, C13, Fmaj9, Dm9) y una vuelta con iv menor (Bbmaj7, Bbm6)
ACORDES = [
    [55, 58, 62, 65, 69],      # Gm9
    [48, 58, 62, 64, 69],      # C13 (sin la 5ta)
    [53, 57, 60, 64, 67],      # Fmaj9
    [50, 53, 57, 60, 64],      # Dm9
    [46, 50, 53, 57, 60],      # Bbmaj7 (add 9)
    [46, 49, 53, 55, 60],      # Bbm6/9
    [53, 57, 60, 64, 67],      # Fmaj9
    [52, 55, 58, 62, 65],      # Em7b5 -> vuelve
]
BAJOS = [43, 36, 41, 38, 34, 34, 41, 40]
# melodia corta (notas de la escala de Fa), una cada dos compases: (corchea, nota)
MOTIVO = [(0, 72), (1.5, 74), (3, 77), (4.5, 76), (6, 72)]

# version 2: en La menor, mas nostalgica (Am9, Dm9, Gsus/G7, Cmaj9, Fmaj7, Em7, Dm9, E7b9)
VERSIONES = {
    1: dict(acordes=ACORDES, bajos=BAJOS, motivo=MOTIVO, corte=4800, bpm=88),
    2: dict(acordes=[[57, 60, 64, 67, 71], [50, 53, 57, 60, 64], [55, 60, 62, 65, 69], [48, 52, 55, 59, 62],
                     [53, 57, 60, 64, 67], [52, 55, 59, 62, 67], [50, 53, 57, 60, 64], [52, 56, 59, 62, 65]],
            bajos=[45, 38, 43, 36, 41, 40, 38, 40],
            motivo=[(0, 76), (1, 74), (2, 72), (4, 69), (5.5, 72), (7, 71)], corte=3800, bpm=92),
}


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12.0)


def pasabajos_rapido(x, corte, orden=2):
    """filtro de un polo aplicado por bloques con numpy (para la mezcla larga)"""
    from numpy.fft import rfft, irfft, rfftfreq
    n = len(x)
    f = rfftfreq(n, 1 / SR)
    h = 1 / np.sqrt(1 + (f / corte) ** (2 * orden))
    return irfft(rfft(x) * h, n)


def rhodes(f, dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    mod = 0.9 * np.exp(-t * 6) * np.sin(2 * np.pi * f * 1.0 * t)
    x = np.sin(2 * np.pi * f * t + mod) + 0.18 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3)
    env = np.minimum(1, t / 0.012) * np.exp(-t * 1.1)
    rel = np.minimum(1, (dur - t) / 0.08)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.2 * t)
    return x * env * rel * trem * vel


def bombo(rng):
    n = int(0.38 * SR)
    t = np.arange(n) / SR
    f = 52 + 90 * np.exp(-t * 32)
    fase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(fase) * np.exp(-t * 9) * 0.95


def caja(rng):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    ruido = pasabajos_rapido(rng.standard_normal(n), 3200)
    cuerpo = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 28)
    return (0.55 * ruido * np.exp(-t * 16) + 0.5 * cuerpo) * 0.55


def charles(rng, abierto=False):
    n = int((0.16 if abierto else 0.05) * SR)
    t = np.arange(n) / SR
    r = rng.standard_normal(n)
    r = r - pasabajos_rapido(r, 6500)
    return r * np.exp(-t * (14 if abierto else 70)) * 0.22


def bajo(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.12 * np.sin(2 * np.pi * 2 * f * t)
    env = np.minimum(1, t / 0.02) * np.exp(-t * 0.9) * np.minimum(1, (dur - t) / 0.06)
    return x * env


def campanita(f, dur=0.9):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * f * 3.5 * t) * np.exp(-t * 8))
    return x * np.minimum(1, t / 0.004) * np.exp(-t * 3.2)


def poner(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i < 0:
        x, i = x[-i:], 0
    if i >= buf.shape[1] or len(x) == 0:
        return
    x = x[:buf.shape[1] - i]
    buf[0, i:i + len(x)] += x * g * (1 - pan) * 0.5 * 2 ** 0.5
    buf[1, i:i + len(x)] += x * g * (1 + pan) * 0.5 * 2 ** 0.5


def tema(dur, bpm=None, semilla=7, version=1, melodia=False):
    v = VERSIONES[version]
    bpm = bpm or v['bpm']
    rng = np.random.default_rng(semilla)
    n = int(dur * SR)
    buf = np.zeros((2, n))
    negra = 60.0 / bpm
    compas = 4 * negra
    swing = 0.18 * negra * 0.5          # la corchea de atras llega un poco tarde
    k, s = bombo(rng), caja(rng)
    total = int(np.ceil(dur / compas)) + 1
    for c in range(total):
        t0 = c * compas
        ac = v['acordes'][c % len(v['acordes'])]
        # piano: el acorde en el 1 y un empujoncito en el "y" del 2
        for j, m in enumerate(ac):
            hum = rng.uniform(0, 0.025) + j * 0.012          # rasgueo humano
            poner(buf, rhodes(hz(m), compas * 0.62, vel=0.75), t0 + hum, 0.11, pan=-0.25 + 0.12 * j)
            poner(buf, rhodes(hz(m), compas * 0.4, vel=0.55), t0 + 2.5 * negra + swing + hum, 0.08, pan=0.2 - 0.1 * j)
        # bajo
        f = hz(v['bajos'][c % len(v['bajos'])] - 12)
        poner(buf, bajo(f, negra * 2.6), t0, 0.32)
        poner(buf, bajo(f * (1.5 if c % 2 else 1.0), negra * 1.2), t0 + 3 * negra, 0.22)
        # bateria: bombo en 1 y "y" del 3, caja en 2 y 4, charles en corcheas con swing
        poner(buf, k, t0, 0.55)
        poner(buf, k, t0 + 2.5 * negra + swing, 0.4)
        if c % 4 == 3:
            poner(buf, k, t0 + 3.5 * negra + swing, 0.28)
        poner(buf, s, t0 + negra + rng.uniform(0, 0.012), 0.42)
        poner(buf, s, t0 + 3 * negra + rng.uniform(0, 0.012), 0.42)
        for e in range(8):
            te = t0 + e * negra / 2 + (swing if e % 2 else 0) + rng.uniform(-0.006, 0.006)
            poner(buf, charles(rng, abierto=(e == 7 and c % 2 == 1)), te, 0.5 if e % 2 == 0 else 0.32, pan=0.35)
        # melodia: cada dos compases, sobre los pares
        # (por defecto no va: al autor no le gusto el «tun tun» de la campanita; --melodia la pone)
        if melodia and c % 2 == 0 and c > 0:
            for (corchea, m) in v['motivo']:
                tt = t0 + corchea * negra / 2 + rng.uniform(0, 0.02)
                poner(buf, campanita(hz(m + (0 if c % 4 == 0 else -2))), tt, 0.07, pan=0.3)
    # color: todo un poco opaco, saturacion suave, temblor de cinta y vinilo
    for ch in range(2):
        buf[ch] = pasabajos_rapido(buf[ch], v['corte'], orden=1)
    buf = np.tanh(buf * 1.6) / 1.6
    wow = 1 + 0.0018 * np.sin(2 * np.pi * 0.55 * np.arange(n) / SR)
    idx = np.clip(np.cumsum(wow) - 1, 0, n - 1)
    for ch in range(2):
        buf[ch] = np.interp(idx, np.arange(n), buf[ch])
    hiss = pasabajos_rapido(rng.standard_normal(n), 6000) * 0.004
    crujido = np.zeros(n)
    pops = rng.integers(0, n, size=int(dur * 9))
    crujido[pops] = rng.uniform(0.02, 0.09, size=len(pops)) * rng.choice([-1, 1], size=len(pops))
    crujido = pasabajos_rapido(crujido, 3500) * 3
    buf += hiss + crujido
    # nivel parejo: normaliza por ventanas de 2 s (sin bombeo) y techo
    ventana = int(2 * SR)
    rms = np.sqrt(np.convolve((buf ** 2).mean(0), np.ones(ventana) / ventana, mode='same')) + 1e-6
    buf = buf * (np.median(rms) / rms) ** 0.6
    # fundidos: 1 s al entrar, 2 s al salir
    fade = np.ones(n)
    fi, fo = int(1.0 * SR), int(2.0 * SR)
    fade[:fi] = np.linspace(0, 1, fi)
    fade[-fo:] = np.linspace(1, 0, fo)
    buf *= fade
    buf *= 0.5 / np.max(np.abs(buf))          # pico en -6 dBFS
    return buf


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dur', type=float, default=72)
    ap.add_argument('--bpm', type=float, default=None, help='por defecto el de la version (88 / 92)')
    ap.add_argument('--version', type=int, default=1, choices=sorted(VERSIONES))
    ap.add_argument('--melodia', action='store_true', help='agrega la melodia de campanita (por defecto, solo la base)')
    ap.add_argument('--semilla', type=int, default=7)
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    x = tema(a.dur, a.bpm, a.semilla, a.version, a.melodia)
    with wave.open(a.out, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x.T * 32767).astype(np.int16).tobytes())
    print('listo', a.out, '%.1f s' % a.dur, 'version %d' % a.version)


if __name__ == '__main__':
    main()
