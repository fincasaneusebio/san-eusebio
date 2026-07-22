import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import Habitaciones from '@/components/Habitaciones';
import Experiencias from '@/components/Experiencias';
import Consulta from '@/components/Consulta';
import ComoLlegar from '@/components/ComoLlegar';
import { habitaciones, experiencias } from '@/lib/content';
import { getFechasOcupadas, getSupabase } from '@/lib/supabase';

// Se regenera cada 5 minutos: alcanza para que un cambio en el backoffice
// se vea rápido sin pegarle a la base en cada visita.
export const revalidate = 300;

async function getHero() {
  const supabase = getSupabase();
  if (!supabase) return { videoUrl: null, posterUrl: null };

  const { data } = await supabase
    .from('configuracion')
    .select('hero_video_url, hero_poster_url')
    .eq('id', 1)
    .single();

  return {
    videoUrl: data?.hero_video_url ?? null,
    posterUrl: data?.hero_poster_url ?? null,
  };
}

export default async function Inicio() {
  const [hero, ocupadas] = await Promise.all([getHero(), getFechasOcupadas()]);

  return (
    <>
      <Hero videoUrl={hero.videoUrl} posterUrl={hero.posterUrl} />
      <Intro />
      <Habitaciones habitaciones={habitaciones} />
      <Experiencias experiencias={experiencias} />
      <Consulta ocupadas={ocupadas} />
      <ComoLlegar />
    </>
  );
}
