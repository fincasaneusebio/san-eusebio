import type { Metadata, Viewport } from 'next';
import { Fraunces, Lora } from 'next/font/google';
import { site } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BotonWhatsapp from '@/components/BotonWhatsapp';
import Reveal from '@/components/Reveal';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  // TODO(entrega): cambiar por el dominio real cuando esté comprado.
  metadataBase: new URL('https://saneusebio.com.ar'),
  title: {
    default: `${site.nombre} · ${site.bajada} — ${site.posicionamiento}`,
    template: `%s · ${site.nombre}`,
  },
  description:
    'Hostería de campo en De la Canal, Tandil. Seis habitaciones, comida casera, olivar y caballos. Un lugar donde el tiempo se mide por sobremesas.',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: site.nombre,
    title: `${site.nombre} — ${site.posicionamiento}`,
    description:
      'Hostería de campo en De la Canal, Tandil. Un lugar donde el tiempo se mide por sobremesas.',
  },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#F4EDDE',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${fraunces.variable} ${lora.variable}`}>
      <body>
        <a href="#contenido" className="solo-lectores">
          Ir al contenido
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <BotonWhatsapp />
        <Reveal />
      </body>
    </html>
  );
}
