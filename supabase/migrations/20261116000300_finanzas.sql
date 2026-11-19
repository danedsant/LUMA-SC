-- 0003 · Periodos, recibos, gas, locales y cuotas especiales

create table public.periodos (
  id uuid primary key default gen_random_uuid(),
  anio integer not null check (anio between 2000 and 2100),
  mes integer not null check (mes between 1 and 12),
  fecha_emision date,
  fecha_limite date,
  egresos_usd_recibo numeric(12, 2),
  egresos_bs_banco numeric(14, 2),
  tasa_promedio numeric(12, 4),
  estado public.estado_periodo not null default 'abierto',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (anio, mes)
);

create table public.recibos_condominio (
  id uuid primary key default gen_random_uuid(),
  apto_id uuid not null references public.aptos (id) on delete cascade,
  periodo_id uuid not null references public.periodos (id) on delete cascade,
  saldo_anterior_usd numeric(12, 2) not null default 0,
  cuota_usd numeric(12, 2) not null default 0,
  monto_ajustado_usd numeric(12, 2),
  motivo_ajuste text,
  pagos_usd numeric(12, 2) not null default 0,
  saldo_actual_usd numeric(12, 2) not null default 0,
  provisional boolean not null default true,
  nota_origen text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (apto_id, periodo_id)
);

create index recibos_periodo_idx on public.recibos_condominio (periodo_id);

create table public.periodos_gas (
  id uuid primary key default gen_random_uuid(),
  periodo_id uuid not null unique references public.periodos (id) on delete cascade,
  modalidad public.modalidad_gas not null default 'fija_usd',
  tarifa_litro_usd numeric(12, 4),
  litros numeric(12, 2),
  flete_bs numeric(14, 2),
  total_factura_bs numeric(14, 2),
  cuota_usd numeric(12, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cuotas_gas (
  id uuid primary key default gen_random_uuid(),
  apto_id uuid not null references public.aptos (id) on delete cascade,
  periodo_gas_id uuid not null references public.periodos_gas (id) on delete cascade,
  monto_usd numeric(12, 2) not null default 0,
  monto_bs numeric(14, 2) not null default 0,
  pagado_usd numeric(12, 2) not null default 0,
  clasificacion text check (
    clasificacion in ('banco', 'efectivo', 'cuenta_por_cobrar', 'pendiente')
  ),
  estado public.estado_cuota not null default 'pendiente',
  observacion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (apto_id, periodo_gas_id)
);

create index cuotas_gas_periodo_idx on public.cuotas_gas (periodo_gas_id);

create table public.cuotas_locales (
  id uuid primary key default gen_random_uuid(),
  local_id uuid not null references public.locales (id) on delete cascade,
  periodo_id uuid not null references public.periodos (id) on delete cascade,
  monto_usd numeric(12, 2) not null default 0,
  monto_bs numeric(14, 2) not null default 0,
  pagado_usd numeric(12, 2) not null default 0,
  estado public.estado_cuota not null default 'pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (local_id, periodo_id)
);

create table public.cuotas_especiales (
  id uuid primary key default gen_random_uuid(),
  apto_id uuid not null references public.aptos (id) on delete cascade,
  periodo_id uuid not null references public.periodos (id) on delete cascade,
  concepto text not null,
  monto_usd numeric(12, 2) not null check (monto_usd >= 0),
  aprobado_por text,
  motivo text,
  estado public.estado_cuota not null default 'pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (apto_id, periodo_id, concepto)
);
