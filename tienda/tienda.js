/* =========================================================
   Lo que comparten las páginas de la tienda (index, 7-errores y gracias):
   - los links de pago, con el origen de la visita pegado para verlo en Hotmart:
       sck = ref-<código> si viene de un referido, si no <utm_source>-<utm_campaign>
             (el anuncio), si no el nombre de la página (data-pagina del <body>);
       utm_* = los del anuncio, tal cual (Hotmart los muestra en Analytics).
     Hotmart no acepta "_" en sck: aquí solo van letras, números y guiones.
   - los precios de ENLACES.precios en todo lo que tenga data-precio="producto";
   - las redes, las páginas legales y el año;
   - la medición: el píxel de Meta, el de TikTok y Cloudflare Web Analytics,
     solo si su identificador está en ENLACES.medicion.
   Necesita enlaces.js antes. Deja window.TIENDA para el script de cada página.
   ========================================================= */
(function () {
  var E = window.ENLACES || { checkout: {}, precios: {}, redes: {}, legal: {}, medicion: {} };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function lee(almacen, k) { try { return window[almacen].getItem(k); } catch (e) { return null; } }
  function pon(almacen, k, v) { try { window[almacen].setItem(k, v); } catch (e) {} }
  var params;
  try { params = new URLSearchParams(location.search); } catch (e) { params = { get: function () { return null; } }; }

  /* ---------- de dónde viene la visita ---------- */
  var UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var origen = {}, hay = false;
  UTM.forEach(function (k) { var v = params.get(k); if (v) { origen[k] = v.slice(0, 80); hay = true; } });
  if (hay) pon('sessionStorage', 'tor-utm', JSON.stringify(origen));
  else { try { origen = JSON.parse(lee('sessionStorage', 'tor-utm') || '{}') || {}; } catch (e) { origen = {}; } }

  var REF = /^[a-z0-9-]{3,40}$/;
  var ref = params.get('ref');
  if (ref && REF.test(ref)) pon('localStorage', 'tor-ref', ref); else ref = lee('localStorage', 'tor-ref');
  if (ref && !REF.test(ref)) ref = null;

  function limpia(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  }
  var pagina = (document.body && document.body.getAttribute('data-pagina')) || 'tienda';
  function canal() {
    if (ref) return 'ref-' + ref;
    if (origen.utm_source) return limpia(origen.utm_source + (origen.utm_campaign ? '-' + origen.utm_campaign : '')) || pagina;
    return pagina;
  }
  function urlPago(producto) {
    var base = (E.checkout || {})[producto];
    if (!base) return '';
    var q = ['sck=' + encodeURIComponent(canal())];
    UTM.forEach(function (k) { if (origen[k]) q.push(k + '=' + encodeURIComponent(origen[k])); });
    return base + (base.indexOf('?') >= 0 ? '&' : '?') + q.join('&');
  }
  function precio(producto) { return (E.precios || {})[producto] || ''; }
  function valor(producto) { var m = precio(producto).match(/(\d+)[.,](\d{2})/); return m ? +(m[1] + '.' + m[2]) : 0; }

  /* ---------- medición (solo si está configurada) ---------- */
  var M = E.medicion || {};
  if (M.metaPixel) {
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', M.metaPixel); window.fbq('track', 'PageView');
  }
  if (M.tiktokPixel) {
    /* eslint-disable */
    !function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.load = function (e, n) { var i = 'https://analytics.tiktok.com/i18n/pixel/events.js'; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = i; ttq._t = ttq._t || {}; ttq._t[e] = +new Date(); ttq._o = ttq._o || {}; ttq._o[e] = n || {};
        var o = d.createElement('script'); o.type = 'text/javascript'; o.async = !0; o.src = i + '?sdkid=' + e + '&lib=' + t; var a = d.getElementsByTagName('script')[0]; a.parentNode.insertBefore(o, a); };
    }(window, document, 'ttq');
    /* eslint-enable */
    window.ttq.load(M.tiktokPixel); window.ttq.page();
  }
  if (M.cloudflare) {
    var cf = document.createElement('script');
    cf.defer = true; cf.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    cf.setAttribute('data-cf-beacon', JSON.stringify({ token: M.cloudflare }));
    document.head.appendChild(cf);
  }
  // nombres estándar de Meta; TikTok usa los mismos para estos tres
  var ESTANDAR = { ViewContent: 1, InitiateCheckout: 1, Lead: 1 };
  function evento(nombre, datos) {
    datos = datos || {};
    try { if (window.fbq) window.fbq(ESTANDAR[nombre] ? 'track' : 'trackCustom', nombre, datos); } catch (e) {}
    try { if (window.ttq) window.ttq.track(nombre === 'Lead' ? 'SubmitForm' : nombre, datos); } catch (e) {}
  }

  /* ---------- botones, precios, redes, legales ---------- */
  function conecta(raiz) {
    $$('[data-producto]', raiz).forEach(function (a) {
      var k = a.getAttribute('data-producto'), url = urlPago(k);
      a.href = url || a.getAttribute('data-sin-link') || '#';
      if (url) { a.target = '_blank'; a.rel = 'noopener'; }
      if (!a._tor) {
        a._tor = 1;
        a.addEventListener('click', function () { evento('InitiateCheckout', { content_name: k, value: valor(k), currency: 'USD' }); });
      }
    });
    $$('[data-precio]', raiz).forEach(function (el) { var p = precio(el.getAttribute('data-precio')); if (p) el.textContent = p; });
    $$('[data-red]', raiz).forEach(function (a) {
      var url = (E.redes || {})[a.getAttribute('data-red')];
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
      else { a.href = '#'; a.title = 'Muy pronto'; a.addEventListener('click', function (e) { e.preventDefault(); }); }
    });
    $$('[data-legal]', raiz).forEach(function (a) {
      var url = (E.legal || {})[a.getAttribute('data-legal')];
      if (url) a.href = url; else a.style.display = 'none';
    });
    $$('[data-anio]', raiz).forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  window.TIENDA = { urlPago: urlPago, precio: precio, valor: valor, evento: evento, conecta: conecta, ref: ref, origen: origen, canal: canal };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { conecta(document); });
  else conecta(document);
})();
