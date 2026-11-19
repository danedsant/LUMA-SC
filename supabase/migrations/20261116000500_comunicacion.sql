-- 0005 · Comunicación, incidencias, notas y auditoría

create table public.anuncios (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  cuerpo text not null,
  adjunto_path text,
  publicado_por uuid references public.perfiles (auth_uid) on delete set null,
  fecha_publicacion timestamptz,
  estado public.estado_anuncio not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index anuncios_publicados_idx
  on public.anuncios (fecha_publicacion desc)
  where estado = 'publicado';

create table public.incidencias (
  id uuid primary key default gen_random_uuid(),
  apto_id uuid references public.aptos (id) on delete set null,
  reportante_id uuid references public.perfiles (auth_uid) on delete set null,
  es_anonimo boolean not null default false,
  categoria text,
  ubicacion text,
  descripcion text not null,
  foto_path text,
  estado public.estado_incidencia not null default 'pendiente',
  asignado_a text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index incidencias_estado_idx on public.incidencias (estado);
create index incidencias_apto_idx on public.incidencias (apto_id);

create table public.incidencia_eventos (
  id uuid primary key default gen_random_uuid(),
  incidencia_id uuid not null references public.incidencias (id) on delete cascade,
  estado public.estado_incidencia,
  observacion text,
  autor_id uuid references public.perfiles (auth_uid) on delete set null,
  created_at timestamptz not null default now()
);

create index incidencia_eventos_incidencia_idx
  on public.incidencia_eventos (incidencia_id);

create table public.notas_apto (
  id uuid primary key default gen_random_uuid(),
  apto_id uuid not null references public.aptos (id) on delete cascade,
  periodo_id uuid references public.periodos (id) on delete set null,
  autor_id uuid references public.perfiles (auth_uid) on delete set null,
  nota text not null,
  visible_vecino boolean not null default false,
  created_at timestamptz not null default now()
);

create index notas_apto_apto_idx on public.notas_apto (apto_id);

create table public.auditoria (
  id bigint generated always as identity primary key,
  tabla text not null,
  registro_id text,
  accion text not null,
  datos_antes jsonb,
  datos_despues jsonb,
  autor_id uuid,
  created_at timestamptz not null default now()
);

create index auditoria_tabla_idx on public.auditoria (tabla, created_at desc);
