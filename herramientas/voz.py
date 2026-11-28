#!/usr/bin/env python3
"""
La voz de un video del plano secuencia (plano.jsx): pista, subtitulos y boca.

  # con la voz clonada de Victor (Chatterbox multilingue, licencia MIT):
  python3 herramientas/voz.py <id> --ref ~/.torvick/voz/ref.wav [--grabar]

  # con la voz que grabo Victor (sincronizar.py ya dejo la pista y los tiempos):
  python3 herramientas/voz.py <id> --pista videos/<id>-voz.wav --tiempos 3.1,4.2,... [--grabar]
  # dos voces reales (dialogo.py): las palabras con el tiempo de cada grabacion, mas precisas
  python3 herramientas/voz.py <id> --pista videos/<id>-voz.wav --tiempos ... --oidas videos/<id>-voz.palabras.json

Deja:
  voces/<id>.js         window.VOCES[id] = { durs, fps, palabras: [[t0, t1, texto, linea]], env }
                        (las duraciones de cada escena, cada palabra con su tiempo para los
                        subtitulos y el volumen a 60 cuadros por segundo para la boca de Tor;
                        no tiene audio, va a git)
  videos/<id>-voz.wav   la pista de voz (fuera de git: es la voz del autor)
  videos/<id>-voz/      cada linea generada y sus candidatas (cache: si el texto no cambia, no se rehace)
Con --grabar llama a grabar.js con esos tiempos y esa pista y deja videos/<id>-voz.mp4.

Como elige cada linea clonada: genera dos candidatas, las transcribe con whisper y se queda
con la que dice el texto mas completo (y sin cola de ruido); recorta los silencios del borde.
Cada escena dura lo que dura su linea mas un respiro corto (la coreografia se estira sola,
porque todo va con f(fraccion)). Los subtitulos usan el texto del guion (con sus tildes y
signos) con los tiempos que da whisper palabra por palabra.

Necesita Python 3.10-3.13 con: torch (CPU), chatterbox-tts (solo para clonar), transformers,
librosa, soundfile, numpy. Ver CLAUDE.md, "Plano secuencia".
"""
import argparse, base64, difflib, hashlib, json, os, re, subprocess, sys, unicodedata

import numpy as np
import soundfile as sf
import librosa

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 24000
PAUSA_ANTES, PAUSA_DESPUES = 0.06, 0.28
MIN_ACCION, MIN_CIERRE = 3.6, 3.5


def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9%]', '', w)


# como se le dice a la voz clonada lo que se escribe distinto (el subtitulo usa el texto del guion)
PRONUNCIA = {'Kentucky': 'Kentuqui', 'Passa': 'Pasa', 'BCAAs': 'be ce a a', 'BCAA': 'be ce a a'}


def pronunciar(texto):
    for k, v in PRONUNCIA.items():
        texto = re.sub(r'\b%s\b' % re.escape(k), v, texto)
    return texto


def palabras_guion(vo):
    return [w for w in re.sub(r'[*_]', '', vo).split() if norm(w)]


def guion(id_):
    tmp = os.path.join(RAIZ, 'videos', id_ + '-guion-voz.json')
    subprocess.run(['node', os.path.join(RAIZ, 'herramientas', 'grabar.js'), id_, '--solo-guion', tmp], check=True, cwd=RAIZ)
    return json.load(open(tmp))


_ASR = None
def asr():
    global _ASR
    if _ASR is None:
        from transformers import pipeline
        _ASR = pipeline('automatic-speech-recognition', model='openai/whisper-small', device='cpu')
    return _ASR


def transcribir(y, sr):
    """palabras [(t0, t1, texto)] de un trozo de audio"""
    y16 = librosa.resample(y, orig_sr=sr, target_sr=16000) if sr != 16000 else y
    r = asr()({'raw': y16.astype(np.float32), 'sampling_rate': 16000}, return_timestamps='word',
              generate_kwargs={'language': 'es', 'task': 'transcribe'})
    out = []
    for c in r.get('chunks', []):
        t0, t1 = c['timestamp']
        if t0 is None:
            continue
        if t1 is None:
            t1 = t0 + 0.3
        out.append((float(t0), float(t1), c['text'].strip()))
    return out, r.get('text', '')


def parecido(texto, oido):
    # por letras y sin espacios: whisper a veces junta palabras ("o livianas" -> "olivianas")
    a = ''.join(norm(w) for w in palabras_guion(texto))
    b = ''.join(norm(w) for w in oido.split())
    return difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()


