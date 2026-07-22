import { site } from '@/lib/content';
import estilos from './ComoLlegar.module.css';

export default function ComoLlegar() {
  const consulta = encodeURIComponent(`${site.nombre}, ${site.ubicacion}`);

  return (
    <section className="seccion" id="como-llegar">
      <div className={`contenedor ${estilos.grilla}`}>
        <div className="reveal">
          <p className="eyebrow">El camino</p>
          <h2>Cómo llegar</h2>
          <div className="filete filete--corto" />
          <div className="texto">
            <p>
              Estamos en De la Canal, a unos 30 km de Tandil. Los últimos
              kilómetros son de tierra: se hacen bien en auto común, salvo
              después de una lluvia fuerte. Si llovió mucho, escribinos antes de
              salir y te contamos cómo está el camino.
            </p>
            <p className={estilos.dato}>
              <strong>Desde Buenos Aires:</strong> unas 4 horas y media por Ruta 3
              y Ruta 226.
            </p>
          </div>

          <a
            className="boton"
            href={`https://www.google.com/maps/search/?api=1&query=${consulta}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir en Google Maps
          </a>
        </div>

        <div className={`${estilos.mapa} reveal`} data-delay="1">
          <iframe
            title="Ubicación de San Eusebio en el mapa"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              site.mapa.lng - 0.06
            }%2C${site.mapa.lat - 0.04}%2C${site.mapa.lng + 0.06}%2C${
              site.mapa.lat + 0.04
            }&layer=mapnik&marker=${site.mapa.lat}%2C${site.mapa.lng}`}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
