-- 0007 · Seguridad: funciones de contexto, RLS y permisos

create or replace function public.current_rol()
returns public.rol
language sql
stable
security definer
set search_path = public
as $$
  select rol
  from public.perfiles
  where auth_uid = auth.uid() and activo
  limit 1;
$$;

create or replace function public.current_apto_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select apto_id
  from public.perfiles
  where auth_uid = auth.uid() and activo
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_rol() = 'ADMIN', false);
$$;

create or replace function public.is_contador()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_rol() = 'CONTADOR', false);
$$;

alter table public.personas enable row level security;
alter table public.aptos enable row level security;
alter table public.apto_personas enable row level security;
alter table public.perfiles enable row level security;
alter table public.locales enable row level security;
alter table public.periodos enable row level security;
alter table public.recibos_condominio enable row level security;
alter table public.periodos_gas enable row level security;
alter table public.cuotas_gas enable row level security;
alter table public.cuotas_locales enable row level security;
alter table public.cuotas_especiales enable row level security;
alter table public.pagos enable row level security;
alter table public.pago_aplicaciones enable row level security;
alter table public.movimientos_banco enable row level security;
alter table public.egresos enable row level security;
alter table public.otros_ingresos enable row level security;
alter table public.anuncios enable row level security;
alter table public.incidencias enable row level security;
alter table public.incidencia_eventos enable row level security;
alter table public.notas_apto enable row level security;
alter table public.auditoria enable row level security;

-- Padrón
create policy personas_admin_all on public.personas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy personas_contador_select on public.personas
  for select to authenticated using (public.is_contador());
create policy personas_vecino_select on public.personas
  for select to authenticated using (
    exists (
      select 1 from public.apto_personas ap
      where ap.cedula = personas.cedula
        and ap.apto_id = public.current_apto_id()
    )
  );

create policy aptos_admin_all on public.aptos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy aptos_contador_select on public.aptos
  for select to authenticated using (public.is_contador());
create policy aptos_vecino_select on public.aptos
  for select to authenticated using (id = public.current_apto_id());

create policy apto_personas_admin_all on public.apto_personas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy apto_personas_contador_select on public.apto_personas
  for select to authenticated using (public.is_contador());
create policy apto_personas_vecino_select on public.apto_personas
  for select to authenticated using (apto_id = public.current_apto_id());

create policy perfiles_admin_all on public.perfiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy perfiles_contador_select on public.perfiles
  for select to authenticated using (public.is_contador());
create policy perfiles_vecino_select on public.perfiles
  for select to authenticated using (auth_uid = auth.uid());

create policy locales_admin_all on public.locales
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy locales_contador_select on public.locales
  for select to authenticated using (public.is_contador());

-- Periodos y recibos
create policy periodos_admin_all on public.periodos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy periodos_contador_select on public.periodos
  for select to authenticated using (public.is_contador());
create policy periodos_vecino_select on public.periodos
  for select to authenticated using (public.current_apto_id() is not null);

create policy recibos_admin_all on public.recibos_condominio
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy recibos_contador_select on public.recibos_condominio
  for select to authenticated using (public.is_contador());
create policy recibos_vecino_select on public.recibos_condominio
  for select to authenticated using (apto_id = public.current_apto_id());

create policy periodos_gas_admin_all on public.periodos_gas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy periodos_gas_contador_select on public.periodos_gas
  for select to authenticated using (public.is_contador());
create policy periodos_gas_vecino_select on public.periodos_gas
  for select to authenticated using (public.current_apto_id() is not null);

create policy cuotas_gas_admin_all on public.cuotas_gas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy cuotas_gas_contador_select on public.cuotas_gas
  for select to authenticated using (public.is_contador());
create policy cuotas_gas_vecino_select on public.cuotas_gas
  for select to authenticated using (apto_id = public.current_apto_id());

create policy cuotas_locales_admin_all on public.cuotas_locales
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy cuotas_locales_contador_select on public.cuotas_locales
  for select to authenticated using (public.is_contador());

