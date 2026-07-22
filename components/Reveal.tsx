'use client';

import { useEffect } from 'react';

/**
 * Activa la aparición al scroll de todo lo que tenga class="reveal".
 * Un solo observer para toda la página; se monta una vez desde el layout.
 * Si el visitante pidió menos movimiento, muestra todo de una y no observa nada.
 */
export default function Reveal() {
  useEffect(() => {
    const elementos = document.querySelectorAll<HTMLElement>('.reveal, .filete');
    const menosMovimiento = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (menosMovimiento || !('IntersectionObserver' in window)) {
      elementos.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            observer.unobserve(entrada.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
