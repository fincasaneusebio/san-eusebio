# San Eusebio — sitio web

Sitio estático en HTML puro. Mismo enfoque que CoMakers: se publica desde
GitHub y lee el contenido editable desde Supabase. No necesita servidor ni
proceso de build.

## Archivos

```
index.html                    la landing (inicio)
coaching-con-caballos.html    página del servicio de coaching
styles.css                    todos los estilos (colores y tipografías del manual)
script.js                     interacción: menú, calendario, formulario, lectura de datos
config.js                     ← EL ÚNICO archivo para editar datos de contacto
```

## Para verlo en tu compu

No hace falta instalar nada. Abrí una terminal en esta carpeta y corré:

```bash
python3 -m http.server 8000
```

Después entrá a http://localhost:8000 en el navegador.

(Abrir el `index.html` con doble clic también funciona, pero algunos navegadores
bloquean la lectura de Supabase con `file://`. Por eso conviene el servidorcito.)

## Antes de publicar — completar datos reales

Todo lo editable a mano está en **`config.js`**. Abrilo y cambiá:

- `whatsapp` — el número real, solo dígitos con código de país (ej: `5492494XXXXXX`).
- `email` — el mail de contacto.
- `instagram` — el usuario, sin la arroba.
- `mapaLat` / `mapaLng` — las coordenadas exactas del casco (opcional).

El logo de hoy es un texto tipografiado provisorio. Cuando llegue el SVG del
estudio, se reemplaza (lo vemos juntos, es un cambio acotado).

## Publicar en GitHub Pages

1. Subí estos archivos al repositorio `san-eusebio` (reemplazando lo que había).
2. En GitHub, andá a **Settings → Pages**.
3. En "Source" elegí **Deploy from a branch**, rama **main**, carpeta **/ (root)**.
4. Guardá. En un par de minutos el sitio queda online en una URL tipo
   `https://fincasaneusebio.github.io/san-eusebio/`.

Esa URL gratis sirve para ver todo funcionando y mostrarlo. Cuando se compre el
dominio, se conecta desde esa misma pantalla (Settings → Pages → Custom domain).

## El contenido editable (Supabase)

El sitio lee dos cosas de Supabase, con la clave pública:

- **Hero** (video e imagen del banner de inicio) — tabla `configuracion`.
- **Calendario** (fechas ocupadas y precios) — tabla `disponibilidad`.

Si Supabase no responde o está vacío, el sitio se ve igual: usa una imagen de
fondo por defecto en el hero y muestra el calendario con todo libre. Nunca se
rompe por falta de datos.

El formulario de consulta **no guarda nada**: arma un mensaje con las fechas
elegidas y abre WhatsApp para seguir la conversación ahí.

## Nota de marca

Colores y tipografías salen del Manual de Marca y viven como variables al
principio de `styles.css`. Si hace falta un color nuevo, se agrega ahí como
variable y se usa desde ahí — no sueltos en el HTML. El ámbar es solo para
detalles y filetes, nunca como fondo grande.
