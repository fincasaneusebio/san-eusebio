import type { Habitacion } from '@/lib/content';
import estilos from './Habitaciones.module.css';

export default function Habitaciones({
  habitaciones,
}: {
  habitaciones: Habitacion[];
}) {
  if (habitaciones.length === 0) return null;

  return (
    <section className="seccion" id="habitaciones">
      <div className="contenedor">
        <header className={`${estilos.encabezado} reveal`}>
          <p className="eyebrow">La casa de en frente</p>
          <h2>Seis habitaciones</h2>
          <div className="filete filete--corto" />
          <p className="subtitulo texto">
            La casa se puede tomar entera o por habitación suelta. Cada una tiene
            su carácter, y ninguna da a la calle: todas miran al campo.
          </p>
        </header>

        <ul className={estilos.grilla}>
          {habitaciones.map((habitacion, i) => (
            <li
              key={habitacion.slug}
              className={`${estilos.item} reveal`}
              data-delay={(i % 3) + 1}
            >
              <div className={estilos.foto}>
                {habitacion.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={habitacion.foto} alt={`Habitación ${habitacion.nombre}`} />
                ) : (
                  <span className={estilos.sinFoto} aria-hidden="true" />
                )}
              </div>

              <h3 className={estilos.nombre}>{habitacion.nombre}</h3>

              <p className={estilos.datos}>
                {habitacion.capacidad === 1
                  ? '1 persona'
                  : `Hasta ${habitacion.capacidad} personas`}
                <span aria-hidden="true"> · </span>
                Baño {habitacion.bano}
              </p>

              <p className={estilos.descripcion}>{habitacion.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
