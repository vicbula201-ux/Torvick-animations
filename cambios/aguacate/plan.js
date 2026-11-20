/* GENERADO por compilar.js desde cambios/aguacate/plan.jsx — no editar a mano. */
/* Review · «¿Qué tan saludable es realmente el aguacate?» (P5 · review de alimentos).
   Sobre el corte de las tomas del autor (cambios/aguacate/corte.json -> montar.py): la mejor toma
   de cada frase, las tomas de apoyo encima de la voz y la prueba del aguacate. Cada pieza entra
   cuando se dice su frase (t('...')).
   El ritmo (lectura: 2): una cosa a la vez y cada tarjeta se queda 2 s despues de su ultimo dato
   (lo chico, 1,5 s); si la voz sigue, lo que viene espera. La frase de los micronutrientes no se
   grabo: esa tabla no va. */
(function (global) {
  var C = global.CAMBIOS,
    p = C.plan;
  var id = 'aguacate';
  var t = C.buscador(id);
  var CARA = [0.5, 0.39];
  function golpe(ini, foco) {
    return p.camara(ini, ini + 1.0, {
      zoom: 1.25,
      foco: foco || CARA,
      mov: 'golpe'
    });
  }
  // la transcripcion escribe los numeros con cifras («9 de 10», «15 gramos»)
  var nueve = t.alguna(['nueve', '9']);
  // el cierre lo dice el autor a cámara: «¿Quieres ver más videos similares? Sígueme para más contenido.»
  var pregunta = t('quieres ver', t('comentarios'));
  var sigueme = t('sígueme', pregunta);
  C.registrar({
    id: id,
    titulo: 'Review · ¿Qué tan saludable es el aguacate?',
    video: 'cambios/' + id + '/media/fuente.mp4',
    lectura: 2,
    // el cierre dicho: mientras pregunta, arriba se arma @eltorvick con YouTube, Instagram y TikTok;
    // en «sígueme», SÍGUEME gigante abajo + «para más contenido». El queda a la vista.
    // todo debajo de la cara (inclinado hacia la camara, la cara ocupa de y 80 a 690): SÍGUEME, las redes con
    // @eltorvick y la pastilla; la camara apenas se acerca, fija en el menton
    firma: {
      estilo: 'grande',
      ini: pregunta - 0.1,
      sigueme: sigueme,
      texto: 'para más contenido',
      zoom: 1.04,
      foco: [0.5, 0.36],
      y: 860,
      yArriba: 1015,
      yTexto: 1160
    },
    subs: {
      // mas abajo que de costumbre: el aguacate en la mano queda a la altura del pecho (y 1100-1400)
      y: 1440,
      marcadas: ['saludable', 'calorías', 'grasa', 'grasas', 'fibra', 'proteína', 'monoinsaturadas', 'saludables', 'oliva', 'satisfecho', 'absorción', 'vitaminas', 'veredicto', 'nutritivo', 'versátil', 'delicioso', 'porciones']
    },
    plan: [
    // ---- 1. GANCHO (el aguacate entero en la mano) ----
    // un poco mas arriba que de costumbre: asi la cabeza tapa menos letras
    p.detras(t('qué tan') - 0.05, t.fin('realmente') + 0.25, '¿SALUDABLE?', {
      y: 455
    }), golpe(t('realmente')),
    // el nombre encima del aguacate que tiene en la mano, hasta el corte (despues lo deja en la mesa)
    p.rotulo(t('saludable'), t('tiene más') - 0.25, 'Aguacate', {
      sigue: 'aguacate-mano'
    }),
    // las calorias de otras frutas, para ver el «más que muchas frutas» (aprobada por el autor)
    p.barras(t('más calorías'), t('pero eso') - 0.05, {
      // mas arriba y un poco mas chica: que no le tape la cabeza
      titulo: 'Calorías por 100 g',
      pos: [540, 415],
      ancho: 780,
      compacta: true,
      colores: ['amarillo'],
      unidad: ' kcal',
      soloPrimera: true,
      fondo: false,
      filas: [{
        nombre: 'Manzana',
        partes: [52, 108],
        t: t('más calorías') + 0.15
      }, {
        nombre: 'Banano',
        partes: [89, 71],
        t: t('muchas')
      }, {
        nombre: 'Aguacate',
        partes: [160, 0.001],
        t: t('frutas')
      }]
    }), p.etiqueta(t('mal alimento') - 0.05, t.fin('alimento') + 0.9, 'Mal alimento', {
      estilo: 'blanco',
      tachado: true,
      cTachado: t('mal alimento') + 0.3,
      minus: true,
      letra: 'texto',
      tam: 64,
      pos: [540, 520]
    }),
    // ---- 2. CALORÍAS Y MACRONUTRIENTES (toma de apoyo: el aguacate entero en el plato) ----
    // la toma de apoyo se ve un segundo y entra la tabla cuando dice «tenemos»
    p.tabla(t('tenemos') - 0.15, t('aquí viene') - 0.1, {
      titulo: 'Aguacate',
      sub: 'por 100 g de pulpa',
      pie: 'Valores aproximados · USDA FoodData Central',
      sale: 'izquierda',
      filas: [{
        nombre: 'Calorías',
        valor: 160,
        unidad: 'kcal',
        grande: true,
        busca: 'calorías'
      }, {
        nombre: 'Grasas',
        valor: 14.7,
        dec: 1,
        unidad: 'g',
        busca: 'grasa'
      }, {
        nombre: 'Carbohidratos',
        valor: 8.5,
        dec: 1,
        unidad: 'g',
        busca: 'fibra'
      }, {
        nombre: 'Fibra',
        valor: 6.7,
        dec: 1,
        unidad: 'g',
        sub: true,
        busca: 'fibra'
      }, {
        nombre: 'Proteína',
        valor: 2,
        unidad: 'g',
        busca: 'proteína'
      }]
    }),
    // ---- 3. LAS GRASAS (el con el aguacate partido en la mano) ----
    // las grasas del aguacate contra las del aceite de oliva (USDA; aprobada por el autor)
    // se va antes de «su combinación» (ahi entra la toma de apoyo): la regla de los cortes la termina justo antes
    p.barras(t('sus grasas') - 0.1, t('su combinación') - 0.1, {
      titulo: '¿Qué grasas tiene?',
      sub: '% de sus ácidos grasos',
      pie: 'USDA FoodData Central',
      filas: [{
        nombre: 'Aguacate',
        partes: [71, 13, 16],
        busca: 'monoinsaturadas'
      }, {
        nombre: 'Aceite de oliva',
        partes: [75, 11, 14],
        busca: 'aceite'
      }],
      leyenda: ['Monoinsaturadas', 'Poliinsaturadas', 'Saturadas'],
      remate: '¡Casi iguales!',
      cRemate: t('aceite') + 0.4
    }),
    // ---- 4. BENEFICIOS (tomas de apoyo: el aguacate partido, las dos mitades en la mano) ----
    // una idea a la vez, en el mismo lugar
    p.etiqueta(t('satisfecho') - 0.05, t('y que puede') - 0.1, 'Más saciedad', {
      estilo: 'blanco',
      icono: 'check',
      minus: true,
      letra: 'texto',
      tam: 60,
      pos: [540, 520],
      rot: -2
    }), p.etiqueta(t('absorción') - 0.05, t.fin('alimentos') + 0.4, 'Mejor absorción de vitaminas', {
      estilo: 'blanco',
      icono: 'check',
      minus: true,
      letra: 'texto',
      tam: 54,
      pos: [540, 520],
      rot: -2
    }),
    // ---- 5. CÓMO COMERLO (el a cámara; despues el probándolo) ----
    // una sola pieza: la pregunta arriba y cada opción cuando la dice
    p.lista(t('cómo comerlo') - 0.05, t.fin('vegetales') + 0.6, {
      titulo: '¿Cómo comerlo?',
      pos: [60, 700, 'i', 's'],
      tam: 50,
      // un emoji chico al lado de cada opcion (pedido del autor)
      items: [{
        texto: 'Arepa',
        busca: 'arepa',
        emoji: 'arepa'
      }, {
        texto: 'Huevos',
        busca: 'huevos',
        emoji: 'huevo'
      }, {
        texto: 'Atún',
        busca: 'atún',
        emoji: 'pescado'
      }, {
        texto: 'Ensalada',
        busca: 'ensalada',
        emoji: 'ensalada'
      }]
    }),
    // ---- 6. VEREDICTO Y CTA (el con el aguacate partido y la cuchara) ----
    golpe(t('veredicto')),
    // el sello solo en «9 de 10» (con un segundo de pausa despues) y se va antes de «es nutritivo…»
    p.veredicto(nueve - 0.24, t('es nutritivo'), {
      nota: 9,
      de: 10,
      pos: [540, 640]
    }), p.etiqueta(t('porciones') - 0.05, t('con qué') - 0.3, 'Las porciones importan', {
      estilo: 'negro',
      icono: 'aviso',
      minus: true,
      letra: 'texto',
      tam: 52,
      pos: [540, 1090],
      rot: -2
    }),
    // la pregunta sin desenfoque y debajo de la cara (el menton queda en y ~870)
    p.cta(t('con qué') - 0.05, t.fin('comentarios') + 0.5, '¿Con qué\nlo acompañas?', {
      pregunta: true,
      texto: 'te leo en los comentarios',
      y: 1120,
      fondo: false
    })]
  });
})(window);
