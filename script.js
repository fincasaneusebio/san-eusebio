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
        });
      })
      .catch(function () { /* si falla, quedan los textos por defecto del HTML */ });
  }

  /* ===================================================== hero (Supabase) == */
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
        var grande = window.matchMedia('(min-width: 48rem)').matches;
        var ahorro = navigator.connection && navigator.connection.saveData === true;
        if (d.hero_video_url && grande && !ahorro) {
          var v = document.createElement('video');
          v.src = d.hero_video_url;
          if (d.hero_poster_url) v.poster = d.hero_poster_url;
          v.autoplay = true; v.muted = true; v.loop = true;
          v.playsInline = true; v.setAttribute('playsinline', '');
          v.className = 'hero-video';
          v.setAttribute('aria-hidden', 'true');
          var velo = fondo.querySelector('.hero-velo');
          fondo.insertBefore(v, velo);
        }
      })
      .catch(function () { });
  }

  /* ======================================================= calendario ===== */
  function activarCalendario() {
    var grilla = document.getElementById('grillaDias');
    if (!grilla) return;

    var hoy = aClave(new Date());
    var ocupadas = {};
    var vista = { anio: new Date().getFullYear(), mes: new Date().getMonth() };
    var entrada = null, salida = null;

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
              dibujar();
            }
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
