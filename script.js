/* ==========================================================================
   San Eusebio — comportamiento del sitio (HTML puro)
   --------------------------------------------------------------------------
   Cada bloque va aislado en su propio try/catch: si uno falla, los demás
   siguen funcionando. El calendario, el formulario y el menú NO dependen de
   Supabase; Supabase solo aporta las fotos del hero y las fechas ocupadas.
   ========================================================================== */

(function () {
  'use strict';

  var CFG = (typeof window !== 'undefined' && window.SAN_EUSEBIO) ? window.SAN_EUSEBIO : {};

  function seguro(nombre, fn) {
    try { fn(); } catch (e) {
      if (window.console && console.error) console.error('[San Eusebio] fallo ' + nombre + ':', e);
    }
  }

  var sb = null;
  seguro('supabase-init', function () {
    if (window.supabase && CFG.supabaseUrl && CFG.supabaseAnonKey) {
      sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    }
  });

  /* ====================================================== utilidades fecha = */
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  function aClave(f) {
    return f.getFullYear() + '-' +
      String(f.getMonth() + 1).padStart(2, '0') + '-' +
      String(f.getDate()).padStart(2, '0');
  }
  function enCastellano(c) {
    var p = c.split('-').map(Number);
    return p[2] + ' de ' + MESES[p[1] - 1] + ' de ' + p[0];
  }
  function sumarDias(c, n) {
    var p = c.split('-').map(Number);
    return aClave(new Date(p[0], p[1] - 1, p[2] + n));
  }
  function nochesEntre(a, b) {
    var r = [], x = a;
    while (x < b) { r.push(x); x = sumarDias(x, 1); }
    return r;
  }

  /* ====================================================== aparicion scroll = */
  function activarReveal() {
    var els = document.querySelectorAll('.reveal, .filete');
    var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (quieto || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          obs.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    els.forEach(function (e) { obs.observe(e); });

    // Respaldo: si algo queda sin revelar (por ejemplo un elemento que nunca
    // llega al umbral), se muestra igual pasados unos segundos. Así nada
    // queda invisible capturando clics.
    setTimeout(function () {
      els.forEach(function (e) { e.classList.add('visible'); });
    }, 3000);
  }

  /* ================================================== header + whatsapp ==== */
  function activarHeaderYWhatsapp() {
    var header = document.getElementById('header');
    var wa = document.getElementById('botonWa');
    if (wa && CFG.whatsapp) {
      var msg = encodeURIComponent(
        'Hola, estuve viendo la pagina de San Eusebio y queria consultar por una estadia.'
      );
      wa.href = 'https://wa.me/' + CFG.whatsapp + '?text=' + msg;
    }
    function alScrollear() {
      if (header) header.classList.toggle('hd-solido', window.scrollY > 60);
      if (wa) wa.classList.toggle('wa-visible', window.scrollY > window.innerHeight * 0.7);
    }
    alScrollear();
    window.addEventListener('scroll', alScrollear, { passive: true });
  }

  /* ======================================================= menu movil ===== */
  function activarMenu() {
    var boton = document.getElementById('hamburguesa');
    var menu = document.getElementById('menu-movil');
    var header = document.getElementById('header');
    if (!boton || !menu) return;
    function cerrar() {
      menu.hidden = true;
      menu.classList.remove('hd-abierto');
      if (header) header.classList.remove('hd-conMenu');
      boton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    boton.addEventListener('click', function () {
      var abierto = boton.getAttribute('aria-expanded') === 'true';
      if (abierto) { cerrar(); return; }
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('hd-abierto'); });
      if (header) header.classList.add('hd-conMenu');
      boton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', cerrar);
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrar();
    });
  }

  /* ==================================================== footer (contacto) == */
  function completarContacto() {
    function set(id, href, text) {
      var el = document.getElementById(id);
      if (el) { if (href) el.href = href; if (text) el.textContent = text; }
    }
    if (CFG.whatsapp) set('ftWa', 'https://wa.me/' + CFG.whatsapp, 'WhatsApp');
    if (CFG.email) set('ftMail', 'mailto:' + CFG.email, CFG.email);
    if (CFG.instagram) set('ftIg', 'https://instagram.com/' + CFG.instagram, '@' + CFG.instagram);
    var anio = document.getElementById('anio');
    if (anio) anio.textContent = new Date().getFullYear();
  }

  /* ==================================================== plano de la finca = */
  function activarPlano() {
    var plano = document.getElementById('plano');
    if (!plano) return;

    var LUGARES = [
      { coord: '01 · Privada', nombre: 'La casa',
        desc: 'Donde vive Flor. No se ofrece, pero está a cincuenta metros: por eso siempre hay alguien.',
        chip: 'La casa' },
      { coord: '02 · Cinco habitaciones', nombre: 'La casa de en frente',
        desc: 'Las cinco habitaciones y la galería que recorre todo el frente. Es la casa que se ofrece.',
        chip: 'La casa de en frente', ir: 'Ver habitaciones →', href: '#habitaciones' },
      { coord: '03 · Referencia del casco', nombre: 'El molino',
        desc: 'En el medio del parque, entre las dos casas. Se ve desde casi cualquier punto de la finca.',
        chip: 'El molino' },
      { coord: '04 · Lo que da la temporada', nombre: 'La huerta',
        desc: 'Es chica, la de la casa. Se cosecha lo que esté maduro y se hacen dulces de estación con eso.',
        chip: 'La huerta', ir: 'Ver experiencias →', href: '#experiencias' },
      { coord: '05 · Cosecha en marzo', nombre: 'El viñedo',
        desc: 'Las hileras que quedan más allá del monte. En marzo se escucha la cosecha desde el casco.',
        chip: 'El viñedo', ir: 'Ver experiencias →', href: '#experiencias' }
    ];

    var puntos = [].slice.call(plano.querySelectorAll('.plano__punto'));
    var tira = document.getElementById('planoTira');
    var elegido = 0;

    var chips = LUGARES.map(function (l, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'plano__chip';
      b.textContent = l.chip;
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { elegir(i, true); });
      tira.appendChild(b);
      return b;
    });

    function pintar(i) {
      var l = LUGARES[i];
      document.getElementById('planoCoord').textContent = l.coord;
      document.getElementById('planoNombre').textContent = l.nombre;
      document.getElementById('planoDesc').textContent = l.desc;
      var ir = document.getElementById('planoIr');
      // No todos los puntos llevan a algún lado: el de la casa de Flor solo cuenta.
      if (l.href) { ir.hidden = false; ir.href = l.href; ir.textContent = l.ir; }
      else { ir.hidden = true; }
    }

    function elegir(i, fijar) {
      pintar(i);
      if (fijar) elegido = i;
      puntos.forEach(function (p, j) { p.setAttribute('aria-pressed', String(j === i)); });
      chips.forEach(function (c, j) { c.setAttribute('aria-pressed', String(j === i)); });
      if (fijar && chips[i].scrollIntoView) {
        chips[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      }
    }

    puntos.forEach(function (p, i) {
      p.addEventListener('click', function () { elegir(i, true); });
      // Con mouse se puede espiar sin elegir; al salir vuelve al que estaba.
      p.addEventListener('mouseenter', function () { elegir(i, false); });
      p.addEventListener('focus', function () { elegir(i, false); });
      p.addEventListener('mouseleave', function () { elegir(elegido, false); });
      p.addEventListener('blur', function () { elegir(elegido, false); });
    });

    elegir(0, true);
  }

  /* ================================================ buscador del banner == */
  /* El botón cambia según lo que se sepa de esas fechas:
     libres  -> lleva derecho a WhatsApp con el mensaje armado;
     tomadas -> baja al calendario, que es donde se ve qué días sí hay;
     sin fechas o sin datos todavía -> baja al calendario también. */
  function activarBuscadorHero() {
    var form = document.getElementById('buscadorHero');
    if (!form) return;

    var eEntrada = document.getElementById('bhEntrada');
    var eSalida = document.getElementById('bhSalida');
    var ePersonas = document.getElementById('bhPersonas');
    var boton = form.querySelector('.hero-buscador__boton');
    var estado = document.getElementById('bhEstado');

    // No se pueden pedir fechas pasadas.
    var hoy = aClave(new Date());
    eEntrada.min = hoy;
    eSalida.min = hoy;

    function libre() {
      return consultarRango ? consultarRango(eEntrada.value, eSalida.value) : null;
    }

    function repintar() {
      var r = libre();
      if (r === true) {
        boton.textContent = 'Consultar por WhatsApp';
        boton.classList.add('hero-buscador__boton--libre');
        estado.textContent = 'Esos días están libres.';
        estado.className = 'hero-buscador__estado hero-buscador__estado--libre';
      } else if (r === false) {
        boton.textContent = 'Ver disponibilidad';
        boton.classList.remove('hero-buscador__boton--libre');
        estado.textContent = 'Esos días ya están tomados. Mirá el calendario para elegir otros.';
        estado.className = 'hero-buscador__estado hero-buscador__estado--ocupado';
      } else {
        boton.textContent = 'Ver disponibilidad';
        boton.classList.remove('hero-buscador__boton--libre');
        estado.textContent = '';
        estado.className = 'hero-buscador__estado';
      }
    }

    // Elegir la entrada corre el piso de la salida: no hay salida anterior.
    eEntrada.addEventListener('change', function () {
      if (eEntrada.value) {
        eSalida.min = eEntrada.value;
        if (eSalida.value && eSalida.value <= eEntrada.value) eSalida.value = '';
      }
      repintar();
    });
    eSalida.addEventListener('change', repintar);

    // Si la disponibilidad llega después de que ya eligieron, se revisa sola.
    alCargarDisponibilidad = repintar;

    function bajarAlCalendario() {
      var personas = document.getElementById('personas');
      if (personas && ePersonas.value) personas.value = ePersonas.value;
      if (precargarFechas) precargarFechas(eEntrada.value, eSalida.value);

      var destino = document.getElementById('consultar');
      if (destino) {
        var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        destino.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth', block: 'start' });
      }
      setTimeout(function () {
        var nombre = document.getElementById('nombre');
        if (nombre) nombre.focus({ preventScroll: true });
      }, 700);
    }

    function irAWhatsapp() {
      if (!CFG.whatsapp) { bajarAlCalendario(); return; }
      var n = nochesEntre(eEntrada.value, eSalida.value).length;
      var personas = ePersonas.value || '2';
      var lineas = [
        'Hola! Queria consultar por una estadia en San Eusebio.',
        '',
        'Entrada: ' + enCastellano(eEntrada.value),
        'Salida: ' + enCastellano(eSalida.value),
        n + (n === 1 ? ' noche' : ' noches') + ' - ' + personas +
          (personas === '1' ? ' persona' : ' personas')
      ];
      var url = 'https://wa.me/' + CFG.whatsapp + '?text=' +
        encodeURIComponent(lineas.join('\n'));
      var v = window.open(url, '_blank', 'noopener,noreferrer');
      // Si el navegador bloqueó la ventana, al menos que quede el calendario.
      if (!v) bajarAlCalendario();
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (libre() === true) irAWhatsapp();
      else bajarAlCalendario();
    });

    repintar();
  }

  /* ================================================ profundidad al scroll = */
  function activarProfundidad() {
    var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fondo = document.querySelector('.hero-fondo');
    var contenido = document.querySelector('.hero-contenido');
    if (quieto || !fondo || !contenido) return;

    var pendiente = false;

    function pintar() {
      pendiente = false;
      var alto = window.innerHeight;
      var y = window.scrollY || window.pageYOffset;
      // Fuera del banner no hay nada que calcular.
      if (y > alto) return;
      var avance = Math.min(y / alto, 1);
      fondo.style.transform = 'scale(' + (1 + avance * 0.08).toFixed(4) + ')';
      contenido.style.transform = 'translate3d(0,' + (-avance * 60).toFixed(1) + 'px,0)';
      contenido.style.opacity = String(Math.max(0, 1 - avance * 1.6));
    }

    window.addEventListener('scroll', function () {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(pintar);
    }, { passive: true });

    pintar();
  }

  /* ==================================================== textos (Supabase) = */
  function cargarContenidos() {
    if (!sb) return;
    sb.from('contenidos').select('clave, valor')
      .then(function (res) {
        if (!res || !res.data) return;
        res.data.forEach(function (fila) {
          if (fila.valor == null || fila.valor === '') return;

          // Elementos de texto simple (título, intro): se reemplaza el texto.
          document.querySelectorAll('[data-contenido="' + fila.clave + '"]')
            .forEach(function (el) { el.textContent = fila.valor; });

          // Bloques de cuerpo: cada línea en blanco separa un párrafo.
          document.querySelectorAll('[data-contenido-cuerpo="' + fila.clave + '"]')
            .forEach(function (el) {
              el.innerHTML = '';
              fila.valor.split(/\n\s*\n/).forEach(function (parrafo) {
                var t = parrafo.trim();
                if (!t) return;
                var p = document.createElement('p');
                p.textContent = t;
                el.appendChild(p);
              });
            });

          // Filas de "etiqueta | explicación", una por línea. Un solo campo
          // en el panel maneja toda la lista de qué incluye la tarifa.
          document.querySelectorAll('[data-contenido-filas="' + fila.clave + '"]')
            .forEach(function (el) {
              var filas = fila.valor.split('\n')
                .map(function (t) { return t.trim(); })
                .filter(function (t) { return t.indexOf('|') > 0; });
              if (!filas.length) return;
              el.innerHTML = '';
              filas.forEach(function (t) {
                var corte = t.indexOf('|');
                var caja = document.createElement('div');
                caja.className = 'incluye__fila';
                var dt = document.createElement('dt');
                dt.textContent = t.slice(0, corte).trim();
                var dd = document.createElement('dd');
                dd.textContent = t.slice(corte + 1).trim();
                caja.appendChild(dt);
                caja.appendChild(dd);
                el.appendChild(caja);
              });
            });

          // Listas: cada línea es un ítem. Sirve para el menú, que va a
          // crecer, sin que haga falta tocar el HTML cada vez.
          document.querySelectorAll('[data-contenido-items="' + fila.clave + '"]')
            .forEach(function (el) {
              var lineas = fila.valor.split('\n')
                .map(function (t) { return t.trim(); })
                .filter(function (t) { return t.length > 0; });
              if (!lineas.length) return;
              el.innerHTML = '';
              lineas.forEach(function (t) {
                var li = document.createElement('li');
                li.textContent = t;
                el.appendChild(li);
              });
            });

          // Fotos: reemplazan el placeholder por una imagen real.
          document.querySelectorAll('[data-foto="' + fila.clave + '"]')
            .forEach(function (el) {
              var img = document.createElement('img');
              img.src = fila.valor;
              img.alt = '';
              img.loading = 'lazy';
              // El placeholder puede pedir una clase para la imagen que lo
              // reemplaza (por ejemplo, la foto de fondo del hero).
              var clase = el.getAttribute('data-foto-clase');
              if (clase) img.className = clase;
              // Si cuelga de una figura opcional, la figura recién se muestra
              // ahora que hay algo real para mostrar. Lo mismo con el grupo
              // que la contiene: sin ninguna foto, no ocupa lugar.
              var opcional = el.closest ? el.closest('.foto-opcional') : null;
              var grupo = el.closest ? el.closest('.grupo-opcional') : null;
              // Ojo: hay que buscar los ancestros ANTES de reemplazar el
              // placeholder. Después ya salió del documento y closest da null.
              var plano = el.closest ? el.closest('.plano') : null;
              // El placeholder puede ser un <span> (se reemplaza) o un
              // contenedor .hab-foto (se le vacía y se le mete la imagen).
              if (el.classList.contains('hab-foto')) {
                el.innerHTML = '';
                el.appendChild(img);
              } else {
                el.replaceWith(img);
              }
              if (opcional) opcional.classList.add('con-foto');
              if (grupo) grupo.classList.add('con-foto');
              if (plano) plano.classList.add('con-foto');
            });
        });
      })
      .catch(function () { /* si falla, quedan los textos por defecto del HTML */ });
  }

  /* ===================================================== hero (Supabase) == */

  /* Interruptor: poner en false vuelve al comportamiento viejo (video solo en
     pantallas grandes, celular siempre con la foto fija). */
  var VIDEO_EN_MOBILE = true;

  /* En celular no se pide el mismo archivo que en escritorio. Si el video está
     en Cloudinary, se le encarga a Cloudinary una versión angosta y más
     comprimida: mismo video, una fracción del peso. Si la URL es de otro lado,
     se devuelve tal cual y no pasa nada. */
  function versionLiviana(url) {
    if (!url || url.indexOf('res.cloudinary.com') === -1) return url;
    var corte = url.indexOf('/video/upload/');
    if (corte === -1) return url;
    corte += '/video/upload/'.length;
    return url.slice(0, corte) + 'w_720,c_limit,q_auto:eco/' + url.slice(corte);
  }

  /* Decide si corresponde cargar video y con qué criterio. */
  function planDeVideo() {
    var grande = window.matchMedia('(min-width: 48rem)').matches;
    var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var con = navigator.connection || {};
    var ahorro = con.saveData === true;
    var tipo = con.effectiveType || '';
    var redoLenta = (tipo === '2g' || tipo === 'slow-2g');

    /* Nadie recibe video si pidió menos movimiento o activó ahorro de datos.
       En el campo la señal manda: con 2G se queda la foto y listo. */
    if (quieto || ahorro || redoLenta) return null;
    if (!grande && !VIDEO_EN_MOBILE) return null;

    return { grande: grande };
  }

  function cargarHero() {
    if (!sb) return;
    sb.from('configuracion')
      .select('hero_video_url, hero_poster_url')
      .eq('id', 1)
      .single()
      .then(function (res) {
        var d = res && res.data;
        if (!d) return;
        var fondo = document.querySelector('.hero-fondo');
        if (!fondo) return;
        if (d.hero_poster_url) {
          var vacio = fondo.querySelector('.hero-posterVacio');
          if (vacio) vacio.remove();
          var img = document.createElement('img');
          img.src = d.hero_poster_url;
          img.alt = '';
          img.className = 'hero-poster';
          fondo.insertBefore(img, fondo.firstChild);
        }
        var plan = planDeVideo();
        if (!d.hero_video_url || !plan) return;

        var v = document.createElement('video');
        v.src = plan.grande ? d.hero_video_url : versionLiviana(d.hero_video_url);
        if (d.hero_poster_url) v.poster = d.hero_poster_url;
        v.autoplay = true; v.muted = true; v.loop = true;
        v.playsInline = true; v.setAttribute('playsinline', '');
        v.setAttribute('muted', '');
        v.preload = plan.grande ? 'auto' : 'none';
        v.className = 'hero-video';
        v.setAttribute('aria-hidden', 'true');

        /* Red de contención: si el video no llega a reproducirse en 8 segundos
           —señal mala, archivo pesado, autoplay bloqueado— se saca del medio y
           queda la foto fija, que es lo que había antes. El visitante nunca ve
           un rectángulo negro esperando. */
        var vivo = false;
        v.addEventListener('playing', function () { vivo = true; });
        v.addEventListener('error', function () { if (v.parentNode) v.parentNode.removeChild(v); });
        setTimeout(function () {
          if (!vivo && v.parentNode) v.parentNode.removeChild(v);
        }, 8000);

        var velo = fondo.querySelector('.hero-velo');
        fondo.insertBefore(v, velo);

        /* En celular la reproducción automática puede estar bloqueada (modo de
           bajo consumo, por ejemplo). Se pide igual y si dice que no, no rompe. */
        var intento = v.play();
        if (intento && intento.catch) intento.catch(function () { });
      })
      .catch(function () { });
  }

  /* ======================================================= calendario ===== */
  /* Lo deja listo activarCalendario para que el buscador del banner pueda
     dejar las fechas ya elegidas abajo. */
  var precargarFechas = null;

  /* Le contesta al buscador del banner si un rango está libre. Devuelve null
     mientras la disponibilidad todavía no llegó de la base: en ese caso no se
     promete nada y se manda al calendario. */
  var consultarRango = null;

  /* Avisa al buscador cuando la disponibilidad terminó de cargar, para que
     revise las fechas que la persona ya haya elegido. */
  var alCargarDisponibilidad = null;

  function activarCalendario() {
    var grilla = document.getElementById('grillaDias');
    if (!grilla) return;

    var hoy = aClave(new Date());
    var ocupadas = {};
    var vista = { anio: new Date().getFullYear(), mes: new Date().getMonth() };
    var entrada = null, salida = null;
    var disponibilidadCargada = false;

    var etiqueta = document.getElementById('etiquetaMes');
    var resumen = document.getElementById('resumen');
    var enviar = document.getElementById('enviar');
    var nombre = document.getElementById('nombre');
    var mesAnt = document.getElementById('mesAnterior');
    var mesSig = document.getElementById('mesSiguiente');
    var form = document.getElementById('formulario');

    function estaOcupada(c) { return ocupadas[c] === true; }
    function rangoPisaOcupada(a, b) { return nochesEntre(a, b).some(estaOcupada); }

    if (sb) {
      seguro('disponibilidad', function () {
        sb.from('disponibilidad')
          .select('fecha')
          .eq('disponible', false)
          .gte('fecha', hoy)
          .then(function (res) {
            if (res && res.data) {
              res.data.forEach(function (r) { ocupadas[r.fecha] = true; });
            }
            disponibilidadCargada = true;
            dibujar();
            if (alCargarDisponibilidad) alCargarDisponibilidad();
          })
          .catch(function () { });
      });
    }

    function actualizarResumen() {
      if (entrada && salida) {
        var n = nochesEntre(entrada, salida).length;
        resumen.innerHTML =
          '<p class="con-resumenFechas">' + enCastellano(entrada) + ' - ' +
          enCastellano(salida) + '</p>' +
          '<p class="con-resumenNoches">' + n + (n === 1 ? ' noche' : ' noches') + '</p>';
      } else {
        resumen.innerHTML = '<p class="con-resumenVacio">' +
          (entrada ? 'Ahora elegi el dia de salida.'
                   : 'Elegi el dia de entrada en el calendario.') + '</p>';
      }
      if (enviar) enviar.disabled = !(entrada && salida && nombre && nombre.value.trim().length > 1);
    }

    function dibujar() {
      if (etiqueta) etiqueta.textContent = MESES[vista.mes] + ' ' + vista.anio;
      grilla.innerHTML = '';
      var primero = new Date(vista.anio, vista.mes, 1);
      var dias = new Date(vista.anio, vista.mes + 1, 0).getDate();
      var corr = (primero.getDay() + 6) % 7;
      var i;
      for (i = 0; i < corr; i++) grilla.appendChild(document.createElement('span'));
      for (var d = 1; d <= dias; d++) {
        var clave = aClave(new Date(vista.anio, vista.mes, d));
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = String(d);
        b.setAttribute('aria-label', enCastellano(clave));
        var cl = ['con-dia'];
        if (clave < hoy) { cl.push('con-pasado'); b.disabled = true; }
        else if (estaOcupada(clave)) { cl.push('con-ocupado'); b.disabled = true; }
        if (clave === entrada || clave === salida) cl.push('con-extremo');
        if (entrada && salida && clave > entrada && clave < salida) cl.push('con-enRango');
        b.className = cl.join(' ');
        b.setAttribute('data-clave', clave);
        grilla.appendChild(b);
      }
      if (mesAnt) {
        mesAnt.disabled = (vista.anio === new Date().getFullYear() &&
                           vista.mes === new Date().getMonth());
      }
      actualizarResumen();
    }

    consultarRango = function (e, sal) {
      if (!e || !sal || sal <= e) return null;
      if (!disponibilidadCargada) return null;
      return !rangoPisaOcupada(e, sal);
    };

    precargarFechas = function (e, sal) {
      if (!e) return;
      entrada = e;
      salida = (sal && sal > e && !rangoPisaOcupada(e, sal)) ? sal : null;
      var f = new Date(e + 'T00:00:00');
      if (!isNaN(f)) vista = { anio: f.getFullYear(), mes: f.getMonth() };
      dibujar();
    };

    grilla.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('button') : null;
      if (!b || b.disabled) return;
      var clave = b.getAttribute('data-clave');
      if (!clave) return;
      if (!entrada || (entrada && salida)) { entrada = clave; salida = null; }
      else if (clave <= entrada) { entrada = clave; }
      else if (rangoPisaOcupada(entrada, clave)) { entrada = clave; salida = null; }
      else { salida = clave; }
      dibujar();
    });

    if (mesAnt) mesAnt.addEventListener('click', function () {
      var f = new Date(vista.anio, vista.mes - 1, 1);
      vista = { anio: f.getFullYear(), mes: f.getMonth() }; dibujar();
    });
    if (mesSig) mesSig.addEventListener('click', function () {
      var f = new Date(vista.anio, vista.mes + 1, 1);
      vista = { anio: f.getFullYear(), mes: f.getMonth() }; dibujar();
    });
    if (nombre) nombre.addEventListener('input', actualizarResumen);

    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!entrada || !salida) return;
      var n = nochesEntre(entrada, salida).length;
      var pEl = document.getElementById('personas');
      var cEl = document.getElementById('contacto');
      var mEl = document.getElementById('mensaje');
      var personas = pEl ? pEl.value : '1';
      var contacto = cEl ? cEl.value.trim() : '';
      var mensaje = mEl ? mEl.value.trim() : '';
      var lineas = [
        'Hola, soy ' + (nombre ? nombre.value.trim() : '') + '.',
        'Queria consultar por una estadia en San Eusebio.',
        '',
        'Entrada: ' + enCastellano(entrada),
        'Salida: ' + enCastellano(salida),
        n + (n === 1 ? ' noche' : ' noches') + ' - ' + personas +
          (personas === '1' ? ' persona' : ' personas')
      ];
      if (contacto) lineas.push('Contacto: ' + contacto);
      if (mensaje) lineas.push('', mensaje);
      var url = 'https://wa.me/' + CFG.whatsapp + '?text=' +
        encodeURIComponent(lineas.join('\n'));
      window.open(url, '_blank', 'noopener,noreferrer');
      var aviso = document.getElementById('aviso');
      if (aviso) {
        aviso.hidden = false;
        aviso.textContent =
          'Listo. Si WhatsApp no se abrio solo, revisa si el navegador bloqueo la ventana.';
      }
    });

    dibujar();
  }

  /* ============================================================ arranque == */
  function iniciar() {
    seguro('reveal', activarReveal);
    seguro('header', activarHeaderYWhatsapp);
    seguro('menu', activarMenu);
    seguro('contacto', completarContacto);
    seguro('contenidos', cargarContenidos);
    seguro('hero', cargarHero);
    seguro('calendario', activarCalendario);
    seguro('plano', activarPlano);
    seguro('buscadorHero', activarBuscadorHero);
    seguro('profundidad', activarProfundidad);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
