import estilos from './Intro.module.css';

export default function Intro() {
  return (
    <section className="seccion" id="la-finca">
      <div className={`contenedor ${estilos.grilla}`}>
        <div className={`${estilos.texto} reveal`}>
          <p className="eyebrow">De la Canal, Tandil</p>
          <h2>Un campo que sigue funcionando</h2>
          <div className="filete filete--corto" />
          <div className="texto">
            <p>
              San Eusebio no es un hotel con paisaje alrededor. Es una finca en
              actividad: hay olivos que se cosechan, una huerta que da lo que da
              según el mes, caballos que trabajan y una casa que se abrió para
              recibir gente.
            </p>
            <p>
              El casco tiene dos casas. En una vive la familia; la otra es la que
              se ofrece, con seis habitaciones, cocina casera y una galería larga
              donde termina cayendo todo el mundo a la tarde.
            </p>
            <p>
              Estamos a media hora de Tandil por camino de tierra. Esa media hora
              es parte de la propuesta: cuando llegás, ya bajaste un cambio.
            </p>
          </div>
        </div>

        <figure className={`${estilos.imagen} reveal`} data-delay="1">
          <span className={estilos.sinFoto} aria-hidden="true" />
          <figcaption className={estilos.pie}>
            {/* TODO(contenido): reemplazar por una foto de detalle —
                manos, vapor del mate, textura de la leña. Nunca la postal
                del casco entero (Manual de Marca, Identidad Visual). */}
            El olivar, en marzo.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
