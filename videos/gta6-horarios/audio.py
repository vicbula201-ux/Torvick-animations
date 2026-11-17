#!/usr/bin/env python3
"""audio.py — música y efectos sintetizados con numpy (sin samples ni licencias).

Lee salida/cues.json (cada efecto lo registra la animación en su tiempo exacto) y escribe:
  salida/audio-crudo.wav   mezcla sin normalizar
  salida/audio.wav         normalizada a -16 LUFS (ffmpeg loudnorm en dos pasadas), pico -1.5 dBTP

Música: I–V–vi–IV en Re mayor (D–A–Bm–G) a 104 BPM — marimba, pad, bajo y batería ligera.
El primer tiempo fuerte cae justo cuando se enrolla la portada (cue m_groove) y el acorde
final, cuando se desenrolla el cierre (cue m_cierre).
"""
import json
import subprocess
import wave
from pathlib import Path

import numpy as np

SR = 48000
RAIZ = Path(__file__).resolve().parent
SAL = RAIZ / 'salida'
rng = np.random.default_rng(19112026)


# ------------------------------------------------------------------ utilidades
def tt(d):
    return np.arange(max(1, int(d * SR))) / SR


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def filtro(x, lo=None, hi=None):
    """Pasa-banda suave por FFT (Butterworth de 2.º orden aproximado en magnitud)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** 4)
    if hi:
        g *= 1 / np.sqrt(1 + (f / hi) ** 4)
    return np.fft.irfft(X * g, len(x))


def ruido(d):
    return rng.standard_normal(max(1, int(d * SR)))


def norm(x, p=1.0):
    m = np.max(np.abs(x))
    return x / m * p if m > 0 else x


def barrido(f, t):
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


# ------------------------------------------------------------------ instrumentos
def marimba(f, d=0.9, v=1.0):
    t = tt(d)
    x = (np.sin(2 * np.pi * f * t) * np.exp(-t * 6.5)
         + 0.32 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t * 24)
         + 0.10 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t * 55))
    return x * np.minimum(1, t / 0.002) * v


def pad(notas, d):
    t = tt(d + 0.8)
    x = np.zeros((2, len(t)))
    for m in notas:
        f = hz(m)
        for ch, det in ((0, -0.0045), (1, 0.0045)):
            for k in range(1, 7):
                x[ch] += (1 / k ** 1.8) * np.sin(2 * np.pi * f * k * (1 + det) * t + k * 0.7)
    ataque = np.minimum(1, t / 0.35)
    caida = np.clip((d + 0.8 - t) / 0.8, 0, 1)
    return x * ataque * caida / len(notas)


def bajo(f, d, v=1.0):
    t = tt(d)
    x = np.tanh(1.5 * (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t)))
    env = np.minimum(1, t / 0.006) * np.exp(-t * 2.0) * np.clip((d - t) / 0.03, 0, 1)
    return x * env * v


def bombo(v=1.0):
    t = tt(0.38)
    x = barrido(48 + 95 * np.exp(-t * 32), t) * np.exp(-t * 9)
    x += 0.25 * filtro(ruido(0.38), 1500) * np.exp(-t * 160)
    return x * v


def palmas(v=1.0):
    d = 0.3
    t = tt(d)
    n = filtro(ruido(d), 900, 5200)
    x = np.zeros(len(t))
    for o in (0.0, 0.011, 0.023):
        i = int(o * SR)
        x[i:] += n[i:] * np.exp(-t[: len(t) - i] * (70 if o < 0.02 else 20))
    return norm(x, 0.8) * v


def charles(v=1.0):
    t = tt(0.06)
    return filtro(ruido(0.06), 7000) * np.exp(-t * 75) * v


# ------------------------------------------------------------------ música
def musica(dur, groove, cierre):
    beat = 60 / 104
    bar = 4 * beat
    L = int((dur + 2) * SR)
    out = np.zeros((2, L))

    def put(sig, t0, g=1.0, pan=0.0):
        if sig.ndim == 1:
            a = (pan + 1) * np.pi / 4
            sig = np.vstack([sig * np.cos(a), sig * np.sin(a)]) * np.sqrt(2)
        i = int(round(t0 * SR))
        j0, i0 = max(0, -i), max(0, i)
        n = min(sig.shape[1] - j0, L - i0)
        if n > 0:
            out[:, i0:i0 + n] += g * sig[:, j0:j0 + n]

    # acordes: (pad x3, bajo)  ·  arpegios de marimba (fundamental, 3.ª, 5.ª, octava)
    ACORDES = {0: (62, 66, 69, 38), 1: (61, 64, 69, 45), 2: (62, 66, 71, 47), 3: (62, 67, 71, 43)}
    ARPS = {0: [74, 78, 81, 86], 1: [73, 76, 81, 85], 2: [74, 78, 83, 86], 3: [74, 79, 83, 86]}
    PATRON = [0, 1, 2, 1, 3, 2, 1, 2]
    g0 = groove % bar
    k = -int(np.ceil(g0 / bar)) - 1
    while True:
        tb = g0 + k * bar
        k += 1
        if tb > dur:
            break
        if tb + bar < 0:
            continue
        idx = int(round((tb - groove) / bar))
        final = tb >= cierre - 0.05
        c = 0 if final else idx % 4
        notas = ACORDES[c]
        con_ritmo = (tb >= groove - 0.01) and not final
        intro = tb < groove - 0.01
        if final:
            put(pad(notas[:3], dur - tb + 0.3), tb, 0.12)
            put(bajo(hz(notas[3]), 2.2, 1.0), tb, 0.24)
            for s, m in enumerate([74, 78, 81, 86, 90]):
                put(marimba(hz(m), 1.6, 0.9), tb + s * beat / 2, 0.15, pan=0.3 * (-1) ** s)
            put(bombo(0.9), tb, 0.3)
            break
        put(pad(notas[:3], bar), tb, 0.12 if intro else 0.10)
        for s in range(8):
            m = ARPS[c][PATRON[s]]
            v = 0.95 if s % 2 == 0 else 0.6
            put(marimba(hz(m), 0.9, v), tb + s * beat / 2, 0.15, pan=(0.25 if s % 2 == 0 else -0.25))
        if intro:   # la portada ya suena llena (bajo + charles), sin bombo ni palmas
            for s, dd in ((0, 1.6), (2, 1.6)):
                put(bajo(hz(notas[3]), dd * beat), tb + s * beat, 0.2)
            for e in range(8):
                put(charles(0.9 if e % 2 else 0.5), tb + e * beat / 2, 0.06, pan=0.35)
        if con_ritmo:
            for s, dd in ((0, 0.8), (1.5, 0.45), (2, 0.8), (3.5, 0.45)):
                put(bajo(hz(notas[3]), dd * beat), tb + s * beat, 0.22)
            put(bombo(), tb, 0.30)
            put(bombo(0.8), tb + 2 * beat, 0.30)
            if idx % 2 == 1:
                put(bombo(0.55), tb + 2.5 * beat, 0.30)
            put(palmas(), tb + beat, 0.10, pan=-0.1)
            put(palmas(), tb + 3 * beat, 0.10, pan=-0.1)
            for e in range(8):
                put(charles(0.9 if e % 2 else 0.5), tb + e * beat / 2, 0.07, pan=0.35)
    out = out[:, : int(dur * SR)]
    t = np.arange(out.shape[1]) / SR
    out *= np.minimum(1, t / 0.12) * np.clip((dur - t) / 1.1, 0, 1)
    return out


# ------------------------------------------------------------------ efectos
def campanita(f, d=1.0, parciales=((1, 1, 3.5), (2.0, 0.5, 5), (3.0, 0.22, 7), (4.2, 0.16, 9))):
    t = tt(d)
    x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * dec) for r, a, dec in parciales)
    return x * np.minimum(1, t / 0.002)


def mezclar_en(base, sig, t0, g=1.0):
    i = int(round(t0 * SR))
    n = min(len(sig), len(base) - i)
    if n > 0 and i >= 0:
        base[i:i + n] += g * sig[:n]


def s_pop():
    d = 0.14
    t = tt(d)
    k = 1 + (rng.random() - 0.5) * 0.18
    x = barrido((420 + 900 * np.exp(-t * 45)) * k, t) * np.exp(-t * 30) * np.minimum(1, t / 0.001)
    return x


def s_whoosh(d=0.5, lo=400, hi=5000):
    t = tt(d)
    return norm(filtro(ruido(d), lo, hi) * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2)


def s_rollo(d):
    x = s_whoosh(d + 0.25, 150, 1800)
    t = tt(d + 0.25)
    return x * (0.72 + 0.28 * np.sin(2 * np.pi * 15 * t))


def s_ding():
    return norm(campanita(1567.98, 1.2), 0.9)


def s_exito():
    x = np.zeros(int(1.2 * SR))
    for i, m in enumerate((86, 90, 93, 98)):
        mezclar_en(x, 0.7 * campanita(hz(m), 0.9) + 0.5 * marimba(hz(m), 0.9), i * 0.075)
    return norm(x, 0.9)


def s_error():
    x = np.zeros(int(0.5 * SR))
    for i, f in enumerate((233.1, 174.6)):
        t = tt(0.17)
        fv = f * (1 + 0.02 * np.sin(2 * np.pi * 22 * t))
        y = sum(np.sin(2 * np.pi * np.cumsum(fv * k) / SR) / k for k in (1, 3, 5, 7))
        y *= np.minimum(1, t / 0.004) * np.clip((0.17 - t) / 0.03, 0, 1)
        mezclar_en(x, filtro(y, 80, 2500), i * 0.17)
    return norm(x, 0.9)


def s_confeti():
    d = 1.0
    x = np.zeros(int(d * SR))
    t = tt(0.16)
    mezclar_en(x, filtro(ruido(0.16), 1200, 9000) * np.exp(-t * 22), 0)
    for _ in range(26):
        f = 2600 + rng.random() * 3800
        tt2 = tt(0.04)
        mezclar_en(x, 0.5 * np.sin(2 * np.pi * f * tt2) * np.exp(-tt2 * 120), 0.03 + rng.random() * 0.8)
    return norm(x, 0.9)


def s_notif():
    x = np.zeros(int(0.8 * SR))
    mezclar_en(x, campanita(1318.5, 0.6), 0)
    mezclar_en(x, campanita(1760.0, 0.7), 0.09)
    return norm(x, 0.9)


def s_tecla():
    t = tt(0.03)
    k = 0.85 + rng.random() * 0.3
    x = filtro(ruido(0.03), 1800 * k, 6500) * np.exp(-t * 260)
    x += 0.6 * np.sin(2 * np.pi * 190 * k * t) * np.exp(-t * 180)
    return norm(x, 0.8)


def s_clic():
    t = tt(0.04)
    x = filtro(ruido(0.04), 2500, 9000) * np.exp(-t * 300) + 0.6 * np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 160)
    return norm(x, 0.9)


def s_toque():
    t = tt(0.12)
    x = barrido(90 + 90 * np.exp(-t * 40), t) * np.exp(-t * 35)
    clic = s_clic()
    x[: len(clic)] += 0.35 * clic
    return norm(x, 0.9)


def s_enviar():
    d = 0.3
    t = tt(d)
    x = filtro(ruido(d), 1500, 8000) * np.sin(np.pi * t / d) ** 2
    x += 0.4 * barrido(600 + 1600 * (t / d) ** 2, t) * np.sin(np.pi * t / d)
    return norm(x, 0.9)


def s_garabato(d, lo, hi, rapidez):
    t = tt(d)
    n = filtro(ruido(d), lo, hi)
    trazos = 0.5 + 0.5 * np.sin(2 * np.pi * rapidez * t + 3 * np.sin(2 * np.pi * 2.3 * t))
    return norm(n * trazos * np.minimum(1, t / 0.03) * np.clip((d - t) / 0.05, 0, 1), 0.9)


def s_giro(d):
    x = np.zeros(int((d + 0.1) * SR))
    n = 22
    for i in range(n):
        u = i / (n - 1)
        # tiempos con ease in-out: más juntos en el medio
        tc = d * (0.5 - 0.5 * np.cos(np.pi * u))
        mezclar_en(x, 0.6 * s_clic(), tc)
    return norm(x, 0.8)


def s_tic():
    t = tt(0.08)
    x = np.sin(2 * np.pi * 1900 * t) * np.exp(-t * 90) + 0.7 * np.sin(2 * np.pi * 950 * t) * np.exp(-t * 60)
    return norm(x, 0.9)


def s_subida(d, pasos=19):
    x = np.zeros(int((d + 0.3) * SR))
    for k in range(1, pasos + 1):
        tk = d * (1 - np.sqrt(1 - k / pasos))   # cuando el contador (power2.out) cruza k
        t = tt(0.07)
        f = 700 * 2 ** (k / pasos)
        mezclar_en(x, np.sin(2 * np.pi * f * t) * np.exp(-t * 60), tk)
    return norm(x, 0.8)


def s_descarga(d):
    t = tt(d)
    f = 300 + 500 * (t / d)
    x = 0.5 * barrido(f, t) * (0.6 + 0.4 * np.sin(2 * np.pi * 12 * t)) * np.minimum(1, t / 0.1) * np.clip((d - t) / 0.1, 0, 1)
    x = filtro(x, 150, 2500)
    for k in range(1, 10):
        mezclar_en(x, 0.5 * s_tic()[: int(0.05 * SR)], d * k / 10)
    return norm(x, 0.8)


def s_obturador():
    x = np.zeros(int(0.25 * SR))
    for o in (0.0, 0.07):
        t = tt(0.05)
        mezclar_en(x, filtro(ruido(0.05), 600, 7000) * np.exp(-t * 110), o)
    return norm(x, 0.9)


def s_campana():
    x = np.zeros(int(1.4 * SR))
    for i, o in enumerate((0, 0.16, 0.32, 0.5)):
        mezclar_en(x, (1 - i * 0.2) * campanita(1975.5, 0.9, ((1, 1, 4), (2.32, 0.5, 6), (4.25, 0.25, 9))), o)
    return norm(x, 0.9)


BASE = {  # ganancia base por tipo (después se multiplica por la de cada cue)
    'pop': 0.32, 'whoosh': 0.22, 'salida': 0.14, 'rollo': 0.42, 'ding': 0.22, 'exito': 0.30,
    'error': 0.34, 'confeti': 0.24, 'notif': 0.30, 'tecla': 0.20, 'clic': 0.30, 'toque': 0.34,
    'enviar': 0.26, 'marcador': 0.13, 'lapiz': 0.10, 'giro': 0.22, 'tic': 0.30, 'subida': 0.22,
    'descarga': 0.14, 'obturador': 0.40, 'campana': 0.30,
}


def efecto(c):
    tipo, d = c['tipo'], c.get('dur', 0.5)
    if tipo == 'pop':
        return s_pop()
    if tipo == 'whoosh':
        return s_whoosh(0.45)
    if tipo == 'salida':
        return s_whoosh(0.32, 600, 6000)
    if tipo == 'rollo':
        return s_rollo(d)
    if tipo == 'ding':
        return s_ding()
    if tipo == 'exito':
        return s_exito()
    if tipo == 'error':
        return s_error()
    if tipo == 'confeti':
        return s_confeti()
    if tipo == 'notif':
        return s_notif()
    if tipo == 'tecla':
        return s_tecla()
    if tipo == 'clic':
        return s_clic()
    if tipo == 'toque':
        return s_toque()
    if tipo == 'enviar':
        return s_enviar()
    if tipo == 'marcador':
        return s_garabato(d, 1200, 4500, 7)
    if tipo == 'lapiz':
        return s_garabato(d, 2500, 9000, 11)
    if tipo == 'giro':
        return s_giro(d)
    if tipo == 'tic':
        return s_tic()
    if tipo == 'subida':
        return s_subida(d)
    if tipo == 'descarga':
        return s_descarga(d)
    if tipo == 'obturador':
        return s_obturador()
    if tipo == 'campana':
        return s_campana()
    return None


def escribir_wav(ruta, est):
    est = np.clip(est, -1, 1)
    pcm = (est.T * 32767).astype('<i2')
    with wave.open(str(ruta), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def loudnorm(entrada, salida, objetivo=-16.0):
    filtro_ln = f'loudnorm=I={objetivo}:TP=-1.5:LRA=11'
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(entrada), '-af', filtro_ln + ':print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True, check=True)
    js = r.stderr[r.stderr.rindex('{'): r.stderr.rindex('}') + 1]
    m = json.loads(js)
    f2 = (f"{filtro_ln}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(entrada), '-af', f2, '-ar', str(SR), str(salida)], check=True)
    return m


def main():
    datos = json.loads((SAL / 'cues.json').read_text())
    dur = float(datos['duracion'])
    cues = datos['cues']
    groove = next(c['t'] for c in cues if c['tipo'] == 'm_groove')
    cierre = next(c['t'] for c in cues if c['tipo'] == 'm_cierre')
    mus = musica(dur, groove, cierre)
    sfx = np.zeros(mus.shape[1] + SR)
    usados = {}
    for c in cues:
        s = efecto(c)
        if s is None:
            continue
        mezclar_en(sfx, s, c['t'], BASE[c['tipo']] * c['gan'])
        usados[c['tipo']] = usados.get(c['tipo'], 0) + 1
    sfx = sfx[: mus.shape[1]]
    mezcla = mus * 0.9 + np.vstack([sfx, sfx])
    mezcla = np.tanh(mezcla * 1.1) / 1.1          # limitador suave
    mezcla = norm(mezcla, 0.89)
    escribir_wav(SAL / 'audio-crudo.wav', mezcla)
    m = loudnorm(SAL / 'audio-crudo.wav', SAL / 'audio.wav')
    print(f'Audio: {dur:.2f} s · {sum(usados.values())} efectos · {usados}')
    print(f"Loudness de la mezcla cruda: {m['input_i']} LUFS -> normalizada a -16 LUFS (salida/audio.wav)")


if __name__ == '__main__':
    main()
