'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';
import estilos from './Hero.module.css';

/**
 * Banner de entrada, a pantalla completa.
 *
 * El video se carga solo en pantallas grandes, con conexión que no pidió
 * ahorro de datos y sin preferencia de menos movimiento. En el resto de los
 * casos queda la imagen fija, que es lo mismo que se ve mientras el video
 * está cargando. Esto es importante: mucha visita entra desde el celular
 * en zona rural, y un video pesado ahí arruina la primera impresión.
 *
 * Los archivos se cargan desde el backoffice y se sirven por CDN.
 * Recomendación técnica: mp4 (H.264) de 6 MB como máximo, sin audio,
 * 1920×1080, 8 a 12 segundos en loop.
 */
export default function Hero({
  videoUrl,
  posterUrl,
}: {
  videoUrl?: string | null;
  posterUrl?: string | null;
}) {
  const [cargarVideo, setCargarVideo] = useState(false);

  useEffect(() => {
    const pantallaGrande = window.matchMedia('(min-width: 48rem)').matches;
    const menosMovimiento = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    const ahorroDeDatos = conexion?.saveData === true;

    setCargarVideo(pantallaGrande && !menosMovimiento && !ahorroDeDatos);
  }, []);

  return (
    <section className={estilos.hero}>
      <div className={estilos.fondo}>
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={posterUrl} alt="" className={estilos.poster} />
        ) : (
          <div className={estilos.posterVacio} aria-hidden="true" />
        )}

        {cargarVideo && videoUrl && (
          <video
            className={estilos.video}
            src={videoUrl}
            poster={posterUrl ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        )}

        <div className={estilos.velo} aria-hidden="true" />
      </div>

      <div className={estilos.contenido}>
        <Logo className={estilos.logo} color="var(--lino)" />
        <p className={estilos.lema}>El campo, sin apuro.</p>
        <p className={estilos.lugar}>De la Canal · Tandil</p>
      </div>

      <a href="#la-finca" className={estilos.bajar}>
        <span className="solo-lectores">Seguir leyendo</span>
        <span className={estilos.linea} aria-hidden="true" />
      </a>
    </section>
  );
}
