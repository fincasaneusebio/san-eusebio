# San Eusebio — sitio público

Landing de la hostería. Next.js 15 (App Router) + Supabase, pensada para
desplegarse en Vercel o Cloudflare Pages.

## Levantarlo localmente

```bash
npm install
cp .env.example .env.local   # y completar con las claves de Supabase
npm run dev
```

Abre en http://localhost:3000

El sitio **funciona sin Supabase configurado**: si las variables de entorno
están vacías, cae al contenido de `lib/content.ts` y muestra el calendario con
todas las fechas libres. Sirve para maquetar y mostrarle avances a la clienta
antes de que exista la base.

## Estructura

```
app/
  layout.tsx                 tipografías, header, footer, metadatos
  page.tsx                   la home (arma las secciones)
  globals.css                tokens del manual de marca
  api/consultas/route.ts     guarda las consultas del formulario
  coaching-con-caballos/     página propia del servicio (en preparación)
components/                  una sección por archivo, con su CSS Module al lado
lib/
  content.ts                 textos y datos por defecto + datos de contacto
  supabase.ts                cliente de lectura, tolera que no haya base
supabase/schema.sql          tablas y permisos, se corre una sola vez
```

## Antes de publicar

- [ ] Reemplazar el logo provisorio en `components/Logo.tsx` por el SVG original.
- [ ] Cargar los datos reales de contacto en `lib/content.ts` (`whatsapp`, `email`,
      `instagram`) y las coordenadas exactas del casco.
- [ ] Cambiar `metadataBase` en `app/layout.tsx` por el dominio definitivo.
- [ ] Subir el video y la imagen del hero (ver más abajo).
- [ ] Correr `supabase/schema.sql` en el proyecto de Supabase.

## El video del hero

Se sirve desde una URL externa, no desde el repositorio. Límites:

- mp4 (H.264), **6 MB como máximo**, sin pista de audio.
- 1920×1080, entre 8 y 12 segundos, en loop.
- Siempre con una imagen fija (`hero_poster_url`) del mismo encuadre.

El video **solo se carga en pantallas de 768px para arriba**, y nunca si el
visitante activó el ahorro de datos o pidió menos movimiento. En celular se ve
la imagen fija. Es a propósito: buena parte del tráfico entra desde el celular
en zona rural, con señal pobre.

## Notas de marca

Los colores y tipografías salen del Manual de Marca y viven como variables CSS
en `app/globals.css`. No agregar tonos sueltos en los componentes: si hace falta
un color nuevo, se agrega como token ahí y se usa desde ahí.

El Ámbar (`--ambar`) es solo filete y detalle. Nunca fondo grande.
