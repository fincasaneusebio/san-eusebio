import Link from 'next/link';
import type { Experiencia } from '@/lib/content';
import estilos from './Experiencias.module.css';

export default function Experiencias({
  experiencias,
}: {
  experiencias: Experiencia[];
}) {
  if (experiencias.length === 0) return null;

  return (
    <section className="seccion seccion--verde" id="experiencias">
      <div className="contenedor">
        <header className={`${estilos.encabezado} reveal`}>
          <p className="eyebrow">Los días acá</p>
          <h2>Qué se puede hacer</h2>
          <div className="filete filete--corto" />
          <p className="subtitulo texto">
            Nada es obligatorio. Se puede pasar el día entero leyendo bajo los
            eucaliptos y eso también cuenta como plan.
          </p>
        </header>

        <ul className={estilos.lista}>
          {experiencias.map((experiencia, i) => {
            const contenido = (
              <>
                <p className={estilos.bajada}>{experiencia.bajada}</p>
                <h3 className={estilos.titulo}>{experiencia.titulo}</h3>
                <p className={estilos.texto}>{experiencia.texto}</p>
                {experiencia.href && (
                  <span className={estilos.masInfo} aria-hidden="true">
                    Conocer más →
                  </span>
                )}
              </>
            );

            return (
              <li
                key={experiencia.slug}
                className={`${estilos.item} reveal`}
                data-delay={(i % 3) + 1}
              >
                {experiencia.href ? (
                  <Link href={experiencia.href} className={estilos.enlace}>
                    {contenido}
                  </Link>
                ) : (
                  <div className={estilos.enlace}>{contenido}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