def recortar(y, sr):
    yt, idx = librosa.effects.trim(y, top_db=38, frame_length=1024, hop_length=256)
    a = max(0, idx[0] - int(0.03 * sr)); b = min(len(y), idx[1] + int(0.06 * sr))
    return y[a:b]


def acortar_pausas(y, sr, maximo=0.22):
    """las pausas de adentro de una linea de mas de 'maximo' segundos se acortan (la voz no se toca)"""
    partes = librosa.effects.split(y, top_db=34, frame_length=1024, hop_length=256)
    if len(partes) < 2:
        return y
    out, n = [y[:partes[0][1]]], int(maximo * sr)
    for (a0, a1), (b0, b1) in zip(partes[:-1], partes[1:]):
        hueco = y[a1:b0]
        if len(hueco) > n:
            m = n // 2; hueco = np.concatenate([hueco[:m], hueco[-m:]])
        out += [hueco, y[b0:b1]]
    out.append(y[partes[-1][1]:])
    return np.concatenate(out).astype(np.float32)


def alinear(texto, oidas, desde):
    """tiempos para las palabras del guion a partir de las palabras que oyo whisper"""
    gw = palabras_guion(texto)
    a = [norm(w) for w in gw]
    b = [norm(w[2]) for w in oidas]
    tiempos = [None] * len(gw)
    sm = difflib.SequenceMatcher(None, a, b)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == 'equal' or (op == 'replace' and i2 - i1 == j2 - j1):
            for k in range(i2 - i1):
                tiempos[i1 + k] = (oidas[j1 + k][0], oidas[j1 + k][1])
        elif op == 'replace':
            t0, t1 = oidas[j1][0], oidas[j2 - 1][1]
            n = i2 - i1
            for k in range(n):
                tiempos[i1 + k] = (t0 + (t1 - t0) * k / n, t0 + (t1 - t0) * (k + 1) / n)
    # las que faltan: entre sus vecinas
    fin = oidas[-1][1] if oidas else 0.5
    for i in range(len(gw)):
        if tiempos[i] is None:
            prev = next((tiempos[j][1] for j in range(i - 1, -1, -1) if tiempos[j]), 0.0)
            nxt = next((tiempos[j][0] for j in range(i + 1, len(gw)) if tiempos[j]), fin)
            tiempos[i] = (prev, max(prev + 0.08, (prev + nxt) / 2))
    return [[round(desde + t[0], 3), round(desde + t[1], 3), w] for w, t in zip(gw, tiempos)]


def envolvente(y, sr, fps=60):
    hop = sr // fps
    rms = librosa.feature.rms(y=y, frame_length=int(0.03 * sr), hop_length=hop, center=True)[0]
    db = 20 * np.log10(rms + 1e-6)
    v = np.clip((db + 46) / 32, 0, 1)
    out, cur = [], 0.0
    for x in v:
        cur = cur + (x - cur) * (0.6 if x > cur else 0.28)
        out.append(cur)
    q = np.clip(np.array(out) * 255, 0, 255).astype(np.uint8)
    return base64.b64encode(q.tobytes()).decode('ascii')


