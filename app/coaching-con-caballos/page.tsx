import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coaching con caballos',
  description:
    'Sesiones de coaching con caballos en San Eusebio, De la Canal, Tandil. Individuales, en familia, con amigos o de empresa.',
};

/**
 * PENDIENTE — página completa en la próxima entrega.
 * Contenido ya definido con la clienta: el trabajo es en el corral, se lee al
 * caballo, se trabaja solo el aquí y ahora, y los grupos vienen con un tema
 * en común. Equipo: Huellas (Flor y Mechi).
 */
export default function CoachingConCaballos() {
  return (
    <section className="seccion" style={{ paddingTop: '9rem' }}>
      <div className="contenedor">
        <p className="eyebrow">Con Huellas</p>
        <h2>Coaching con caballos</h2>
        <div className="filete filete--corto" />
        <p className="subtitulo texto">
          Esta página está en preparación.
        </p>
      </div>
    </section>
  );
}
