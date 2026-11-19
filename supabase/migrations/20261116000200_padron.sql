-- 0002 · Padrón: personas, apartamentos, locales y perfiles

create table public.personas (
  cedula text primary key,
  nombre text not null,
  telefono text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.aptos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  piso integer not null check (piso between 0 and 12),
  tipo public.tipo_apto not null,
  balcon boolean not null default false,
  alicuota numeric(10, 8) not null,
  estado public.estado_apto not null default 'ocupado',
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint aptos_alicuota_balcon check (
    (balcon and alicuota = 0.00998545)
    or ((not balcon) and alicuota = 0.00982140)
  ),
  constraint aptos_planta_baja_sin_balcon check (
    tipo <> 'planta_baja' or balcon = false
  )
);

create index aptos_piso_idx on public.aptos (piso);

create table public.apto_personas (
  id uuid primary key default gen_random_uuid(),
  apto_id uuid not null references public.aptos (id) on delete cascade,
  cedula text not null references public.personas (cedula) on delete cascade,
  rol public.rol_contacto not null default 'contacto',
  es_titular boolean not null default false,
  vigente_desde date not null default current_date,
  vigente_hasta date,
  created_at timestamptz not null default now(),
  unique (apto_id, cedula, rol, vigente_desde)
);

create unique index apto_personas_titular_uq
  on public.apto_personas (apto_id)
  where es_titular and vigente_hasta is null;

create index apto_personas_cedula_idx on public.apto_personas (cedula);

create table public.perfiles (
  auth_uid uuid primary key references auth.users (id) on delete cascade,
  cedula text not null,
  rol public.rol not null default 'VECINO',
  apto_id uuid references public.aptos (id) on delete set null,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index perfiles_apto_vecino_uq
  on public.perfiles (apto_id)
  where rol = 'VECINO' and apto_id is not null;

create index perfiles_cedula_idx on public.perfiles (cedula);

create table public.locales (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  cuota_usd numeric(12, 2) not null check (cuota_usd >= 0),
  encargado text,
  telefono text,
  contrato_inicio date,
  contrato_fin date,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
