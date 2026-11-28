#!/usr/bin/env python3
"""
sincronizar.py — pone TU voz (grabada por escenas, con varias tomas) sobre un reel.

    python3 herramientas/sincronizar.py <id> <audio> [carpeta] [opciones]

      --transcripcion t.json   usa esa transcripcion (si no, la hace transcribir.py y la guarda)
      --elegir 3=2,5=1         en la escena 3 usa la toma 2, en la 5 la toma 1 (ver <id>-voz.txt)
      --plan                   solo elige y corta: no graba el video (para revisar rapido)
      --solo passa             solo las escenas de quien habla (habla: 'passa'); las otras quedan sin voz
                               (un video con dos voces grabadas por separado: ver herramientas/dialogo.py)
      --clips carpeta          deja la toma elegida de cada escena en carpeta/NN.wav (sin la ganancia) y en
                               carpeta/clips.json lo que dice cada una, palabra por palabra con su tiempo
      --quitar 110.9-113.4     lo que se dijo en esos segundos del audio no entra en ninguna toma
                               (un pedazo suelto pegado a la toma buena: "...hacia tu pie | no dejes...")

Que hace:
  1. Transcribe el audio con tiempos por palabra (herramientas/transcribir.py, en tu compu).
  2. Reparte lo que dijiste entre las escenas del reel, en orden. El guion solo orienta:
     si cambiaste las palabras, manda lo que dijiste.
  3. Elige la toma de cada escena: la ULTIMA completa y limpia (sin cortarse al final,
     sin trabarse, sin volver a empezar la frase). Si una escena la grabaste en dos partes
     (por ejemplo "aprieta el abdomen..." y "los musculos son..."), junta la mejor de cada una.
  4. Corta cada toma donde de verdad empieza y termina el sonido (no se come la ultima
     silaba) y las pega una tras otra con un respiro corto: sin silencios entre escenas.
  5. Cada escena dura lo que dura su toma (la animacion se estira sola: todo va con
     f(fraccion)) y graba el video con grabar.js --tiempos --pista.

Tu voz no se procesa: solo se corta y el volumen se ajusta parejo (la misma ganancia para
todo). Deja en la carpeta (por defecto ./videos):
  <id>-voz.mp4   el reel con tu voz + las X y los vistos
  <id>-voz.wav   la pista de voz sola, ya sincronizada (para Premiere)
  <id>-voz.txt   que toma se eligio en cada escena (y las otras, numeradas para --elegir)
"""
import argparse
import difflib
import json
import os
import re
import subprocess
import sys
import unicodedata
import wave

import numpy as np

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
PAUSA_TOMA = 0.6      # una pausa mas larga separa dos tomas
RESPIRO = 0.1         # silencio entre la linea de una escena y la de la siguiente
RESPIRO_PARTES = 0.16  # entre dos partes de una misma escena que vienen de tomas distintas
PAUSA_MAX = 0.32      # las pausas largas dentro de una toma se acortan a esto
STOP = set(('el la los las lo de del y e a al en tu tus te que con por para un una uno unos unas es se '
            'mi mis su sus sin o u ni le les me nos ya mas muy este esta eso esa').split())