create policy cuotas_especiales_admin_all on public.cuotas_especiales
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy cuotas_especiales_contador_select on public.cuotas_especiales
  for select to authenticated using (public.is_contador());
create policy cuotas_especiales_vecino_select on public.cuotas_especiales
  for select to authenticated using (apto_id = public.current_apto_id());

-- Pagos y aplicaciones
create policy pagos_admin_all on public.pagos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy pagos_contador_select on public.pagos
  for select to authenticated using (public.is_contador());
create policy pagos_vecino_select on public.pagos
  for select to authenticated using (apto_id = public.current_apto_id());
create policy pagos_vecino_insert on public.pagos
  for insert to authenticated with check (
    apto_id = public.current_apto_id()
    and estado = 'pendiente'
    and created_by = auth.uid()
  );

create policy pago_aplicaciones_admin_all on public.pago_aplicaciones
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy pago_aplicaciones_contador_select on public.pago_aplicaciones
  for select to authenticated using (public.is_contador());
create policy pago_aplicaciones_vecino_select on public.pago_aplicaciones
  for select to authenticated using (
    exists (
      select 1 from public.pagos p
      where p.id = pago_aplicaciones.pago_id
        and p.apto_id = public.current_apto_id()
    )
  );

-- Banco y egresos
create policy movimientos_banco_admin_all on public.movimientos_banco
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy movimientos_banco_contador_select on public.movimientos_banco
  for select to authenticated using (public.is_contador());

create policy egresos_admin_all on public.egresos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy egresos_contador_select on public.egresos
  for select to authenticated using (public.is_contador());

create policy otros_ingresos_admin_all on public.otros_ingresos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy otros_ingresos_contador_select on public.otros_ingresos
  for select to authenticated using (public.is_contador());

-- Comunicación
create policy anuncios_admin_all on public.anuncios
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy anuncios_contador_select on public.anuncios
  for select to authenticated using (public.is_contador());
create policy anuncios_publicos on public.anuncios
  for select to anon, authenticated using (estado = 'publicado');

create policy incidencias_admin_all on public.incidencias
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy incidencias_contador_select on public.incidencias
  for select to authenticated using (public.is_contador());
create policy incidencias_vecino_select on public.incidencias
  for select to authenticated using (
    apto_id = public.current_apto_id()
    or reportante_id = auth.uid()
  );
create policy incidencias_vecino_insert on public.incidencias
  for insert to authenticated with check (
    reportante_id = auth.uid()
    and (apto_id is null or apto_id = public.current_apto_id())
  );

create policy incidencia_eventos_admin_all on public.incidencia_eventos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy incidencia_eventos_contador_select on public.incidencia_eventos
  for select to authenticated using (public.is_contador());
create policy incidencia_eventos_vecino_select on public.incidencia_eventos
  for select to authenticated using (
    exists (
      select 1 from public.incidencias i
      where i.id = incidencia_eventos.incidencia_id
        and (
          i.apto_id = public.current_apto_id()
          or i.reportante_id = auth.uid()
        )
    )
  );

create policy notas_apto_admin_all on public.notas_apto
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy notas_apto_vecino_select on public.notas_apto
  for select to authenticated using (
    apto_id = public.current_apto_id() and visible_vecino
  );

create policy auditoria_admin_select on public.auditoria
  for select to authenticated using (public.is_admin());

-- Permisos de tabla (RLS sigue siendo la frontera real)
grant usage on schema public to anon, authenticated;
grant select on public.anuncios to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant select on public.v_relacion_cobranza, public.v_gas_mensual,
  public.v_locales_mensual, public.v_morosos, public.v_morosos_publico,
  public.v_estado_cuenta, public.v_conciliacion
  to authenticated;
grant execute on function public.current_rol(), public.current_apto_id(),
  public.is_admin(), public.is_contador()
  to authenticated, anon;