def clonar_lineas(g, refs, carpeta):
    """refs: { quien: (referencia.wav, exaggeration, cfg) }; cada linea con la voz de quien la dice (habla)"""
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    import torch
    torch.set_num_threads(os.cpu_count() or 4)
    modelo = None
    lineas = []
    huellas = {q: hashlib.md5(open(r[0], 'rb').read()).hexdigest()[:8] for q, r in refs.items()}
    for i, e in enumerate(g):
        quien = e.get('habla') or 'tor'
        if quien not in refs: quien = 'tor'
        ref, ex, cfg = refs[quien]; huella_ref = huellas[quien]
        texto = pronunciar(re.sub(r'[*_]', '', e.get('vo') or '').strip())
        if not texto:
            lineas.append(np.zeros(int(0.2 * SR), dtype=np.float32)); continue
        clave = hashlib.md5(('%s|%s|%.2f|%.2f' % (texto, huella_ref, ex, cfg)).encode()).hexdigest()[:10]
        final = os.path.join(carpeta, '%02d-%s.wav' % (i + 1, clave))
        if os.path.exists(final):
            y, _ = sf.read(final, dtype='float32'); lineas.append(y); print('  linea %d (guardada, %s): %s' % (i + 1, quien, texto)); continue
        if modelo is None:
            modelo = ChatterboxMultilingualTTS.from_pretrained(device='cpu')
        mejor = None
        for intento in range(4):
            w = modelo.generate(texto, language_id='es', audio_prompt_path=ref, exaggeration=ex, cfg_weight=cfg, temperature=0.7)
            y = recortar(w.squeeze(0).numpy().astype(np.float32), modelo.sr)
            _, oido = transcribir(y, modelo.sr)
            nota = parecido(texto, oido)
            dur = len(y) / modelo.sr
            # palabras por segundo fuera de lo normal = cola de ruido o palabras comidas
            pps = len(palabras_guion(texto)) / max(0.3, dur)
            if pps < 1.6 or pps > 4.8:
                nota -= 0.25
            sf.write(os.path.join(carpeta, '%02d-%s-cand%d.wav' % (i + 1, clave, intento + 1)), y, modelo.sr)
            print('  linea %d cand %d (%s): %.2f  (%.1f s) "%s"' % (i + 1, intento + 1, quien, nota, dur, oido.strip()))
            if mejor is None or nota > mejor[0]:
                mejor = (nota, y)
            if nota > 0.97 or (intento >= 1 and mejor[0] >= 0.85):
                break   # hasta 4 intentos solo si las dos primeras salieron mal (palabras inventadas, cola)
        sf.write(final, mejor[1], SR)
        lineas.append(mejor[1])
    return lineas


