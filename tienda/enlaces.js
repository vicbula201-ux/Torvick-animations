/* =========================================================
   ENLACES Y PRECIOS DE LA TIENDA: lo único que hay que llenar antes de publicar.
   Lo usan las tres páginas: index.html (la tienda), 7-errores.html (la página de
   los anuncios) y gracias-7-errores.html (después de comprar la guía).

   - sitio: la dirección donde quede publicada la carpeta tienda/, terminada en /
     (por ejemplo https://entrenacontor.com/). Sirve para armar los links que se
     comparten (referidos) y para comprobar los que salen del PDF y de los correos.
   - checkout: el link de pago de cada producto en Hotmart
     (Hotmart > Productos > tu producto > Herramientas > Links / Checkout).
     Mientras un link esté vacío, el botón lleva a la sección del producto.
   - precios: lo que dice cada botón y cada tarjeta. Si cambias un precio en
     Hotmart, cámbialo también aquí (y en el PDF de la guía, hoja 12).
   - redes, legal: tus perfiles y las páginas legales.
   - formulario: la URL de tu herramienta de correo (Brevo, MailerLite...) que
     recibe los suscriptores. Se manda por POST con los campos nombre, email,
     interes y acepta (el permiso para escribirle).
   - referidos.reclamar: dónde te escriben para pedir el cupón.
   - medicion: los identificadores para medir los anuncios. Vacíos = no se carga
     nada. metaPixel (el número del píxel de Meta), tiktokPixel (el código del
     píxel de TikTok), cloudflare (el token de Cloudflare Web Analytics, para
     contar visitas sin cookies).
   ========================================================= */
var ENLACES = {
  sitio: '',
  checkout: {
    errores: '',       // US$1,99 · Los 7 errores      https://pay.hotmart.com/XXXXXXXX
    rutinas: '',       // US$9,99 · Rutina de 12 semanas https://pay.hotmart.com/YYYYYYYY
    pack: '',          // (catálogo, oculto en el piloto)
    biomecanica: '',
    nutricion: '',
    plantilla: '',
    asesoria: ''       // un formulario de solicitud o tu WhatsApp
  },
  precios: {
    errores: 'US$1,99',
    rutinas: 'US$9,99',
    pack: 'US$34,90',
    biomecanica: 'US$14,90',
    nutricion: 'US$12,90',
    plantilla: 'US$9,90'
  },
  redes: {
    instagram: 'https://www.instagram.com/entrenacontor/',
    tiktok: 'https://www.tiktok.com/@entrenacontor',
    youtube: 'https://www.youtube.com/@eltorvick'
  },
  legal: { terminos: 'terminos.html', privacidad: 'privacidad.html', reembolsos: 'reembolsos.html' },
  formulario: '',
  referidos: { descuento: 25, reclamar: 'https://www.instagram.com/entrenacontor/' },
  medicion: { metaPixel: '', tiktokPixel: '', cloudflare: '' }
};
