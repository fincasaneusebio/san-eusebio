# San Eusebio — sitio web

Sitio estático en HTML puro. Se publica desde GitHub Pages y no depende de
ninguna base de datos. No necesita servidor ni proceso de build.

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

## Qué se edita y dónde

El sitio no usa base de datos ni panel: todo vive en el repo.

- **Textos** → directamente en `index.html` y `coaching-con-caballos.html`.
- **Fotos** → sueltas en la raíz del repo. Para cambiar una, subí la nueva
  con el mismo nombre. La lista de qué foto va en cada lugar está al
  principio de `script.js` (`FOTOS`).
- **Fechas ocupadas del calendario** → lista `OCUPADAS` al principio de
  `script.js`, una fecha por noche en formato `'AAAA-MM-DD'`.
- **Video del hero** → está en Cloudinary; la URL está en `HERO`, en
  `script.js`.
- **Datos de contacto** → `config.js`.

El formulario de consulta **no guarda nada**: arma un mensaje con las fechas
elegidas y abre WhatsApp para seguir la conversación ahí.

## Nota de marca

Colores y tipografías salen del Manual de Marca y viven como variables al
principio de `styles.css`. Si hace falta un color nuevo, se agrega ahí como
variable y se usa desde ahí — no sueltos en el HTML. El ámbar es solo para
detalles y filetes, nunca como fondo grande.
