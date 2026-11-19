-- 0004 · Pagos, aplicaciones, banco, egresos y otros ingresos

create table public.pagos (
  id uuid primary key default gen_random_uuid(),
  apto_id uuid references public.aptos (id) on delete set null,
  local_id uuid references public.locales (id) on delete set null,
  periodo_id uuid references public.periodos (id) on delete set null,
  concepto public.concepto_pago not null,
  monto_bs numeric(14, 2) not null check (monto_bs >= 0),
  tasa_bcv numeric(12, 4) not null check (tasa_bcv > 0),
  monto_usd numeric(12, 2) generated always as (
    round(monto_bs / tasa_bcv, 2)
  ) stored,
  fecha_pago date not null,
  metodo public.metodo_pago not null default 'transferencia',
  referencia text,
  clasificacion text check (
    clasificacion in ('banco', 'efectivo', 'cruce', 'extemporaneo', 'cuenta_por_cobrar', 'pendiente')
  ),
  comprobante_path text,
  estado public.estado_pago not null default 'pendiente',
  anula_pago_id uuid references public.pagos (id) on delete set null,
  idempotency_key text not null unique,
  detalles jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pagos_con_destino check (apto_id is not null or local_id is not null)
);

create index pagos_apto_idx on public.pagos (apto_id);
create index pagos_periodo_idx on public.pagos (periodo_id);
create index pagos_fecha_idx on public.pagos (fecha_pago);
create index pagos_referencia_idx on public.pagos (referencia);

create table public.pago_aplicaciones (
  id uuid primary key default gen_random_uuid(),
  pago_id uuid not null references public.pagos (id) on delete cascade,
  recibo_condominio_id uuid references public.recibos_condominio (id) on delete cascade,
  cuota_gas_id uuid references public.cuotas_gas (id) on delete cascade,
  cuota_local_id uuid references public.cuotas_locales (id) on delete cascade,
  cuota_especial_id uuid references public.cuotas_especiales (id) on delete cascade,
  monto_usd numeric(12, 2) not null check (monto_usd > 0),
  created_at timestamptz not null default now(),
  constraint pago_aplicaciones_un_destino check (
    (recibo_condominio_id is not null)::int
    + (cuota_gas_id is not null)::int
    + (cuota_local_id is not null)::int
    + (cuota_especial_id is not null)::int
    = 1
  )
);

create index pago_aplicaciones_pago_idx on public.pago_aplicaciones (pago_id);
create index pago_aplicaciones_recibo_idx on public.pago_aplicaciones (recibo_condominio_id);

create table public.movimientos_banco (
  id uuid primary key default gen_random_uuid(),
  cuenta public.cuenta not null,
  fecha date not null,
  descripcion text,
  referencia text,
  monto_bs numeric(14, 2) not null,
  tasa numeric(12, 4),
  monto_usd numeric(12, 2),
  conciliado boolean not null default false,
  pago_id uuid references public.pagos (id) on delete set null,
  origen text not null default 'estado_cuenta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index movimientos_banco_uq
  on public.movimientos_banco (cuenta, fecha, referencia, monto_bs)
  where referencia is not null;

create table public.egresos (
  id uuid primary key default gen_random_uuid(),
  periodo_id uuid not null references public.periodos (id) on delete cascade,
  cuenta_origen public.cuenta not null,
  fecha date not null,
  descripcion text not null,
  factura text,
  monto_bs numeric(14, 2) not null check (monto_bs >= 0),
  tasa numeric(12, 4),
  monto_usd numeric(12, 2),
  tipo text not null default 'variable' check (tipo in ('fijo', 'variable', 'nomina', 'otro')),
  imputado_a public.imputacion_egreso not null default 'recibo_condominio',
  proveedor text,
  observacion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (periodo_id, factura, descripcion, monto_bs)
);

create index egresos_periodo_idx on public.egresos (periodo_id);

create table public.otros_ingresos (
  id uuid primary key default gen_random_uuid(),
  periodo_id uuid not null references public.periodos (id) on delete cascade,
  cuenta public.cuenta not null,
  concepto text not null,
  monto_bs numeric(14, 2) not null check (monto_bs >= 0),
  tasa numeric(12, 4),
  monto_usd numeric(12, 2),
  fecha date not null,
  referencia text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
