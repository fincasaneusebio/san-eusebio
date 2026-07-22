import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente de lectura pública.
 *
 * Devuelve null si todavía no están cargadas las variables de entorno,
 * para que el sitio se pueda levantar y verse completo ANTES de que
 * exista la base. Todo lo que consulta Supabase tiene que tolerar el null
 * y caer al contenido de lib/content.ts.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('xxxx')) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Fechas ocupadas, en formato 'YYYY-MM-DD'.
 * Se usan para pintar en gris el calendario de consulta.
 */
export async function getFechasOcupadas(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const hoy = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('disponibilidad')
    .select('fecha')
    .eq('disponible', false)
    .gte('fecha', hoy);

  if (error || !data) return [];
  return data.map((d: { fecha: string }) => d.fecha);
}
