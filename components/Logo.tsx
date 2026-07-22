/**
 * Logotipo de San Eusebio.
 *
 * PROVISORIO — dibujo simplificado del casco + wordmark tipografiado.
 * Cuando llegue el SVG original del estudio, se reemplaza el contenido de
 * este archivo por ese SVG (manteniendo el prop `color` y el `aria-label`).
 * Es el único lugar del proyecto donde vive el logo: no copiar en otro lado.
 */
export default function Logo({
  color = 'currentColor',
  conCasco = true,
  className,
}: {
  color?: string;
  conCasco?: boolean;
  className?: string;
}) {
  return (
    <span className={className} style={{ color, display: 'inline-block' }}>
      {conCasco && (
        <svg
          viewBox="0 0 200 62"
          aria-hidden="true"
          fill="none"
          stroke={color}
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: '100%', height: 'auto', marginBottom: '0.4em' }}
        >
          {/* arboleda */}
          <path d="M62 30c-5-3-4-11 2-12 1-6 9-7 12-2 6-1 9 5 6 9 3 3 1 8-4 8" />
          <path d="M70 33v-9M70 27l-4-3M70 29l4-3" />
          <path d="M130 30c-5-3-4-11 2-12 1-6 9-7 12-2 6-1 9 5 6 9 3 3 1 8-4 8" />
          <path d="M138 33v-9M138 27l-4-3M138 29l4-3" />
          {/* casco: cuerpo central y dos alas */}
          <path d="M40 52V27h44v25M116 52V27h44v25" />
          <path d="M84 52V31h32v21" />
          {/* pretil almenado */}
          <path d="M40 27h6v-4h5v4h6M154 27h-6v-4h-5v4h-6M92 31h4v-4h4v4h4" />
          {/* puerta y ventanas */}
          <rect x="94" y="38" width="12" height="14" />
          <path d="M100 38v14" />
          <rect x="52" y="36" width="9" height="10" />
          <rect x="70" y="36" width="9" height="10" />
          <rect x="139" y="36" width="9" height="10" />
          {/* base y arbustos */}
          <path d="M28 52h144" />
          <path d="M112 52c1-5 6-7 9-4 3-3 7 0 6 4" />
          <path d="M36 52c1-4 3-5 4-2M46 52c-1-4-3-5-4-2" />
        </svg>
      )}
      <span
        style={{
          display: 'block',
          fontFamily: 'var(--display)',
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          textIndent: '0.2em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        San Eusebio
      </span>
      <span className="solo-lectores">San Eusebio, finca y olivares</span>
    </span>
  );
}
