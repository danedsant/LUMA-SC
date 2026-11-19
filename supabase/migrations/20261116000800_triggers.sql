-- 0008 · Triggers de actualización y auditoría

create or replace function public.fn_auditoria()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text;
begin
  v_id := case
    when tg_op = 'DELETE' then old.id::text
    else new.id::text
  end;

  insert into public.auditoria (
    tabla, registro_id, accion, datos_antes, datos_despues, autor_id
  ) values (
    tg_table_name,
    v_id,
    lower(tg_op),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end,
    auth.uid()
  );

  return coalesce(new, old);
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'personas', 'aptos', 'perfiles', 'locales', 'periodos',
    'recibos_condominio', 'periodos_gas', 'cuotas_gas', 'cuotas_locales',
    'cuotas_especiales', 'pagos', 'movimientos_banco', 'egresos',
    'otros_ingresos', 'anuncios', 'incidencias'
  ]
  loop
    execute format(
      'create trigger %I_set_updated_at before update on public.%I
       for each row execute function public.fn_set_updated_at()',
      t, t
    );
  end loop;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'pagos', 'pago_aplicaciones', 'recibos_condominio', 'egresos',
    'cuotas_gas', 'cuotas_locales', 'cuotas_especiales',
    'movimientos_banco', 'otros_ingresos', 'perfiles'
  ]
  loop
    execute format(
      'create trigger %I_auditoria after insert or update or delete on public.%I
       for each row execute function public.fn_auditoria()',
      t, t
    );
  end loop;
end;
$$;
