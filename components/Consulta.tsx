'use client';

import { useMemo, useState } from 'react';
import { site } from '@/lib/content';
import estilos from './Consulta.module.css';

/* ------------------------------------------------------------ utilidades - */

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** Fecha a 'YYYY-MM-DD' usando la hora local, no UTC (si no, se corre un día). */
function aClave(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

function enCastellano(clave: string): string {
  const [anio, mes, dia] = clave.split('-').map(Number);
  return `${dia} de ${MESES[mes - 1]} de ${anio}`;
}

function sumarDias(clave: string, dias: number): string {
  const [anio, mes, dia] = clave.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia + dias);
  return aClave(fecha);
}

/** Todas las noches entre entrada y salida, sin incluir la de salida. */
function nochesEntre(entrada: string, salida: string): string[] {
  const noches: string[] = [];
  let actual = entrada;
  while (actual < salida) {
    noches.push(actual);
    actual = sumarDias(actual, 1);
  }
  return noches;
}

/* ----------------------------------------------------------- componente - */

type Estado = 'inicial' | 'enviando' | 'listo' | 'error';

export default function Consulta({ ocupadas }: { ocupadas: string[] }) {
  const setOcupadas = useMemo(() => new Set(ocupadas), [ocupadas]);

  const hoy = useMemo(() => aClave(new Date()), []);
  const [mesVisible, setMesVisible] = useState(() => {
    const ahora = new Date();
    return { anio: ahora.getFullYear(), mes: ahora.getMonth() };
  });

  const [entrada, setEntrada] = useState<string | null>(null);
  const [salida, setSalida] = useState<string | null>(null);
  const [personas, setPersonas] = useState(2);
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState<Estado>('inicial');

  /* --------------------------------------------------------- calendario - */

  function armarMes(anio: number, mes: number) {
    const primero = new Date(anio, mes, 1);
    const diasEnElMes = new Date(anio, mes + 1, 0).getDate();
    // getDay() da 0 para domingo; acá la semana arranca el lunes.
    const corrimiento = (primero.getDay() + 6) % 7;

    const celdas: (string | null)[] = Array(corrimiento).fill(null);
    for (let d = 1; d <= diasEnElMes; d++) {
      celdas.push(aClave(new Date(anio, mes, d)));
    }
    return celdas;
  }

  function moverMes(pasos: number) {
    setMesVisible(({ anio, mes }) => {
      const nueva = new Date(anio, mes + pasos, 1);
      return { anio: nueva.getFullYear(), mes: nueva.getMonth() };
    });
  }

  function alElegirDia(clave: string) {
    // Primer clic, o reinicio después de tener el rango completo.
    if (!entrada || (entrada && salida)) {
      setEntrada(clave);
      setSalida(null);
      return;
    }

    // Segundo clic hacia atrás: se toma como nueva entrada.
    if (clave <= entrada) {
      setEntrada(clave);
      return;
    }

    // No se puede reservar un rango que pise una noche ocupada.
    const pisaOcupada = nochesEntre(entrada, clave).some((n) => setOcupadas.has(n));
    if (pisaOcupada) {
      setEntrada(clave);
      setSalida(null);
      return;
    }

    setSalida(clave);
  }

  function claseDelDia(clave: string): string {
    const clases = [estilos.dia];

    if (clave < hoy) clases.push(estilos.pasado);
    else if (setOcupadas.has(clave)) clases.push(estilos.ocupado);

    if (clave === entrada) clases.push(estilos.extremo);
    if (clave === salida) clases.push(estilos.extremo);
    if (entrada && salida && clave > entrada && clave < salida) {
      clases.push(estilos.enRango);
    }

    return clases.join(' ');
  }

  const noches = entrada && salida ? nochesEntre(entrada, salida).length : 0;
  const puedeEnviar =
    entrada !== null && salida !== null && nombre.trim().length > 1;

  /* ------------------------------------------------------------- envío - */

  function textoParaWhatsapp(): string {
    const lineas = [
      `Hola, soy ${nombre.trim()}.`,
      `Quería consultar por una estadía en San Eusebio.`,
      ``,
      `Entrada: ${enCastellano(entrada!)}`,
      `Salida: ${enCastellano(salida!)}`,
      `${noches} ${noches === 1 ? 'noche' : 'noches'} · ${personas} ${
        personas === 1 ? 'persona' : 'personas'
      }`,
    ];
    if (mensaje.trim()) lineas.push('', mensaje.trim());
    return lineas.join('\n');
  }

  async function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!puedeEnviar || estado === 'enviando') return;

    setEstado('enviando');

    // La consulta queda guardada para que se pueda ver en el backoffice,
    // aunque después la conversación siga por WhatsApp.
    try {
      await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          contacto: contacto.trim(),
          entrada,
          salida,
          personas,
          mensaje: mensaje.trim(),
        }),
      });
    } catch {
      // Si falla el guardado, no se bloquea a la persona: igual va a WhatsApp.
    }

    const url = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
      textoParaWhatsapp()
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setEstado('listo');
  }

  const celdas = armarMes(mesVisible.anio, mesVisible.mes);
  const enElMesActual =
    mesVisible.anio === new Date().getFullYear() &&
    mesVisible.mes === new Date().getMonth();

  return (
    <section className="seccion" id="consultar">
      <div className="contenedor">
        <header className={`${estilos.encabezado} reveal`}>
          <p className="eyebrow">Cuando quieras venir</p>
          <h2>Consultar fechas</h2>
          <div className="filete filete--corto" />
          <p className="subtitulo texto">
            Elegí los días y contanos quién sos. La consulta sigue por WhatsApp,
            con una persona del otro lado — no hay pago automático ni reserva
            instantánea.
          </p>
        </header>

        <div className={`${estilos.panel} reveal`}>
          {/* ------------------------------------------------- calendario - */}
          <div className={estilos.calendario}>
            <div className={estilos.controlMes}>
              <button
                type="button"
                onClick={() => moverMes(-1)}
                disabled={enElMesActual}
                aria-label="Mes anterior"
              >
                ←
              </button>
              <p aria-live="polite">
                {MESES[mesVisible.mes]} {mesVisible.anio}
              </p>
              <button
                type="button"
                onClick={() => moverMes(1)}
                aria-label="Mes siguiente"
              >
                →
              </button>
            </div>

            <div className={estilos.semana} aria-hidden="true">
              {DIAS.map((dia, i) => (
                <span key={i}>{dia}</span>
              ))}
            </div>

            <div className={estilos.grillaDias}>
              {celdas.map((clave, i) =>
                clave === null ? (
                  <span key={`vacio-${i}`} />
                ) : (
                  <button
                    key={clave}
                    type="button"
                    className={claseDelDia(clave)}
                    disabled={clave < hoy || setOcupadas.has(clave)}
                    onClick={() => alElegirDia(clave)}
                    aria-label={enCastellano(clave)}
                    aria-pressed={clave === entrada || clave === salida}
                  >
                    {Number(clave.slice(-2))}
                  </button>
                )
              )}
            </div>

            <p className={estilos.referencia}>
              <span className={estilos.muestraOcupado} aria-hidden="true" />
              Sin disponibilidad
            </p>
          </div>

          {/* -------------------------------------------------- formulario - */}
          <form className={estilos.formulario} onSubmit={alEnviar}>
            <div className={estilos.resumen} aria-live="polite">
              {entrada && salida ? (
                <>
                  <p className={estilos.resumenFechas}>
                    {enCastellano(entrada)} — {enCastellano(salida)}
                  </p>
                  <p className={estilos.resumenNoches}>
                    {noches} {noches === 1 ? 'noche' : 'noches'}
                  </p>
                </>
              ) : (
                <p className={estilos.resumenVacio}>
                  {entrada
                    ? 'Ahora elegí el día de salida.'
                    : 'Elegí el día de entrada en el calendario.'}
                </p>
              )}
            </div>

            <label className={estilos.campo}>
              <span>Nombre</span>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                autoComplete="name"
              />
            </label>

            <div className={estilos.fila}>
              <label className={estilos.campo}>
                <span>Personas</span>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={personas}
                  onChange={(e) => setPersonas(Number(e.target.value))}
                />
              </label>

              <label className={estilos.campo}>
                <span>Teléfono o mail</span>
                <input
                  type="text"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  autoComplete="tel"
                />
              </label>
            </div>

            <label className={estilos.campo}>
              <span>Algo que quieras contarnos</span>
              <textarea
                rows={3}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Si viajan con chicos, si hay alguna dieta especial, si festejan algo."
              />
            </label>

            <button
              type="submit"
              className="boton boton--bloque"
              disabled={!puedeEnviar || estado === 'enviando'}
            >
              {estado === 'enviando' ? 'Abriendo WhatsApp…' : 'Consultar por WhatsApp'}
            </button>

            {estado === 'listo' && (
              <p className={estilos.aviso} role="status">
                Listo. Si WhatsApp no se abrió solo, revisá si el navegador
                bloqueó la ventana.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
