import { site } from '@/lib/content';
import Logo from './Logo';
import estilos from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={estilos.footer}>
      <div className={`contenedor ${estilos.grilla}`}>
        <div>
          <Logo className={estilos.logo} />
          <p className={estilos.lema}>El campo, sin apuro.</p>
        </div>

        <div className={estilos.datos}>
          <p className={estilos.titulo}>Dónde</p>
          <p>{site.ubicacion}</p>
        </div>

        <div className={estilos.datos}>
          <p className={estilos.titulo}>Contacto</p>
          <p>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p>
            <a
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{site.instagram}
            </a>
          </p>
        </div>
      </div>

      <p className={estilos.credito}>
        © {new Date().getFullYear()} {site.nombre}. Todos los derechos reservados.
      </p>
    </footer>
  );
}