def armar(g, lineas):
    """pista completa y duracion de cada escena"""
    durs, trozos, inicios = [], [], []
    n = len(g)
    for i, (e, y) in enumerate(zip(g, lineas)):
        largo = len(y) / SR
        d = PAUSA_ANTES + largo + PAUSA_DESPUES
        if i == n - 1:
            d = max(d, MIN_CIERRE)
        elif (e.get('nombre') or '').lower().startswith('comenta'):
            d = max(d, MIN_ACCION)   # la escena de accion (comenta, comparte, guarda) necesita su tiempo
        d = round(d, 2)
        hueco = np.zeros(int(PAUSA_ANTES * SR), dtype=np.float32)
        resto = np.zeros(max(0, int(d * SR) - len(hueco) - len(y)), dtype=np.float32)
        inicios.append(sum(durs) + PAUSA_ANTES)
        trozos += [hueco, y.astype(np.float32), resto]
        durs.append(d)
    return np.concatenate(trozos), durs, inicios


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('id')
    ap.add_argument('--ref', default=os.path.expanduser('~/.torvick/voz/ref.wav'))
    ap.add_argument('--pista'); ap.add_argument('--tiempos')
    ap.add_argument('--oidas', help='con --pista: las palabras de cada escena con su tiempo (el .palabras.json de dialogo.py)')
    ap.add_argument('--ex', type=float, default=0.7); ap.add_argument('--cfg', type=float, default=0.3)
    ap.add_argument('--grabar', action='store_true')
    ap.add_argument('--voces', help='otras voces para las lineas con habla: passa=ruta.wav[:exaggeration],...')
    a = ap.parse_args()
    g = guion(a.id)
    carpeta = os.path.join(RAIZ, 'videos', a.id + '-voz'); os.makedirs(carpeta, exist_ok=True)
    if a.pista:
        y, sr = librosa.load(a.pista, sr=SR, mono=True)
        durs = [float(x) for x in a.tiempos.split(',')]
        pista, inicios = y, []
        acc = 0.0
        for d in durs:
            inicios.append(acc); acc += d
        lineas = [pista[int(inicios[i] * SR):int((inicios[i] + durs[i]) * SR)] for i in range(len(durs))]
        desfase = [0.0] * len(durs)
        oidos = [None] * len(durs)
        if a.oidas:
            # los tiempos de la transcripcion de cada grabacion: mas precisos que volver a oir la pista
            for k, ws in json.load(open(a.oidas)).items():
                if int(k) < len(oidos) and ws:
                    oidos[int(k)] = [(float(w[0]), float(w[1]), w[2]) for w in ws]
    else:
        print('clonando %d lineas con la referencia %s' % (len(g), a.ref))
        refs = {'tor': (a.ref, a.ex, a.cfg)}
        for item in (a.voces or '').split(','):
            if '=' not in item: continue
            q, r = item.split('=', 1)
            ex = a.ex
            if ':' in r and r.rsplit(':', 1)[1].replace('.', '').isdigit(): r, ex = r.rsplit(':', 1)[0], float(r.rsplit(':', 1)[1])
            refs[q.strip()] = (os.path.expanduser(r.strip()), ex, a.cfg)
        lineas = clonar_lineas(g, refs, carpeta)
        # la cola: el modelo a veces deja aire o ruido despues de la ultima palabra; se corta donde
        # termina la ultima palabra que oye whisper (mas un respiro) y se apaga en 30 ms
        oidos = []
        for i, y in enumerate(lineas):
            if len(y) < SR * 0.2:
                oidos.append(None); continue
            antes = len(y) / SR
            y = acortar_pausas(y, SR); lineas[i] = y
            if antes - len(y) / SR > 0.05:
                print('  linea %d: pausas acortadas %.2f -> %.2f s' % (i + 1, antes, len(y) / SR))
            oidas, _ = transcribir(y, SR)
            if oidas:
                # se corta despues de la ULTIMA palabra del guion (a veces el modelo inventa palabras al final)
                ult = [norm(w) for w in palabras_guion(pronunciar(g[i].get('vo') or ''))][-1:]
                idx = None
                for j in range(len(oidas) - 1, max(-1, len(oidas) - 7), -1):
                    o = norm(oidas[j][2])
                    if ult and o and (o == ult[0] or difflib.SequenceMatcher(None, o, ult[0]).ratio() > 0.7):
                        idx = j; break
                if idx is not None and idx < len(oidas) - 1:
                    print('  linea %d: palabras de mas al final, se cortan: "%s"' % (i + 1, ' '.join(w[2] for w in oidas[idx + 1:])))
                    oidas = oidas[:idx + 1]
                fin = oidas[-1][1] + 0.22
                if len(y) / SR > fin + 0.12:
                    y = y[:int(fin * SR)].copy(); n = int(0.03 * SR); y[-n:] *= np.linspace(1, 0, n)
                    print('  linea %d: cola cortada a %.2f s' % (i + 1, fin))
                    lineas[i] = y
            oidos.append(oidas)
        pista, durs, inicios = armar(g, lineas)
        desfase = [0.0] * len(durs)
    # palabras con su tiempo (subtitulos)
    palabras = []
    for i, (e, y) in enumerate(zip(g, lineas)):
        texto = e.get('vo') or ''
        if not texto.strip() or len(y) < SR * 0.2:
            continue
        oidas = oidos[i] if oidos[i] is not None else transcribir(y, SR)[0]
        for w in alinear(texto, oidas, inicios[i] + desfase[i]):
            palabras.append(w + [i, e.get('habla') or 'tor'])
    salida_wav = os.path.join(RAIZ, 'videos', a.id + '-voz.wav')
    sf.write(salida_wav, pista, SR)
    datos = {'durs': durs, 'fps': 60, 'palabras': palabras, 'env': envolvente(pista, SR)}
    # con dos voces o mas: el volumen de cada una por separado (cada boca se mueve con la suya)
    quienes = sorted(set((e.get('habla') or 'tor') for e in g))
    if len(quienes) > 1:
        datos['envs'] = {}
        for q in quienes:
            solo = np.zeros_like(pista)
            for i, (e, y) in enumerate(zip(g, lineas)):
                if (e.get('habla') or 'tor') != q: continue
                a0 = int((inicios[i] + desfase[i]) * SR); solo[a0:a0 + len(y)] = pista[a0:a0 + len(y)]
            datos['envs'][q] = envolvente(solo, SR)
    os.makedirs(os.path.join(RAIZ, 'voces'), exist_ok=True)
    js = os.path.join(RAIZ, 'voces', a.id + '.js')
    with open(js, 'w') as f:
        f.write('/* generado por herramientas/voz.py: la voz de %s (duraciones, palabras y volumen; sin audio). No editar a mano. */\n' % a.id)
        f.write('(window.VOCES = window.VOCES || {})[%s] = %s;\n' % (json.dumps(a.id), json.dumps(datos, ensure_ascii=False)))
    print('listo: %s · %s · %.1f s · %d palabras' % (js, salida_wav, len(pista) / SR, len(palabras)))
    print('tiempos:', ','.join('%.2f' % d for d in durs))
    if a.grabar:
        subprocess.run(['node', os.path.join(RAIZ, 'herramientas', 'grabar.js'), a.id, 'videos', '--tiempos',
                        ','.join('%.2f' % d for d in durs), '--pista', salida_wav], check=True, cwd=RAIZ)


if __name__ == '__main__':
    main()
