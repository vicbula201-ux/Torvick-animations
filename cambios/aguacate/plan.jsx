/* Review · «¿Qué tan saludable es realmente el aguacate?» (P5 · review de alimentos).
   BORRADOR armado con el guion antes de grabar (p5/reviews-alimentos.md). Cada pieza entra cuando
   se dice su frase (t('...')): si al grabar cambia una palabra, se cambia aca y listo.
   El ritmo (lectura: 2): una cosa a la vez y cada tarjeta se queda 2 s despues de su ultimo dato
   (lo chico, 1,5 s); si la voz sigue, lo que viene espera. Pedido del autor despues del borrador 2.
   Cuando llegue el material:
     1. transcribir las tomas y armar cambios/aguacate/corte.json (tomas + tomas de apoyo) -> montar.py
     2. seguir.py para los objetos con rotulo: aguacate-mano, arepa, huevos
     3. ajustar posiciones a lo que se ve (pos de las tarjetas, lado de los rotulos) y exportar */
(function (global) {
  var C = global.CAMBIOS, p = C.plan;
  var id = 'aguacate';
  var t = C.buscador(id);
  var CARA = [0.5, 0.34];
  function golpe(ini, foco) { return p.camara(ini, ini + 1.0, { zoom: 1.28, foco: foco || CARA, mov: 'golpe' }); }
  // la transcripcion a veces escribe los numeros con cifras («9 de 10»)
  var nueve = t.alguna(['nueve', '9']);
  // el cierre lo dices tú a cámara: «¿Quieres ver más videos similares? Sígueme para más contenido.»
  var pregunta = t('quieres ver', t('comentarios'));
  var sigueme = t('sígueme', pregunta);

  C.registrar({
    id: id, titulo: 'Review · ¿Qué tan saludable es el aguacate?', video: 'cambios/' + id + '/media/fuente.mp4',
    lectura: 2,
    // el cierre dicho: mientras preguntas, arriba se arma @eltorvick con YouTube, Instagram y TikTok;
    // en «sígueme», SÍGUEME gigante abajo + «para más contenido». Tú sigues a la vista.
    firma: { estilo: 'grande', ini: pregunta - 0.1, sigueme: sigueme, texto: 'para más contenido' },
    subs: {
      y: 1260,
      marcadas: ['saludable', 'calorías', 'grasas', 'fibra', 'proteína', 'monoinsaturadas', 'oliva', 'potasio', 'magnesio',
        'folato', 'satisfecho', 'absorción', 'veredicto', 'nutritivo', 'versátil', 'delicioso', 'porciones']
    },
    plan: [
      // ---- 1. GANCHO (tú con el aguacate entero en la mano) ----
      p.detras(t('qué tan') - 0.05, t.fin('realmente') + 0.25, '¿SALUDABLE?'),
      golpe(t('realmente')),
      p.rotulo(t('aguacate'), t('tiene más') + 0.2, 'Aguacate', { sigue: 'aguacate-mano' }),
      // las calorias de otras frutas, para ver el «más que muchas frutas» (aprobada por el autor)
      p.barras(t('más calorías'), t('pero eso') - 0.05, {
        titulo: 'Calorías por 100 g', pos: [540, 470], ancho: 820, compacta: true, colores: ['amarillo'], unidad: ' kcal', soloPrimera: true, fondo: false,
        filas: [
          { nombre: 'Manzana', partes: [52, 108], t: t('más calorías') + 0.15 },
          { nombre: 'Banano', partes: [89, 71], t: t('muchas') },
          { nombre: 'Aguacate', partes: [160, 0.001], t: t('frutas') }
        ]
      }),
      p.etiqueta(t('mal alimento') - 0.05, t.fin('alimento') + 0.9, 'Mal alimento', { estilo: 'blanco', tachado: true, cTachado: t('mal alimento') + 0.3, minus: true, letra: 'texto', tam: 64, pos: [540, 520] }),

      // ---- 2. CALORÍAS Y MACRONUTRIENTES (tomas de apoyo: el aguacate entero, luego partido) ----
      p.tabla(t('por cada') - 0.1, t('aquí viene') - 0.1, {
        titulo: 'Aguacate', sub: 'por 100 g de pulpa', pie: 'Valores aproximados · USDA FoodData Central', sale: 'izquierda',
        filas: [
          { nombre: 'Calorías', valor: 160, unidad: 'kcal', grande: true, busca: 'calorías' },
          { nombre: 'Grasas', valor: 14.7, dec: 1, unidad: 'g', busca: 'grasas' },
          { nombre: 'Carbohidratos', valor: 8.5, dec: 1, unidad: 'g', busca: 'fibra' },
          { nombre: 'Fibra', valor: 6.7, dec: 1, unidad: 'g', sub: true, busca: 'fibra' },
          { nombre: 'Proteína', valor: 2, unidad: 'g', busca: 'proteína' }
        ]
      }),

      // ---- 3. GRASAS SALUDABLES Y MICRONUTRIENTES (primer plano del aguacate cortado; tú señalando) ----
      // las grasas del aguacate contra las del aceite de oliva (USDA; aprobada por el autor)
      p.barras(t('la mayoría'), t('también aporta') - 0.1, {
        titulo: '¿Qué grasas tiene?', sub: '% de sus ácidos grasos', pie: 'USDA FoodData Central',
        filas: [{ nombre: 'Aguacate', partes: [71, 13, 16], busca: 'monoinsaturadas' }, { nombre: 'Aceite de oliva', partes: [75, 11, 14], busca: 'aceite' }],
        leyenda: ['Monoinsaturadas', 'Poliinsaturadas', 'Saturadas'], remate: '¡Casi iguales!', cRemate: t.fin('aceite') + 0.3, sale: 'izquierda'
      }),
      p.tabla(t('también aporta') - 0.1, t.fin('k', t('también aporta')) + 1.4, {
        encabezado: 'Por 100 g', titulo: 'Micronutrientes', entra: 'derecha',
        filas: [
          { nombre: 'Potasio', valor: 485, unidad: 'mg', busca: 'potasio' },
          { nombre: 'Magnesio', valor: 29, unidad: 'mg', busca: 'magnesio' },
          { nombre: 'Folato', valor: 81, unidad: 'µg', busca: 'folato' },
          { nombre: 'Vitamina E', valor: 2.1, dec: 1, unidad: 'mg', busca: 'vitaminas' },
          { nombre: 'Vitamina K', valor: 21, unidad: 'µg', busca: 'k' }
        ]
      }),

      // ---- 4. BENEFICIOS Y ACOMPAÑAMIENTOS (el aguacate en el plato, la arepa con huevos) ----
      // una idea a la vez, en el mismo lugar
      p.etiqueta(t('satisfecho') - 0.05, t('absorción') - 0.3, 'Más saciedad', { estilo: 'blanco', icono: 'check', minus: true, letra: 'texto', tam: 60, pos: [540, 520], rot: -2 }),
      p.etiqueta(t('absorción') - 0.05, t.fin('alimentos') + 0.4, 'Mejor absorción de vitaminas', { estilo: 'blanco', icono: 'check', minus: true, letra: 'texto', tam: 54, pos: [540, 520], rot: -2 }),
      p.titulo(t('cómo comerlo') - 0.05, t('con arepa') + 0.1, '¿CÓMO\nCOMERLO?', { pos: [540, 500] }),
      p.rotulo(t('arepa') - 0.05, t.fin('ensalada') + 0.8, 'Arepa', { sigue: 'arepa' }),
      p.rotulo(t('huevos') - 0.05, t.fin('ensalada') + 0.8, 'Huevos', { sigue: 'huevos' }),

      // ---- 5. VEREDICTO Y CTA (tú con el aguacate cortado, probándolo) ----
      golpe(t('veredicto')),
      p.veredicto(nueve - 0.24, t('con qué') - 0.15, {
        nota: 9, de: 10, pos: [540, 640],
        palabras: [{ texto: 'Nutritivo', busca: 'nutritivo' }, { texto: 'Versátil', busca: 'versátil' }, { texto: 'Delicioso', busca: 'delicioso' }],
        criterio: 'nutrición · versatilidad · sabor', encoger: t('eso sí') - 0.1, esquina: [200, 420], tamFinal: 250
      }),
      p.etiqueta(t('porciones') - 0.05, t.fin('calórico') + 0.4, 'Las porciones importan', { estilo: 'negro', icono: 'aviso', minus: true, letra: 'texto', tam: 52, pos: [540, 1090], rot: -2 }),
      p.cta(t('con qué') - 0.05, t.fin('comentarios') + 0.5, '¿Con qué\nlo acompañas?', { pregunta: true, texto: 'te leo en los comentarios', y: 540 })
    ]
  });
})(window);
