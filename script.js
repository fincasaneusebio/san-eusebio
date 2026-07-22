/* ==========================================================================
   San Eusebio — comportamiento del sitio (HTML puro)
   Sin frameworks. Lee datos de Supabase desde el navegador con la clave
   pública, y si Supabase no responde cae a valores por defecto para que el
   sitio nunca se vea roto.
   ========================================================================== */

(function () {
  'use strict';

  var CFG = window.SAN_EUSEBIO || {};

  /* --- cliente de Supabase (opcional: si no cargó, seguimos sin él) ------- */
  var sb = null;
  try {
    if (window.supabase && CFG.supabaseUrl && CFG.supabaseAnonKey) {
      sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    }
  } catch (e) {
    sb = null;
  }

  /* ====================================================== aparición scroll = */
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
  }

  /* ================================================== header + whatsapp ==== */
  function activarHeaderYWhatsapp() {
    var header = document.getElementById('header');
    var wa = document.getElementById('botonWa');

    // Enlace de WhatsApp con mensaje inicial
    if (wa && CFG.whatsapp) {
      var msg = encodeURIComponent(
        'Hola, estuve viendo la página de San Eusebio y quería consultar por una estadía.'
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

  /* ======================================================= menú móvil ===== */
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
        // El video solo en pantallas grandes, sin ahorro de datos.
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
      .catch(function () { /* si falla, queda el degradado por defecto */ });
  }

  /* ======================================================= calendario ===== */
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

  function activarCalendario() {
    var grilla = document.getElementById('grillaDias');
    if (!grilla) return;

    var hoy = aClave(new Date());
    var ocupadas = new Set();
    var vista = { anio: new Date().getFullYear(), mes: new Date().getMonth() };
    var entrada = null, salida = null;

    var etiqueta = document.getElementById('etiquetaMes');
    var resumen = document.getElementById('resumen');
    var enviar = document.getElementById('enviar');
    var nombre = document.getElementById('nombre');

    // Traer fechas ocupadas de Supabase (si hay). Fallback: ninguna.
    if (sb) {
      sb.from('disponibilidad')
        .select('fecha')
        .eq('disponible', false)
        .gte('fecha', hoy)
        .then(function (res) {
          if (res && res.data) {
            res.data.forEach(function (r) { ocupadas.add(r.fecha); });
            dibujar();
          }
        })
        .catch(function () { /* sin datos: todo libre */ });
    }

    function actualizarResumen() {
      if (entrada && salida) {
        var n = nochesEntre(entrada, salida).length;
        resumen.innerHTML =
          '<p class="con-resumenFechas">' + enCastellano(entrada) + ' — ' +
          enCastellano(salida) + '</p>' +
          '<p class="con-resumenNoches">' + n + (n === 1 ? ' noche' : ' noches') + '</p>';
      } else {
        resumen.innerHTML = '<p class="con-resumenVacio">' +
          (entrada ? 'Ahora elegí el día de salida.'
                   : 'Elegí el día de entrada en el calendario.') + '</p>';
      }
      enviar.disabled = !(entrada && salida && nombre.value.trim().length > 1);
    }

    function dibujar() {
      etiqueta.textContent = MESES[vista.mes] + ' ' + vista.anio;
      grilla.innerHTML = '';
      var primero = new Date(vista.anio, vista.mes, 1);
      var dias = new Date(vista.anio, vista.mes + 1, 0).getDate();
      var corr = (primero.getDay() + 6) % 7;
      for (var i = 0; i < corr; i++) grilla.appendChild(document.createElement('span'));
      for (var d = 1; d <= dias; d++) {
        var clave = aClave(new Date(vista.anio, vista.mes, d));
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = d;
        b.setAttribute('aria-label', enCastellano(clave));
        var cl = ['con-dia'];
        if (clave < hoy) { cl.push('con-pasado'); b.disabled = true; }
        else if (ocupadas.has(clave)) { cl.push('con-ocupado'); b.disabled = true; }
        if (clave === entrada || clave === salida) cl.push('con-extremo');
        if (entrada && salida && clave > entrada && clave < salida) cl.push('con-enRango');
        b.className = cl.join(' ');
        b.dataset.clave = clave;
        grilla.appendChild(b);
      }
      var esteMes = (vista.anio === new Date().getFullYear() &&
                     vista.mes === new Date().getMonth());
      document.getElementById('mesAnterior').disabled = esteMes;
      actualizarResumen();
    }

    grilla.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || b.disabled) return;
      var clave = b.dataset.clave;
      if (!entrada || (entrada && salida)) { entrada = clave; salida = null; }
      else if (clave <= entrada) { entrada = clave; }
      else if (nochesEntre(entrada, clave).some(function (n) { return ocupadas.has(n); })) {
        entrada = clave; salida = null;
      } else { salida = clave; }
      dibujar();
    });

    document.getElementById('mesAnterior').addEventListener('click', function () {
      var f = new Date(vista.anio, vista.mes - 1, 1);
      vista = { anio: f.getFullYear(), mes: f.getMonth() }; dibujar();
    });
    document.getElementById('mesSiguiente').addEventListener('click', function () {
      var f = new Date(vista.anio, vista.mes + 1, 1);
      vista = { anio: f.getFullYear(), mes: f.getMonth() }; dibujar();
    });
    nombre.addEventListener('input', actualizarResumen);

    // El formulario deriva a WhatsApp con los datos cargados.
    document.getElementById('formulario').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!entrada || !salida) return;
      var n = nochesEntre(entrada, salida).length;
      var personas = document.getElementById('personas').value;
      var contacto = document.getElementById('contacto').value.trim();
      var mensaje = document.getElementById('mensaje').value.trim();

      var lineas = [
        'Hola, soy ' + nombre.value.trim() + '.',
        'Quería consultar por una estadía en San Eusebio.',
        '',
        'Entrada: ' + enCastellano(entrada),
        'Salida: ' + enCastellano(salida),
        n + (n === 1 ? ' noche' : ' noches') + ' · ' + personas +
          (personas === '1' ? ' persona' : ' personas'),
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
          'Listo. Si WhatsApp no se abrió solo, revisá si el navegador bloqueó la ventana.';
      }
    });

    dibujar();
  }

  /* ============================================================ arranque == */
  function iniciar() {
    activarReveal();
    activarHeaderYWhatsapp();
    activarMenu();
    cargarHero();
    activarCalendario();

    // Año del footer
    var anio = document.getElementById('anio');
    if (anio) anio.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