def sin_tildes(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')


NUMEROS = {'0': 'cero', '1': 'uno', '2': 'dos', '3': 'tres', '4': 'cuatro', '5': 'cinco', '6': 'seis', '7': 'siete',
           '8': 'ocho', '9': 'nueve', '10': 'diez'}


def norm(p):
    t = re.sub(r'[^a-z0-9]', '', sin_tildes(p.lower()))
    # el reconocedor escribe "2." donde dijiste "dos": se comparan como la misma palabra
    return NUMEROS.get(t, t)


def tokens(texto):
    return [t for t in (norm(w) for w in re.split(r'[\s\-/]+', texto)) if t]


SUFIJOS = sorted(('iendolo andolo amente mente ando iendo ados adas idos idas ado ada ido ida arlo erlo irlo '
                  'alo elo ar er ir as es an en os o a e s').split(), key=len, reverse=True)


def raiz(t):
    for s in SUFIJOS:
        if t.endswith(s) and len(t) - len(s) >= 3:
            return t[:-len(s)]
    return t


def fon(t):
    """como suena (el reconocedor a veces escribe 'brachial' por 'braquial' u 'ocempic' por 'Ozempic')"""
    t = t.replace('qu', 'k').replace('ch', 'k').replace('ll', 'y').replace('rr', 'r').replace('z', 's').replace('v', 'b').replace('h', '')
    t = re.sub(r'c([aou])', r'k\1', t)
    return re.sub(r'c([ei])', r's\1', t)


def parecidas(a, b):
    if a == b:
        return True
    if min(len(a), len(b)) < 4:
        return False
    ra, rb = raiz(a), raiz(b)
    if len(ra) >= 3 and ra == rb:
        return True
    if min(len(a), len(b)) >= 5 and a[:5] == b[:5]:
        return True
    return difflib.SequenceMatcher(None, a, b).ratio() >= 0.82


def igual(a, b):
    if parecidas(a, b) or (min(len(a), len(b)) >= 4 and parecidas(fon(a), fon(b))):
        return True
    # palabras pegadas por el reconocedor ("pre-banca" -> "prebanca" contiene "banca")
    corta, larga = (a, b) if len(a) <= len(b) else (b, a)
    return len(corta) >= 5 and corta in larga


def peso(t):
    return 0.25 if t in STOP else 1.0


def cobertura(take_t, obj_t):
    """que parte del objetivo (peso de sus palabras) aparece, en orden, en la toma, y en que
    lugar de la toma (el promedio de las palabras que coinciden, 0..1)"""
    n, m = len(obj_t), len(take_t)
    if not n or not m:
        return 0.0, 0.0
    dp = np.zeros((n + 1, m + 1))
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            dp[i, j] = max(dp[i - 1, j], dp[i, j - 1],
                           dp[i - 1, j - 1] + (peso(obj_t[i - 1]) if igual(obj_t[i - 1], take_t[j - 1]) else 0))
    total = sum(peso(t) for t in obj_t)
    i, j, js = n, m, []
    while i > 0 and j > 0:
        if dp[i, j] == dp[i - 1, j]:
            i -= 1
        elif dp[i, j] == dp[i, j - 1]:
            j -= 1
        else:
            js.append(j - 1)
            i -= 1
            j -= 1
    centro = (sum(js) / len(js) / max(1, m - 1)) if js else 0.0
    return (dp[n, m] / total if total else 0.0), centro


# ---------------------------------------------------------------- audio
def leer_audio(ruta):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', ruta, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(out, dtype=np.float32).copy()


def envolvente(x):
    """dB cada 10 ms: el mayor entre la senal y sus agudos (las s y las f finales cuentan)"""
    hop = SR // 100
    n = len(x) // hop
    a = x[:n * hop].reshape(n, hop)
    hp = np.diff(np.concatenate([x[:n * hop], [0.0]])).reshape(n, hop)
    e1 = np.sqrt(np.mean(a ** 2, axis=1) + 1e-12)
    e2 = np.sqrt(np.mean(hp ** 2, axis=1) + 1e-12) * 2.0
    return 20 * np.log10(np.maximum(e1, e2))


class Sonido:
    def __init__(self, x):
        self.x = x
        self.db = envolvente(x)
        piso = np.percentile(self.db, 12)
        voz = np.percentile(self.db, 90)
        # umbral: un poco arriba del ruido de la sala, siempre lejos de la voz
        self.umbral = max(piso + 8, voz - 38)
        self.piso, self.voz = piso, voz

    def fr(self, t):
        return int(max(0, min(len(self.db) - 1, round(t * 100))))

    def inicio(self, t, limite, hasta=None):
        """donde arranca de verdad el sonido de una palabra que el reconocedor ubica en t.
        Despues de una pausa, t suele llegar ~0,3 s antes que la voz: se avanza hasta el
        sonido claro. Si en t ya suena, se retrocede (sin la respiracion, maximo 0,12 s)."""
        f = self.fr(t)
        if self.db[f] <= self.umbral + 4:
            tope = self.fr(min(hasta if hasta else t + 0.6, t + 0.6))
            while f < tope and self.db[f] <= self.umbral + 4:
                f += 1
            return max(limite, f / 100 - 0.05)
        lim = self.fr(max(limite, t - 0.12))
        while f > lim and self.db[f - 1] > self.umbral + 4:
            f -= 1
        return max(limite, f / 100 - 0.04)

    def fin(self, ini_ultima, fin_asr, limite):
        """donde termina de verdad el sonido: 120 ms seguidos por debajo del umbral. Si la voz vuelve
        enseguida (antes de 0,3 s y antes de la palabra que sigue), era una pausa dentro de la frase: el
        reconocedor ubico la ultima palabra antes de tiempo ("...por una | vez?") y cortar ahi se la comia"""
        f = self.fr(ini_ultima + 0.12)
        tope = self.fr(min(limite, ini_ultima + 2.4))
        quietos = 0
        while f < tope:
            if self.db[f] < self.umbral - 3:
                quietos += 1
                if quietos >= 12:
                    # vuelve la voz: 150 ms seguidos con sonido y fuerte (no un clic, una respiracion ni
                    # un "mm" suelto: esos duran menos)
                    g, vuelve = f + 1, self.fr(min(limite - 0.1, f / 100 + 0.3))
                    while g < vuelve and not (g + 15 <= len(self.db) and min(self.db[g:g + 15]) > self.umbral + 6
                                              and max(self.db[g:g + 15]) > self.voz - 20):
                        g += 1
                    if g >= vuelve:
                        return min(limite, (f - 11) / 100 + 0.08)
                    f, quietos = g, 0
                    tope = self.fr(min(limite, max(f / 100 + 1.2, ini_ultima + 2.4)))
            else:
                quietos = 0
            f += 1
        return min(limite, max(fin_asr, ini_ultima + 0.25) + 0.05)


# ---------------------------------------------------------------- reparto
def partes_de(vo):
    out = []
    for p in re.split(r'[.:;?!¿¡]+', vo):
        t = tokens(p)
        if not t:
            continue
        if re.fullmatch(r'error (uno|dos|tres|cuatro|\d+)', ' '.join(t)):
            continue   # "Error uno:" lo dice el rotulo, no la voz
        if sum(peso(x) for x in t) < 1.0:
            continue
        out.append({'texto': p.strip(), 't': t})
    return out


def repartir(W, escenas):
    """a que escena va cada palabra (o -1, ninguna): en orden, como se grabo"""
    S, N = len(escenas), len(W)
    voc = [e['voc'] for e in escenas]
    NEG = -1e18
    emis = np.zeros((N, S))
    for i, w in enumerate(W):
        if w.get('fuera'):
            emis[i, :] = -50.0
            continue
        for k in range(S):
            c = peso(w['t'])
            # lo que no esta en el guion resta poco: cambiaste las palabras, no la idea
            emis[i, k] = c if any(igual(w['t'], v) for v in voc[k]) else -0.22 * c

    def pen(i):
        # cambiar de escena (o descartar) en medio de una frase dicha de corrido cuesta mucho
        if i == 0:
            return 0.2
        g = W[i]['ini'] - W[i - 1]['fin']
        if g >= 0.3 or re.search(r'[.?!…]$', W[i - 1]['p']):
            return 0.4
        return 0.7 if g >= 0.15 else 2.5

    # estado: (ultima escena k+1, 0 = hablando de k, 1 = descarte)
    best = np.full((S + 1, 2), NEG)
    best[0, 1] = 0.0
    atras = []
    for i in range(N):
        nb = np.full((S + 1, 2), NEG)
        bk = {}
        p = pen(i)
        for k in range(-1, S):
            for j in (0, 1):
                cur = best[k + 1, j]
                if cur <= NEG / 2:
                    continue
                if j == 0:
                    v = cur + emis[i, k]
                    if v > nb[k + 1, 0]:
                        nb[k + 1, 0] = v
                        bk[(k, 0)] = (k, 0)
                for k2 in range(max(k, 0), S):
                    if j == 0 and k2 == k:
                        continue
                    v = cur - p + emis[i, k2]
                    if v > nb[k2 + 1, 0]:
                        nb[k2 + 1, 0] = v
                        bk[(k2, 0)] = (k, j)
                v = cur - (p if j == 0 else 0.0)
                if v > nb[k + 1, 1]:
                    nb[k + 1, 1] = v
                    bk[(k, 1)] = (k, j)
        best = nb
        atras.append(bk)
    k, j = np.unravel_index(np.argmax(best), best.shape)
    est = (int(k) - 1, int(j))
    etiquetas = [-1] * N
    for i in range(N - 1, -1, -1):
        etiquetas[i] = est[0] if est[1] == 0 else -1
        est = atras[i][est]
    return etiquetas


def tomas_de(W, etiquetas, k, vocs=None):
    """las tomas de la escena k: palabras seguidas suyas, cortadas en las pausas largas"""
    tomas, cur = [], None
    for i, w in enumerate(W):
        if etiquetas[i] != k:
            continue
        if cur is not None and (w['ini'] - W[cur[-1]]['fin'] >= PAUSA_TOMA or
                                any(etiquetas[x] not in (k, -1) for x in range(cur[-1] + 1, i))):
            tomas.append(cur)
            cur = None
        if cur is None:
            cur = []
        # palabras descartadas en medio de la toma (sin pausa) son parte de lo que dijiste
        if cur and any(W[x].get('fuera') for x in range(cur[-1] + 1, i)):
            tomas.append(cur)
            cur = []
        if cur:
            cur.extend(range(cur[-1] + 1, i))
        cur.append(i)
    if cur:
        tomas.append(cur)

    def corte(i):
        # hay corte natural antes de la palabra i: puntuacion o una pausa
        return i <= 0 or i >= len(W) or bool(re.search(r'[.?!,;:…]$', W[i - 1]['p'])) or W[i]['ini'] - W[i - 1]['fin'] >= 0.25
    def ajena(i):
        # una palabra de contenido de OTRA escena (y no de esta): ahi empieza otra cosa
        if not vocs or peso(W[i]['t']) < 1:
            return False
        return (not any(igual(W[i]['t'], v) for v in vocs[k]) and
                any(igual(W[i]['t'], v) for q, vv in enumerate(vocs) if q != k for v in vv))
    out = []
    for t in tomas:
        a, b = t[0], t[-1]
        while not corte(a) and etiquetas[a - 1] == -1 and not ajena(a - 1) and not W[a - 1].get('fuera') and t[0] - a < 8:
            a -= 1
        while not corte(b + 1) and b + 1 < len(W) and etiquetas[b + 1] == -1 and not ajena(b + 1) and not W[b + 1].get('fuera') and b - t[-1] < 4:
            b += 1
        out.append(list(range(a, t[0])) + t + list(range(t[-1] + 1, b + 1)))
    return out


def partir_reinicios(W, idx):
    """'los musculos principales... los musculos principales son...': cada intento queda como su
    propia toma (el primero puede estar completo o haberse cortado; lo decide la cobertura)"""
    t = [W[i]['t'] for i in idx]
    puntuada = any(re.search(r'[.?!]$', W[i]['p']) for i in idx)

    def inicio(q):
        return (q == cortes[-1] or bool(re.search(r'[.?!,;:]$', W[idx[q] - 1]['p']))
                or W[idx[q]]['ini'] - W[idx[q] - 1]['fin'] >= 0.3)
    cortes, j = [0], 1
    while j < len(t) - 2:
        # un reinicio repite el COMIENZO de una oracion ("los musculos principales... los musculos...");
        # sin puntuacion en la transcripcion no se sabe donde empiezan, y vale cualquier lugar
        # sin puntuacion no se sabe donde empieza cada oracion: hace falta repetir mas ("que tu rodilla"
        # se repite dentro de una misma frase bien dicha)
        previos = [i for i in range(cortes[-1], j)
                   if all(igual(t[i + q], t[j + q]) for q in range(3)) and sum(peso(t[j + q]) for q in range(3)) >= (1.5 if puntuada else 2.0)
                   and (not puntuada or inicio(i))]
        hay = bool(previos)
        if hay:
            # lo que empezaste y dejaste ("...anterior y lateral, con ayuda del pectoral, el cerracto. Con ayuda
            # del pectoral, el serrato y el triceps"): el intento abandonado queda aparte del resto de la toma
            i0 = previos[-1]
            if i0 > cortes[-1] and re.search(r'[.?!,;:]$', W[idx[i0] - 1]['p']):
                cortes.append(i0)
            c = j
            while c - 1 > cortes[-1] and not re.search(r'[.?!]$', W[idx[c - 1]]['p']) and j - c < 8:
                c -= 1
            if c - 1 > cortes[-1] and re.search(r'[.?!]$', W[idx[c - 1]]['p']):
                j2 = c
            else:
                j2 = j
            cortes.append(j2)
            j = j2 + 3
        else:
            j += 1
    cortes.append(len(idx))
    # otro intento con otras palabras ("los tres mejores ejercicios de pecho segun la ciencia. top tres
    # ejercicios de pecho segun la ciencia."): dos oraciones seguidas que dicen casi lo mismo
    fin_oracion = [q + 1 for q in range(len(idx) - 1) if re.search(r'[.?!]$', W[idx[q]]['p'])]
    def contenido(a, b):
        return set(raiz(x) for x in t[a:b] if peso(x) >= 1)
    extra = []
    for q in fin_oracion:
        a0 = max([c for c in cortes + extra if c < q] + [0])
        a0 = max([a0] + [r for r in fin_oracion if r < q])
        sig = [r for r in fin_oracion if r > q] + [len(idx)]
        b0 = sig[0]
        # "Tres." solo no alcanza: el intento sigue en la oracion siguiente ("Tres. Curl nordico")
        if len(contenido(q, b0)) < 2 and len(sig) > 1:
            b0 = sig[1]
        A, B = contenido(a0, q), contenido(q, b0)
        comun = sum(1 for x in B if any(igual(x, y) for y in A))
        if len(A) >= 2 and len(B) >= 2 and comun >= 0.6 * max(len(A), len(B)) and q not in cortes:
            extra.append(q)
    cortes = sorted(set(cortes + extra))
    return [(idx[a:b], n > 0) for n, (a, b) in enumerate(zip(cortes[:-1], cortes[1:])) if b > a]


def recortar_bordes(W, idx, voc):
    """saca al principio y al final de una toma las oraciones cortas que no son de la escena: el "No."
    de una correccion ("No. Dos, press inclinado con barra") o el "1." que anuncia la escena siguiente"""
    def oraciones(ix):
        out, cur = [], []
        for i in ix:
            cur.append(i)
            if re.search(r'[.?!]$', W[i]['p']):
                out.append(cur)
                cur = []
        if cur:
            out.append(cur)
        return out
    def ajena(o):
        return len(o) <= 2 and not any(igual(W[i]['t'], v) for i in o for v in voc)
    fr = oraciones(idx)
    # al final, un intento que volviste a empezar y dejaste ("...hacia adelante. Sujetate de los brazos, no,")
    if len(fr) > 1 and not re.search(r'[.?!]$', W[fr[-1][-1]]['p']) and igual(W[fr[-1][0]]['t'], W[fr[0][0]]['t']) and peso(W[fr[0][0]]['t']) >= 1:
        fr = fr[:-1]
    while len(fr) > 1 and ajena(fr[0]):
        fr = fr[1:]
    while len(fr) > 1 and ajena(fr[-1]):
        fr = fr[:-1]
    return [i for o in fr for i in o]


def evaluar(W, idx, escena, vocab_total, cuenta):
    texto = ' '.join(W[i]['p'] for i in idx)
    t = [W[i]['t'] for i in idx]
    ult = t[-1] if t else ''
    # termina en una palabra que no cierra ("con", "del"...) sin punto final: se corto ("¿...eres tu?" no)
    cortada = (ult in STOP and not re.search(r'[.?!]\s*$', texto)) or bool(re.search(r'(\.\.\.|…)\s*$', texto))
    trabada = '...' in texto[:-3] or '…' in texto[:-1]
    dudosas = []
    for x in t:
        if len(x) < 5 or any(igual(x, v) for v in escena['voc']):
            continue
        r = max([difflib.SequenceMatcher(None, x, v).ratio() for v in escena['voc'] if len(v) >= 4] or [0])
        if (0.6 <= r < 0.82 and cuenta.get(x, 0) <= 1) or 0.72 <= r < 0.82:
            dudosas.append(x)
    cc = [cobertura(t, p['t']) for p in escena['partes']]
    return {'texto': texto, 'cortada': cortada, 'trabada': trabada or bool(dudosas), 'dudosas': dudosas,
            'cub': [q[0] for q in cc], 'centro': [q[1] for q in cc]}


def elegir(tomas, P):
    """la ultima toma completa y limpia; si no hay, la mejor de cada parte"""
    def cubre(tm, p):
        return tm['ev']['cub'][p] >= 0.45 if P else True

    def limpia(tm):
        return not tm['ev']['cortada'] and not tm['ev']['trabada']

    def mejor_despues(tm, q):
        # otra toma, grabada despues, que dice mejor la parte q
        return any(t2['ini'] > tm['ini'] and t2['ev']['cub'][q] > tm['ev']['cub'][q] + 0.15 for t2 in tomas)

    def racha(tm, p):
        # partes seguidas que la toma dice, y en el mismo orden que el guion
        n = 0
        while p + n < max(P, 1) and cubre(tm, p + n) and (n == 0 or tm['ev']['centro'][p + n] > tm['ev']['centro'][p + n - 1]):
            if n > 0 and P and mejor_despues(tm, p + n):
                break
            n += 1
        return n

    if not tomas:
        return []
    if not P:
        lim = [tm for tm in tomas if limpia(tm)] or tomas
        return [lim[-1]]
    elegidas, p = [], 0
    def libre(tm):
        return all(tm['fin'] < q['ini'] or tm['ini'] > q['fin'] for q in elegidas)
    while p < P:
        c = [tm for tm in tomas if cubre(tm, p) and libre(tm)]
        if not c:
            p += 1
            continue
        lim = [tm for tm in c if limpia(tm)]
        pool = lim or c
        # entre las que dicen (casi) todo lo de esa parte, la ultima: la que te quedo bien
        tope = max(tm['ev']['cub'][p] for tm in pool)
        pool = [tm for tm in pool if tm['ev']['cub'][p] >= tope - 0.3]
        # a igual racha y comienzo, la mas corta: la oracion sola, sin lo que se va a tomar de otra toma
        mejor = max(pool, key=lambda tm: (racha(tm, p), tm['ini'], -len(tm['idx'])))
        elegidas.append(mejor)
        p += max(1, racha(mejor, p))
    return elegidas


# ---------------------------------------------------------------- armado
def tramos_de_toma(W, idx, son, todos_idx):
    """[ini, fin] de la toma en el audio original, con las pausas largas acortadas"""
    dentro = set(idx)
    a, b = idx[0], idx[-1]
    prev_fin = max([W[i]['fin'] for i in range(0, a) if i not in dentro] or [0.0])
    sig_ini = min([W[i]['ini'] for i in range(b + 1, len(W)) if i not in dentro] or [len(son.x) / SR])
    ini = son.inicio(W[a]['ini'], prev_fin + 0.02, W[a]['fin'])
    tramos, t0 = [], ini
    # donde empieza de verdad cada palabra: el reconocedor a veces la ubica antes de que suene
    # ("Bueno," marcado 0,4 s antes); el fin se busca desde ahi, si no la palabra se daba por
    # terminada antes de empezar y el corte se la comia
    empieza = ini
    for x, y in zip(idx[:-1], idx[1:]):
        g0 = son.fin(max(W[x]['ini'], empieza), W[x]['fin'], W[y]['ini'])
        g1 = son.inicio(W[y]['ini'], g0, W[y]['fin'])
        if g1 - g0 > PAUSA_MAX:
            tramos.append([t0, g0 + PAUSA_MAX / 2])
            t0 = g1 - PAUSA_MAX / 2
        # (si ahi no suena nada, el reconocedor la puso tarde: vale su tiempo, no se empuja el fin al silencio)
        empieza = g1 if son.db[son.fr(g1 + 0.05)] > son.umbral + 4 else W[y]['ini']
    # la ultima palabra tambien termina contando desde donde de verdad empieza
    fin = son.fin(max(W[b]['ini'], empieza), W[b]['fin'], sig_ini - 0.03)
    tramos.append([t0, max(fin, t0 + 0.2)])
    tramos = [q for q in tramos if q[1] - q[0] > 0.02]
    return tramos


def cortar(x, a, b):
    i, j = int(round(a * SR)), int(round(b * SR))
    y = x[max(0, i):max(0, j)].copy()
    f = min(len(y) // 2, int(0.008 * SR))
    if f > 0:
        y[:f] *= np.linspace(0, 1, f)
        y[-f:] *= np.linspace(1, 0, f)
    return y


def escribir_wav(ruta, y):
    pcm = (np.clip(y, -1, 1) * 32767).astype(np.int16)
    with wave.open(ruta, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def fmt(t):
    m = int(t // 60)
    return '%02d:%05.2f' % (m, t - 60 * m)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('id')
    ap.add_argument('audio')
    ap.add_argument('carpeta', nargs='?', default='videos')
    ap.add_argument('--transcripcion')
    ap.add_argument('--elegir', default='')
    ap.add_argument('--plan', action='store_true')
    ap.add_argument('--quitar', default='')
    ap.add_argument('--solo', default='')
    ap.add_argument('--clips', default='')
    a = ap.parse_args()
    salida = os.path.abspath(a.carpeta)
    trabajo = os.path.join(salida, a.id + '-voz')
    os.makedirs(trabajo, exist_ok=True)

    # 1. escenas del reel
    fg = os.path.join(trabajo, 'guion.json')
    subprocess.run(['node', os.path.join(RAIZ, 'herramientas', 'grabar.js'), a.id, salida, '--solo-guion', fg], check=True)
    guion = json.load(open(fg))

    # 2. transcripcion
    ft = a.transcripcion or os.path.join(trabajo, 'transcripcion.json')
    if not os.path.exists(ft):
        subprocess.run([sys.executable, os.path.join(RAIZ, 'herramientas', 'transcribir.py'), a.audio, '--out', ft], check=True)
    tr = json.load(open(ft))
    W = []
    for w in tr['palabras']:
        t = norm(w['p'])
        if t:
            W.append({'p': w['p'].strip(), 't': t, 'ini': float(w['ini']), 'fin': float(w['fin'])})
    for tramo in filter(None, a.quitar.split(',')):
        q0, q1 = (float(x) for x in tramo.split('-'))
        for w in W:
            if w['ini'] >= q0 - 0.05 and w['fin'] <= q1 + 0.05:
                w['fuera'] = True
    cuenta = {}
    for w in W:
        cuenta[w['t']] = cuenta.get(w['t'], 0) + 1

    escenas = []
    for e in guion:
        vo = e.get('vo') or ''
        if a.solo and (e.get('habla') or 'tor') != a.solo:
            vo = ''
        partes = partes_de(vo)
        voc = sorted(set(t for p in partes for t in p['t']))
        escenas.append({'nombre': e['nombre'], 'dur': e['dur'], 'vo': vo, 'partes': partes, 'voc': voc})

    # 3. reparto y tomas
    etiquetas = repartir(W, escenas)
    forzar = {}
    for par in filter(None, a.elegir.split(',')):
        k, n = par.split('=')
        forzar[int(k)] = [int(x) for x in n.split('+')]
    son = Sonido(leer_audio(a.audio))
    tomas_por = []
    for k, e in enumerate(escenas):
        tomas = []
        for idx in tomas_de(W, etiquetas, k, [e['voc'] for e in escenas]):
            for crudo, rein in partir_reinicios(W, idx):
                idx2 = recortar_bordes(W, crudo, tokens(e['vo']))
                ev = evaluar(W, idx2, e, None, cuenta)
                tomas.append({'idx': idx2, 'crudo': crudo, 'ini': W[idx2[0]]['ini'], 'fin': W[idx2[-1]]['fin'], 'recortada': rein, 'ev': ev})
                # cada oracion de la toma tambien puede ir sola (si dijo las partes en otro orden)
                frases, cur = [], []
                for i in idx2:
                    cur.append(i)
                    if re.search(r'[.?!]$', W[i]['p']):
                        frases.append(cur)
                        cur = []
                if cur:
                    frases.append(cur)
                if len(frases) > 1:
                    # (con una sola parte tambien: "La grasa esta llevando a... Las grasas te ayudan a producir...")
                    for fr in frases:
                        if sum(peso(W[i]['t']) for i in fr) >= 2:
                            tomas.append({'idx': fr, 'ini': W[fr[0]]['ini'], 'fin': W[fr[-1]]['fin'], 'recortada': True, 'frase': True,
                                          'ev': evaluar(W, fr, e, None, cuenta)})
                    # y sus comienzos (las primeras oraciones): si lo ultimo se toma de un intento posterior
                    for m in (range(2, len(frases)) if len(e['partes']) > 1 else []):
                        fr = [i for q in frases[:m] for i in q]
                        tomas.append({'idx': fr, 'ini': W[fr[0]]['ini'], 'fin': W[fr[-1]]['fin'], 'recortada': True, 'frase': True, 'oculta': True,
                                      'ev': evaluar(W, fr, e, None, cuenta)})
        tomas_por.append(tomas)
    # lo que quedo sin escena (por ejemplo, la accion grabada despues del cierre): si se parece
    # claramente a una escena, entra como otra toma suya
    sueltas, cur = [], []
    for i, w in enumerate(W):
        if etiquetas[i] == -1 and (not cur or w['ini'] - W[cur[-1]]['fin'] < PAUSA_TOMA):
            cur.append(i)
            continue
        if cur:
            sueltas.append(cur)
        cur = [i] if etiquetas[i] == -1 else []
    if cur:
        sueltas.append(cur)
    for idx in sueltas:
        for idx2, rein in partir_reinicios(W, idx):
            if sum(peso(W[i]['t']) for i in idx2) < 2.5:
                continue
            notas = []
            for k, e in enumerate(escenas):
                if not e['partes']:
                    continue
                ev = evaluar(W, idx2, e, None, cuenta)
                notas.append((sum(ev['cub']) / len(ev['cub']), k, ev))
            notas.sort(key=lambda q: -q[0])
            if notas and notas[0][0] >= 0.6 and (len(notas) < 2 or notas[0][0] - notas[1][0] >= 0.2):
                _, k, ev = notas[0]
                tomas_por[k].append({'idx': idx2, 'ini': W[idx2[0]]['ini'], 'fin': W[idx2[-1]]['fin'], 'recortada': rein, 'ev': ev})
    # una toma que quedo en otra escena (volviste a grabar "uno, dos, tres" de nuevo, fuera de orden):
    # si dice claramente lo de otra escena y no lo de la suya, se pasa a esa escena
    def cub_principal(ev, e):
        cs = [c for c, p in zip(ev['cub'], e['partes']) if not all(x in NUMEROS.values() for x in p['t'])]
        return sum(cs) / len(cs) if cs else 0.0
    for k in range(len(escenas)):
        quedan = []
        for tm in tomas_por[k]:
            if tm.get('frase') or not escenas[k]['partes'] or 'crudo' not in tm:
                quedan.append(tm)
                continue
            propia, mejor = cub_principal(tm['ev'], escenas[k]), None
            for j, e2 in enumerate(escenas):
                if j == k or not e2['partes']:
                    continue
                ix = recortar_bordes(W, tm['crudo'], tokens(e2['vo']))
                ev2 = evaluar(W, ix, e2, None, cuenta)
                c2 = cub_principal(ev2, e2)
                if c2 >= 0.6 and c2 - propia >= 0.3 and (mejor is None or c2 > mejor[0]):
                    mejor = (c2, j, ix, ev2)
            if mejor:
                _, j, ix, ev2 = mejor
                tomas_por[j].append(dict(tm, idx=ix, ini=W[ix[0]]['ini'], fin=W[ix[-1]]['fin'], ev=ev2))
            else:
                quedan.append(tm)
        tomas_por[k] = quedan
    plan = []
    for k, e in enumerate(escenas):
        tomas = sorted(tomas_por[k], key=lambda tm: tm['ini'])
        if k + 1 in forzar:
            elegidas = [tomas[n - 1] for n in forzar[k + 1] if 0 < n <= len(tomas)]
        else:
            elegidas = elegir(tomas, len(e['partes']))
        plan.append({'escena': e, 'tomas': tomas, 'elegidas': elegidas})

    # 4. cortes y pista
    x = son.x
    piezas, t, limites = [], 0.05, [0.0]
    for k, q in enumerate(plan):
        trozos, dichas, largo = [], [], 0.0
        for n, tm in enumerate(q['elegidas']):
            tramos = tramos_de_toma(W, tm['idx'], son, None)
            for u, v in tramos:
                trozos.append(cortar(x, u, v))
                # las palabras de este tramo, en el tiempo de la toma (para los subtitulos); la que el
                # reconocedor ubica en un hueco que se corto (antes de que suene) va al tramo mas cercano
                for i in tm['idx']:
                    m = (W[i]['ini'] + W[i]['fin']) / 2
                    cerca = min(tramos, key=lambda q: 0 if q[0] <= m <= q[1] else min(abs(m - q[0]), abs(m - q[1])))
                    if cerca == [u, v]:
                        a0 = min(max(W[i]['ini'], u), v - 0.05)
                        dichas.append([round(largo + a0 - u, 3), round(largo + max(a0 + 0.05, min(v, W[i]['fin'])) - u, 3), W[i]['p']])
                largo += len(trozos[-1]) / SR
            if n < len(q['elegidas']) - 1:
                trozos.append(np.zeros(int(RESPIRO_PARTES * SR)))
                largo += len(trozos[-1]) / SR
        clip = np.concatenate(trozos) if trozos else np.zeros(0)
        q['clip'] = clip
        q['dichas'] = dichas
        q['t'] = t
        dur_voz = len(clip) / SR
        ultima = k == len(plan) - 1
        if dur_voz > 0:
            fin_escena = t + dur_voz + (0.5 if ultima else RESPIRO)
            minimo = 3.0 if ultima else 1.4
            d = max(minimo, fin_escena - limites[-1] - (0 if ultima else 0.06))
        else:
            d = q['escena']['dur'] if (ultima or 'Comenta' in q['escena']['nombre']) else 2.0
        limites.append(limites[-1] + d)
        piezas.append((t, clip))
        t = limites[-1] + 0.06
    total = limites[-1]
    durs = [round(limites[i + 1] - limites[i], 3) for i in range(len(plan))]
    if a.clips:
        os.makedirs(a.clips, exist_ok=True)
        info = {}
        for k, q in enumerate(plan):
            if len(q['clip']):
                escribir_wav(os.path.join(a.clips, '%02d.wav' % (k + 1)), q['clip'])
                info[k + 1] = {'texto': ' / '.join(tm['ev']['texto'] for tm in q['elegidas']), 'dur': len(q['clip']) / SR,
                               'palabras': q['dichas']}
        json.dump(info, open(os.path.join(a.clips, 'clips.json'), 'w'), ensure_ascii=False, indent=1)
    pista = np.zeros(int(np.ceil((total + 0.1) * SR)), dtype=np.float32)
    for t0, clip in piezas:
        i = int(round(t0 * SR))
        n = min(len(clip), len(pista) - i)
        if n > 0:
            pista[i:i + n] += clip[:n]
    # volumen parejo: la misma ganancia para todo (-19 dBFS RMS donde se habla), sin tocar el timbre
    hop = SR // 20
    nb = len(pista) // hop
    rms = np.sqrt(np.mean(pista[:nb * hop].reshape(nb, hop) ** 2, axis=1) + 1e-12)
    habl = rms[rms > np.percentile(rms, 50)]
    g = 10 ** ((-19 - 20 * np.log10(np.sqrt(np.mean(habl ** 2)) + 1e-12)) / 20)
    pico = np.abs(pista).max() * g
    if pico > 0.95:
        g *= 0.95 / pico
    pista *= g
    fwav = os.path.join(salida, a.id + '-voz.wav')
    escribir_wav(fwav, pista)

    # 5. informe
    lin = ['VOZ SINCRONIZADA · ' + a.id + ' · ' + ('%.1f' % total) + ' s',
           'Audio: ' + os.path.basename(a.audio),
           'Para cambiar una toma: --elegir <escena>=<toma> (dos partes: 4=2+5)', '']
    for k, q in enumerate(plan):
        e = q['escena']
        lin.append('%d. %s  [%s - %s]  %.2f s' % (k + 1, e['nombre'].upper(), fmt(limites[k]), fmt(limites[k + 1]), durs[k]))
        lin.append('   guion: ' + e['vo'])
        if not q['tomas']:
            lin.append('   (sin voz: no encontre esta linea en la grabacion)')
        for n, tm in enumerate(q['tomas']):
            if tm.get('oculta') and tm not in q['elegidas']:
                continue
            ev = tm['ev']
            marca = '>>' if tm in q['elegidas'] else '  '
            notas = []
            if ev['cortada']:
                notas.append('cortada')
            if ev['trabada']:
                notas.append('trabada' + (' (' + ', '.join(ev['dudosas']) + ')' if ev['dudosas'] else ''))
            if tm.get('frase'):
                notas.append('una oracion de la toma')
            elif tm['recortada']:
                notas.append('otro intento sin pausa')
            lin.append('   %s toma %d  %s  "%s"%s' % (marca, n + 1, fmt(tm['ini']), ev['texto'],
                                                    ('  · ' + ', '.join(notas)) if notas else ''))
        lin.append('')
    informe = '\n'.join(lin)
    open(os.path.join(salida, a.id + '-voz.txt'), 'w').write(informe + '\n')
    json.dump({'durs': durs, 'total': total}, open(os.path.join(trabajo, 'tiempos.json'), 'w'))
    print(informe)
    print('umbral %.1f dB (ruido %.1f, voz %.1f)' % (son.umbral, son.piso, son.voz))
    if a.plan:
        return
    subprocess.run(['node', os.path.join(RAIZ, 'herramientas', 'grabar.js'), a.id, salida,
                    '--tiempos', ','.join(str(d) for d in durs), '--pista', fwav], check=True)


if __name__ == '__main__':
    main()
