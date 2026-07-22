import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Guarda una consulta de disponibilidad.
 *
 * Se escribe con la service role key para que la tabla pueda quedar cerrada
 * a lectura pública: nadie puede listar las consultas de otros desde el
 * navegador. Esa clave vive solo en el servidor.
 */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Sin base configurada todavía: se responde ok igual, así el visitante
  // sigue viaje a WhatsApp sin ver un error.
  if (!url || !clave || url.includes('xxxx')) {
    return NextResponse.json({ guardado: false });
  }

  let cuerpo;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  const { nombre, contacto, entrada, salida, personas, mensaje } = cuerpo ?? {};

  if (!nombre || !entrada || !salida) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const supabase = createClient(url, clave, { auth: { persistSession: false } });

  const { error } = await supabase.from('consultas').insert({
    nombre: String(nombre).slice(0, 120),
    contacto: String(contacto ?? '').slice(0, 160),
    fecha_entrada: entrada,
    fecha_salida: salida,
    personas: Number(personas) || 1,
    mensaje: String(mensaje ?? '').slice(0, 2000),
    estado: 'nueva',
  });

  if (error) {
    return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 });
  }

  return NextResponse.json({ guardado: true });
}
