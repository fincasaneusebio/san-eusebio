-- =============================================================================
-- San Eusebio — esquema de base de datos
-- Se corre una sola vez, desde Supabase > SQL Editor > New query.
-- =============================================================================

-- Configuración general del sitio. Una sola fila, siempre id = 1.
create table if not exists configuracion (
  id               int primary key default 1,
  hero_video_url   text,
  hero_poster_url  text,
  actualizado_en   timestamptz default now(),
  constraint una_sola_fila check (id = 1)
);

insert into configuracion (id) values (1) on conflict do nothing;

-- Disponibilidad por noche. Solo se cargan las fechas OCUPADAS:
-- lo que no está en la tabla se considera libre.
create table if not exists disponibilidad (
  fecha       date primary key,
  disponible  boolean not null default false,
  precio      numeric(10, 2),
  nota        text
);

-- Consultas recibidas desde el formulario de la landing.
create table if not exists consultas (
  id             uuid primary key default gen_random_uuid(),
  creada_en      timestamptz not null default now(),
  nombre         text not null,
  contacto       text,
  fecha_entrada  date not null,
  fecha_salida   date not null,
  personas       int not null default 1,
  mensaje        text,
  estado         text not null default 'nueva'
                 check (estado in ('nueva', 'respondida', 'reservada', 'descartada'))
);

create index if not exists consultas_creada_en_idx on consultas (creada_en desc);

-- =============================================================================
-- Seguridad a nivel de fila (RLS)
--
-- Regla general: el sitio público LEE configuración y disponibilidad, y no
-- puede leer NADA de consultas. Las consultas se escriben desde el servidor
-- con la service role key, que saltea RLS.
-- =============================================================================

alter table configuracion   enable row level security;
alter table disponibilidad  enable row level security;
alter table consultas       enable row level security;

create policy "lectura publica de configuracion"
  on configuracion for select to anon, authenticated using (true);

create policy "lectura publica de disponibilidad"
  on disponibilidad for select to anon, authenticated using (true);

-- Consultas: solo usuarios logueados (el backoffice) pueden verlas.
create policy "el backoffice ve las consultas"
  on consultas for select to authenticated using (true);

create policy "el backoffice actualiza las consultas"
  on consultas for update to authenticated using (true);

-- Escritura de contenido: solo usuarios logueados.
create policy "el backoffice edita la configuracion"
  on configuracion for update to authenticated using (true);

create policy "el backoffice edita la disponibilidad"
  on disponibilidad for all to authenticated using (true) with check (true);
