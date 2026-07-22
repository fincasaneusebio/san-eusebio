/**
 * Contenido por defecto del sitio.
 *
 * Todo lo que está acá es lo que se ve si Supabase todavía no tiene datos
 * cargados (o si la base no responde). Cuando el backoffice esté andando,
 * estos valores quedan como red de seguridad: el sitio nunca se ve vacío.
 *
 * Los textos siguen el manual de marca — "el campo, sin apuro".
 * Nada de superlativos, nada de urgencia, nada de "ambientes de primer nivel".
 */

export const site = {
  nombre: 'San Eusebio',
  bajada: 'Finca y Olivares',
  posicionamiento: 'El campo, sin apuro',
  ubicacion: 'De la Canal, Tandil — Provincia de Buenos Aires',

  // TODO(entrega): reemplazar por los datos reales antes de publicar.
  whatsapp: '5492494000000', // solo dígitos, con código de país
  email: 'hola@saneusebio.com.ar',
  instagram: 'saneusebio.hosteria',

  // Coordenadas aproximadas de De la Canal. Ajustar al punto exacto del casco.
  mapa: { lat: -37.2333, lng: -59.4667 },
} as const;

export type Habitacion = {
  slug: string;
  nombre: string;
  casa: 'principal' | 'frente';
  capacidad: number;
  bano: 'privado' | 'compartido';
  descripcion: string;
  foto: string | null;
};

export const habitaciones: Habitacion[] = [
  {
    slug: 'la-galeria',
    nombre: 'La Galería',
    casa: 'frente',
    capacidad: 2,
    bano: 'privado',
    descripcion:
      'Da a la galería larga, la que se llena de sol a media mañana. Cama matrimonial y una ventana que se deja abierta toda la noche en verano.',
    foto: null,
  },
  {
    slug: 'los-olivos',
    nombre: 'Los Olivos',
    casa: 'frente',
    capacidad: 2,
    bano: 'privado',
    descripcion:
      'Mira al olivar. En marzo se escucha la cosecha desde la cama, que es una forma rara y linda de despertarse.',
    foto: null,
  },
  {
    slug: 'la-huerta',
    nombre: 'La Huerta',
    casa: 'frente',
    capacidad: 3,
    bano: 'compartido',
    descripcion:
      'La más chica y la más luminosa. Entra una cama extra para quien viene con un chico.',
    foto: null,
  },
  {
    slug: 'el-fondo',
    nombre: 'El Fondo',
    casa: 'frente',
    capacidad: 2,
    bano: 'compartido',
    descripcion:
      'Al final del pasillo, lejos de todo ruido. La habitación de los que vienen a dormir de verdad.',
    foto: null,
  },
];

export type Experiencia = {
  slug: string;
  titulo: string;
  bajada: string;
  texto: string;
  href: string | null; // si tiene página propia
  foto: string | null;
};

export const experiencias: Experiencia[] = [
  {
    slug: 'coaching-con-caballos',
    titulo: 'Coaching con caballos',
    bajada: 'Con Huellas',
    texto:
      'Una sesión en el corral, sola o con tu gente. El caballo devuelve en el momento lo que traés, y ahí empieza el trabajo.',
    href: '/coaching-con-caballos',
    foto: null,
  },
  {
    slug: 'cabalgatas',
    titulo: 'Cabalgatas',
    bajada: 'Al paso',
    texto:
      'Salidas por el campo abierto, sin experiencia previa. Se sale temprano o se sale tarde: al mediodía el sol de la llanura no perdona.',
    href: null,
    foto: null,
  },
  {
    slug: 'sobremesa',
    titulo: 'Sobremesa',
    bajada: 'El fogón, la galería',
    texto:
      'Comida casera, la mesa tendida hasta tarde y el fuego encendido. Es el momento por el que la mayoría vuelve.',
    href: null,
    foto: null,
  },
  {
    slug: 'huerta-y-conservas',
    titulo: 'Huerta y conservas',
    bajada: 'Lo que da la temporada',
    texto:
      'Se cosecha lo que hay y se hace lo que se puede hacer con eso. Si caés en época, te llevás un frasco.',
    href: null,
    foto: null,
  },
];

export type Foto = { src: string; alt: string };

/**
 * Galería. Vacía a propósito: se carga desde el backoffice.
 * El componente de galería se oculta solo si no hay fotos.
 */
export const galeria: Foto[] = [];
