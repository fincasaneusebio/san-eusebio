/* ==========================================================================
   San Eusebio — configuración del sitio
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que hay que tocar para cambiar datos de contacto.
   Está pensado para editarse a mano, sin saber programar: cambiás el texto
   entre comillas y listo.

   La clave "anon" de Supabase es PÚBLICA por diseño (va en el navegador en
   todos los sitios que usan Supabase). No es un secreto y no da acceso a
   nada sensible: las tablas están protegidas por reglas del lado de Supabase.
   La clave "service_role" NUNCA va acá.
   ========================================================================== */

window.SAN_EUSEBIO = {
  // --- Supabase (lectura pública: fotos, textos, calendario) ---
  supabaseUrl: 'https://ppbesxeiasjkzsvxlqec.supabase.co',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmVzeGVpYXNqa3pzdnhscWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MDU1ODEsImV4cCI6MjEwMDI4MTU4MX0.7EIUs4i-Yq1gp4FspttptOVLELExFuBuHZg6bwlVLNk',

  // --- Contacto (CAMBIAR por los datos reales antes de publicar) ---
  whatsapp: '5492494622264', // solo números, con código de país (54 9 ...)
  email: 'fincasaneusebio@gmail.com',
  instagram: 'saneusebio.hosteria',

  ubicacion: 'De la Canal, Tandil — Provincia de Buenos Aires',

  // Coordenadas aproximadas de De la Canal. Ajustar al punto exacto del casco.
  mapaLat: -37.2333,
  mapaLng: -59.4667,
};
