-- 0006 · Vistas de consulta y conciliación

-- Fila mensual por apartamento para verificación contra la relación de cobranza.
create or replace view public.v_relacion_cobranza
with (security_invoker = true) as
select
  p.anio,
  p.mes,
  a.codigo as apto_codigo,
  r.saldo_anterior_usd,
  r.cuota_usd,
  r.monto_ajustado_usd,
  coalesce(sum(pa.monto_usd), 0)::numeric(12, 2) as pagos_usd,
  r.saldo_actual_usd,
  r.provisional
from public.recibos_condominio r
join public.aptos a on a.id = r.apto_id
join public.periodos p on p.id = r.periodo_id
left join public.pago_aplicaciones pa on pa.recibo_condominio_id = r.id
group by
  p.anio,
  p.mes,
  a.codigo,
  r.saldo_anterior_usd,
  r.cuota_usd,
  r.monto_ajustado_usd,
  r.saldo_actual_usd,
  r.provisional;

create or replace view public.v_gas_mensual
with (security_invoker = true) as
select
  p.anio,
  p.mes,
  count(cg.id) as apartamentos,
  coalesce(sum(cg.monto_usd), 0)::numeric(12, 2) as total_usd,
  coalesce(sum(cg.monto_bs), 0)::numeric(14, 2) as total_bs,
  coalesce(sum(cg.pagado_usd), 0)::numeric(12, 2) as pagado_usd
from public.cuotas_gas cg
join public.periodos_gas pg on pg.id = cg.periodo_gas_id
join public.periodos p on p.id = pg.periodo_id
group by p.anio, p.mes;

create or replace view public.v_locales_mensual
with (security_invoker = true) as
select
  p.anio,
  p.mes,
  count(cl.id) as locales,
  coalesce(sum(cl.monto_usd), 0)::numeric(12, 2) as total_usd,
  coalesce(sum(cl.monto_bs), 0)::numeric(14, 2) as total_bs,
  coalesce(sum(cl.pagado_usd), 0)::numeric(12, 2) as pagado_usd
from public.cuotas_locales cl
join public.periodos p on p.id = cl.periodo_id
group by p.anio, p.mes;

-- Morosidad consolidada (UNA sola fila por apto).
create or replace view public.v_morosos
with (security_invoker = true) as
select
  a.id as apto_id,
  a.codigo,
  coalesce(sum(r.saldo_actual_usd), 0)::numeric(12, 2) as deuda_condominio_usd
from public.aptos a
join public.recibos_condominio r on r.apto_id = a.id
where r.saldo_actual_usd > 0
group by a.id, a.codigo;

-- Solo código y monto; sin cédulas ni nombres (D-13 / P-40).
create or replace view public.v_morosos_publico
with (security_invoker = true) as
select
  a.codigo,
  coalesce(sum(r.saldo_actual_usd), 0)::numeric(12, 2) as deuda_condominio_usd
from public.aptos a
join public.recibos_condominio r on r.apto_id = a.id
where r.saldo_actual_usd > 0
group by a.codigo;

create or replace view public.v_estado_cuenta as
select
  p.id as periodo_id,
  p.anio,
  p.mes,
  p.egresos_usd_recibo,
  p.egresos_bs_banco,
  p.tasa_promedio,
  coalesce((
    select sum(pa.monto_usd)
    from public.pago_aplicaciones pa
    join public.pagos pg on pg.id = pa.pago_id
    where pg.periodo_id = p.id
  ), 0)::numeric(12, 2) as ingresos_usd,
  coalesce((
    select sum(e.monto_usd)
    from public.egresos e
    where e.periodo_id = p.id
  ), 0)::numeric(12, 2) as egresos_usd,
  coalesce((
    select sum(oi.monto_usd)
    from public.otros_ingresos oi
    where oi.periodo_id = p.id
  ), 0)::numeric(12, 2) as otros_ingresos_usd
from public.periodos p;

create or replace view public.v_conciliacion
with (security_invoker = true) as
select
  p.anio,
  p.mes,
  (
    select count(*)
    from public.movimientos_banco mb
    where mb.pago_id is null
      and mb.fecha between make_date(p.anio, p.mes, 1)
        and (make_date(p.anio, p.mes, 1) + interval '1 month - 1 day')
  ) as movimientos_sin_pago,
  (
    select count(*)
    from public.pagos pg
    where pg.periodo_id = p.id
      and not exists (
        select 1 from public.movimientos_banco m2 where m2.pago_id = pg.id
      )
  ) as pagos_sin_movimiento,
  (
    select coalesce(sum(mb.monto_bs), 0)
    from public.movimientos_banco mb
    where mb.pago_id is null
      and mb.fecha between make_date(p.anio, p.mes, 1)
        and (make_date(p.anio, p.mes, 1) + interval '1 month - 1 day')
  )::numeric(14, 2) as monto_sin_conciliar_bs
from public.periodos p;
