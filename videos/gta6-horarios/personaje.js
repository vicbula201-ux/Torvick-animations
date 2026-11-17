/* personaje.js — la mascota de Modo Vice: un flamenco con gafas de sol en la frente.
   Ilustración plana, contorno morado oscuro grueso y mejillas rosadas.
   Cada escena crea su propia copia con crearFlamenco(padre, {x,y,w,h}); proporción 2:3.
   Las acciones (parpadear, saludar, asentir, celebrar, feliz) agregan tweens a la línea maestra. */
(function () {
  'use strict';
  const K = '#190028';        // contorno
  const CUERPO = '#FF7DB8', CABEZA = '#FF8EC2', PANZA = '#FFC2DE', ALA = '#FF64A8';
  const MEJILLA = '#FF2F86', PICO = '#FFF1E6', LENTE = '#02F8F7';

  const SVG = `
<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
 <g class="fl-todo">
  <g class="fl-patas" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path d="M184 452 L180 556" stroke="${K}" stroke-width="26"/>
   <path d="M184 452 L180 556" stroke="${CABEZA}" stroke-width="11"/>
   <path d="M218 452 L246 502 L212 526" stroke="${K}" stroke-width="26"/>
   <path d="M218 452 L246 502 L212 526" stroke="${CABEZA}" stroke-width="11"/>
   <path d="M146 568 Q180 544 214 568 Q180 580 146 568 Z" fill="${CABEZA}" stroke="${K}" stroke-width="9"/>
  </g>
  <path d="M200 304 L200 250" stroke="${K}" stroke-width="64" stroke-linecap="round"/>
  <path d="M200 304 L200 250" stroke="${CABEZA}" stroke-width="44" stroke-linecap="round"/>
  <g class="fl-cuerpo">
   <ellipse cx="200" cy="380" rx="106" ry="94" fill="${CUERPO}" stroke="${K}" stroke-width="10"/>
   <ellipse cx="200" cy="402" rx="62" ry="60" fill="${PANZA}"/>
   <path d="M168 360 Q176 350 186 358" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/>
   <path d="M214 358 Q224 350 232 360" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/>
  </g>
  <g class="fl-ala-i"><path d="M118 322 C82 334 70 394 90 436 C98 452 118 448 122 430 C128 398 128 356 118 322 Z" fill="${ALA}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/></g>
  <g class="fl-ala-d"><path d="M282 322 C318 334 330 394 310 436 C302 452 282 448 278 430 C272 398 272 356 282 322 Z" fill="${ALA}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/></g>
  <g class="fl-cabeza-vivo"><g class="fl-cabeza">
   <path d="M198 106 C192 84 202 66 222 62" stroke="${K}" stroke-width="10" fill="none" stroke-linecap="round"/>
   <path d="M206 108 C206 92 216 84 232 84" stroke="${K}" stroke-width="10" fill="none" stroke-linecap="round"/>
   <circle cx="200" cy="188" r="86" fill="${CABEZA}" stroke="${K}" stroke-width="10"/>
   <g class="fl-gafas">
    <path d="M136 132 L118 142 M264 132 L282 142" stroke="${K}" stroke-width="7" stroke-linecap="round"/>
    <rect x="136" y="112" width="56" height="38" rx="15" fill="${LENTE}" stroke="${K}" stroke-width="8"/>
    <rect x="208" y="112" width="56" height="38" rx="15" fill="${LENTE}" stroke="${K}" stroke-width="8"/>
    <path d="M192 128 Q200 120 208 128" stroke="${K}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M148 122 L160 138 M220 122 L232 138" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
   </g>
   <ellipse cx="138" cy="222" rx="21" ry="13" fill="${MEJILLA}" opacity=".5"/>
   <ellipse cx="262" cy="222" rx="21" ry="13" fill="${MEJILLA}" opacity=".5"/>
   <g class="fl-ojos">
    <ellipse cx="164" cy="186" rx="22" ry="26" fill="#fff" stroke="${K}" stroke-width="8"/>
    <ellipse cx="236" cy="186" rx="22" ry="26" fill="#fff" stroke="${K}" stroke-width="8"/>
    <g class="fl-pupilas">
     <circle cx="168" cy="190" r="11.5" fill="${K}"/><circle cx="172" cy="185" r="4" fill="#fff"/>
     <circle cx="232" cy="190" r="11.5" fill="${K}"/><circle cx="236" cy="185" r="4" fill="#fff"/>
    </g>
   </g>
   <g class="fl-felices" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round">
    <path d="M142 196 Q164 166 186 196"/><path d="M214 196 Q236 166 258 196"/>
   </g>
   <g class="fl-pico">
    <path d="M176 210 C186 201 214 201 224 210 C229 232 223 252 211 266 C203 276 195 283 186 281 C179 279 179 270 186 266 C176 250 172 230 176 210 Z" fill="${PICO}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M180 250 C195 256 210 254 220 248 C218 256 215 261 211 266 C203 276 195 283 186 281 C179 279 179 270 186 266 C183 261 181 256 180 250 Z" fill="${K}"/>
    <path d="M191 221 Q200 226 209 221" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".45"/>
   </g>
  </g></g>
 </g>
</svg>`;

  function crearFlamenco(padre, r) {
    const TL = MV.TL;
    const cont = MV.caja(padre, 'flamenco', r);
    cont.innerHTML = SVG;
    const q = (s) => cont.querySelector(s);
    const p = {
      todo: q('.fl-todo'), cuerpo: q('.fl-cuerpo'), cabezaVivo: q('.fl-cabeza-vivo'), cabeza: q('.fl-cabeza'),
      ojos: q('.fl-ojos'), pupilas: q('.fl-pupilas'), felices: q('.fl-felices'),
      alaI: q('.fl-ala-i'), alaD: q('.fl-ala-d'), gafas: q('.fl-gafas'),
    };
    // orígenes de transformación (coordenadas del viewBox)
    gsap.set(p.todo, { svgOrigin: '200 590' });
    gsap.set(p.cuerpo, { svgOrigin: '200 470' });
    gsap.set([p.cabezaVivo, p.cabeza], { svgOrigin: '200 290' });
    gsap.set(p.ojos, { svgOrigin: '200 186' });
    gsap.set(p.alaI, { svgOrigin: '118 326' });
    gsap.set(p.alaD, { svgOrigin: '282 326' });
    gsap.set(p.felices, { autoAlpha: 0 });

    const api = {
      el: cont, p,
      // respiración + cabeza que flota: siempre vivo
      respirar(a, b) {
        MV.vivo(p.cuerpo, a, b, { scaleY: 1.03, scaleX: 0.988 }, 2.4);
        MV.vivo(p.cabezaVivo, a, b, { y: -6, rotation: 2.5 }, 3.2);
        return api;
      },
      parpadear(t) {
        TL.to(p.ojos, { scaleY: 0.08, duration: 0.07, ease: 'power2.in', yoyo: true, repeat: 1 }, t);
        return api;
      },
      parpadeos(a, b, cada = 2.6) {
        for (let t = a + 0.5 + MV.azar() * 0.6; t < b - 0.35; t += cada + (MV.azar() - 0.5) * 0.8) api.parpadear(t);
        return api;
      },
      saludar(t, veces = 3) {
        TL.to(p.alaD, { rotation: -148, duration: 0.3, ease: 'back.out(2)' }, t);
        TL.to(p.alaD, { rotation: -112, duration: 0.2, ease: 'sine.inOut', yoyo: true, repeat: veces * 2 - 1 }, t + 0.3);
        TL.to(p.alaD, { rotation: 0, duration: 0.38, ease: 'power2.inOut' }, t + 0.3 + veces * 0.4);
        TL.to(p.cabeza, { rotation: -5, duration: 0.3, ease: 'sine.out' }, t);
        TL.to(p.cabeza, { rotation: 0, duration: 0.35, ease: 'sine.inOut' }, t + 0.3 + veces * 0.4);
        return api;
      },
      asentir(t, veces = 2) {
        TL.to(p.cabeza, { rotation: 6, y: 8, duration: 0.17, ease: 'sine.inOut', yoyo: true, repeat: veces * 2 - 1 }, t);
        return api;
      },
      feliz(a, b) {
        TL.to(p.ojos, { autoAlpha: 0, duration: 0.06 }, a);
        TL.to(p.felices, { autoAlpha: 1, duration: 0.06 }, a);
        if (b != null) {
          TL.to(p.ojos, { autoAlpha: 1, duration: 0.06 }, b);
          TL.to(p.felices, { autoAlpha: 0, duration: 0.06 }, b);
        }
        return api;
      },
      celebrar(t, dur = 1.5) {
        api.feliz(t, t + dur);
        TL.to(p.alaI, { rotation: 140, duration: 0.26, ease: 'back.out(2)' }, t);
        TL.to(p.alaD, { rotation: -140, duration: 0.26, ease: 'back.out(2)' }, t);
        TL.to([p.alaI, p.alaD], { scale: 1.06, duration: 0.14, yoyo: true, repeat: 5, ease: 'sine.inOut' }, t + 0.26);
        TL.to(p.todo, { y: -44, scaleY: 1.04, duration: 0.24, ease: 'power2.out', yoyo: true, repeat: 3 }, t + 0.04);
        TL.to(p.alaI, { rotation: 0, duration: 0.4, ease: 'power2.inOut' }, t + dur - 0.3);
        TL.to(p.alaD, { rotation: 0, duration: 0.4, ease: 'power2.inOut' }, t + dur - 0.3);
        return api;
      },
      mirar(t, dx, dy = 0) {
        TL.to(p.pupilas, { x: dx, y: dy, duration: 0.25, ease: 'power2.out' }, t);
        return api;
      },
      // pose de la miniatura: ala derecha arriba saludando, ya en el primer cuadro
      poseSaludo() {
        gsap.set(p.alaD, { rotation: -130 });
        return api;
      },
    };
    return api;
  }

  window.crearFlamenco = crearFlamenco;
})();
