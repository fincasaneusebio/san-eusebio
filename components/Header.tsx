'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import estilos from './Header.module.css';

const enlaces = [
  { href: '/#la-finca', texto: 'La finca' },
  { href: '/#habitaciones', texto: 'Habitaciones' },
  { href: '/#experiencias', texto: 'Experiencias' },
  { href: '/coaching-con-caballos', texto: 'Coaching con caballos' },
  { href: '/#como-llegar', texto: 'Cómo llegar' },
];

export default function Header() {
  const [scrolleado, setScrolleado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const alScrollear = () => setScrolleado(window.scrollY > 60);
    alScrollear();
    window.addEventListener('scroll', alScrollear, { passive: true });
    return () => window.removeEventListener('scroll', alScrollear);
  }, []);

  // Con el menú abierto no se scrollea el fondo.
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuAbierto]);

  // Escape cierra el menú.
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAbierto(false);
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, []);

  return (
    <header
      className={`${estilos.header} ${scrolleado ? estilos.solido : ''} ${
        menuAbierto ? estilos.conMenu : ''
      }`}
    >
      <Link href="/" className={estilos.logo} aria-label="San Eusebio, inicio">
        <Logo conCasco={false} />
      </Link>

      <nav className={estilos.navEscritorio} aria-label="Principal">
        {enlaces.map((enlace) => (
          <Link key={enlace.href} href={enlace.href} className={estilos.enlace}>
            {enlace.texto}
          </Link>
        ))}
        <Link href="/#consultar" className={estilos.cta}>
          Consultar fechas
        </Link>
      </nav>

      <button
        className={estilos.hamburguesa}
        onClick={() => setMenuAbierto((v) => !v)}
        aria-expanded={menuAbierto}
        aria-controls="menu-movil"
      >
        <span className="solo-lectores">
          {menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
        </span>
        <span className={estilos.raya} aria-hidden="true" />
        <span className={estilos.raya} aria-hidden="true" />
      </button>

      <div
        id="menu-movil"
        className={`${estilos.menuMovil} ${menuAbierto ? estilos.abierto : ''}`}
        hidden={!menuAbierto}
      >
        <nav aria-label="Principal, versión móvil">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              onClick={() => setMenuAbierto(false)}
            >
              {enlace.texto}
            </Link>
          ))}
          <Link
            href="/#consultar"
            className={estilos.ctaMovil}
            onClick={() => setMenuAbierto(false)}
          >
            Consultar fechas
          </Link>
        </nav>
      </div>
    </header>
  );
}
