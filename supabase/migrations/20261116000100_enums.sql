-- 0001 · Tipos y utilidades base
create extension if not exists pgcrypto;

create type public.rol as enum ('ADMIN', 'VECINO', 'CONTADOR');
create type public.tipo_apto as enum ('apartamento', 'planta_baja');
create type public.estado_apto as enum ('ocupado', 'vacio');
create type public.rol_contacto as enum ('propietario', 'inquilino', 'contacto');
create type public.estado_periodo as enum ('abierto', 'cerrado');
create type public.modalidad_gas as enum ('fija_usd', 'consumo_prorrateado', 'manual');
create type public.estado_cuota as enum ('pendiente', 'parcial', 'pagada', 'exenta', 'cuenta_por_cobrar');
create type public.concepto_pago as enum ('condominio', 'gas', 'local', 'especial');
create type public.metodo_pago as enum ('transferencia', 'efectivo', 'cruce', 'descuento', 'otro');
create type public.estado_pago as enum ('pendiente', 'validado', 'rechazado', 'devuelto', 'sin_asignar');
create type public.cuenta as enum ('condominio', 'locales', 'gas');
create type public.imputacion_egreso as enum ('recibo_condominio', 'cuenta_locales', 'cuenta_gas', 'fuera_recibo');
create type public.estado_incidencia as enum ('pendiente', 'en_proceso', 'resuelto', 'cerrado');
create type public.estado_anuncio as enum ('borrador', 'publicado', 'archivado');

create or replace function public.fn_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
