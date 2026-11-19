#!/usr/bin/env node
/**
 * Verifica los cuadres de la base importada contra expected-base-2026.json.
 *
 * Uso: node scripts/verify-cuadres.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

const root = resolve(import.meta.dirname, "..");
const expected = JSON.parse(
  readFileSync(resolve(root, "documentacion", "data", "expected-base-2026.json"), "utf8"),
);

for (const file of [".env.local", ".env"]) {
  const path = resolve(root, file);
  if (existsSync(path)) {
    process.loadEnvFile(path);
    break;
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const money = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

let failures = 0;
let warnings = 0;

function check(label, actual, target, tolerance = 0.01) {
  const ok = Math.abs(Number(actual) - Number(target)) <= tolerance;
  console.log(`${ok ? "✓" : "✗"} ${label}: ${money(actual)} (esperado ${money(target)})`);
  if (!ok) failures += 1;
  return ok;
}

function warn(label) {
  warnings += 1;
  console.log(`! ${label}`);
}

async function count(table, filters = (query) => query) {
  const query = filters(
    supabase.from(table).select("*", { head: true, count: "exact" }),
  );
  const { count: total, error } = await query;
  if (error) throw error;
  return total ?? 0;
}

async function sum(table, column, filters = (query) => query) {
  const { data, error } = await filters(supabase.from(table).select(column));
  if (error) throw error;
  return (data ?? []).reduce((acc, row) => acc + Number(row[column] ?? 0), 0);
}

async function main() {
  console.log("Verificando cuadres en Supabase…\n");

  const aptos = await count("aptos");
  check("Apartamentos", aptos, expected.padron.aptos, 0);

  const recibos = await count("recibos_condominio");
  check("Recibos de condominio", recibos, expected.padron.cobranza_filas, 0);

  const cuotasGas = await count("cuotas_gas");
  check(
    "Cuotas de gas",
    cuotasGas,
    expected.padron.gas_aptos - expected.padron.gas_faltantes,
    0,
  );
  if (cuotasGas < expected.padron.gas_aptos) {
    warn(`Faltan ${expected.padron.gas_aptos - cuotasGas} cuotas de gas (V-03, tolerado)`);
  }

  const cuotasLocales = await count("cuotas_locales");
  check("Cuotas de locales", cuotasLocales, expected.padron.locales, 0);

  const egresosRows = await count("egresos");
  const egresosEsperados = 19;
  check("Egresos", egresosRows, egresosEsperados, 0);

  console.log("");

  const cobranza = await sum("pagos", "monto_bs", (query) =>
    query.eq("concepto", "condominio"),
  );
  check("Cobranza cobrada (Bs)", cobranza, expected.cobranza.total_bs, 1);

  const banco = await sum("pagos", "monto_bs", (query) =>
    query.eq("concepto", "condominio").eq("clasificacion", "banco"),
  );
  check("Cobranza banco (Bs)", banco, expected.cobranza.banco_bs, 1);

  const efectivo = await sum("pagos", "monto_bs", (query) =>
    query.eq("concepto", "condominio").eq("clasificacion", "efectivo"),
  );
  check("Cobranza efectivo (Bs)", efectivo, expected.cobranza.efectivo_bs, 1);

  const gas = await sum("cuotas_gas", "monto_bs");
  check("Gas facturado (Bs)", gas, expected.gas.total_bs, 1);

  const gasBanco = await sum("cuotas_gas", "monto_bs", (query) =>
    query.eq("clasificacion", "banco"),
  );
  check("Gas banco (Bs)", gasBanco, expected.gas.banco_bs, 1);

  const gasEfectivo = await sum("cuotas_gas", "monto_bs", (query) =>
    query.eq("clasificacion", "efectivo"),
  );
  check("Gas efectivo (Bs)", gasEfectivo, expected.gas.efectivo_bs, 1);

  const gasCxc = await sum("cuotas_gas", "monto_bs", (query) =>
    query.eq("clasificacion", "cuenta_por_cobrar"),
  );
  check("Gas cuenta por cobrar (Bs)", gasCxc, expected.gas.cxc_bs, 1);

  const locales = await sum("cuotas_locales", "monto_bs");
  check("Locales (Bs)", locales, expected.locales.total_bs, 1);

  const egresosUsd = await sum("egresos", "monto_usd");
  check(
    "Egresos al recibo (USD)",
    egresosUsd,
    expected.egresos.recibo_condominio_usd,
    0.05,
  );

  const egresosBs = await sum("egresos", "monto_bs", (query) =>
    query.eq("cuenta_origen", "condominio"),
  );
  check("Egresos flujo banco (Bs)", egresosBs, expected.egresos.flujo_banco_bs, 1);

  console.log("\nDiferencias de centavos en recibos (V-07):");
  const { data: recibosData, error: recibosError } = await supabase
    .from("recibos_condominio")
    .select("apto_id, saldo_anterior_usd, cuota_usd, pagos_usd, saldo_actual_usd, aptos(codigo)");
  if (recibosError) throw recibosError;

  const diferencias = (recibosData ?? [])
    .map((row) => {
      const formula =
        Number(row.saldo_anterior_usd) + Number(row.cuota_usd) - Number(row.pagos_usd);
      return {
        codigo: row.aptos?.codigo ?? row.apto_id,
        delta: money(Number(row.saldo_actual_usd) - formula),
      };
    })
    .filter((row) => Math.abs(row.delta) > 0.01);

  console.log(`  filas con diferencia: ${diferencias.length} (esperado 17)`);
  if (diferencias.length > 0) {
    const max = Math.max(...diferencias.map((row) => Math.abs(row.delta)));
    console.log(`  diferencia máxima: ${max.toFixed(2)} USD (esperado <= 1.33)`);
  }

  console.log(`\n${failures === 0 ? "OK" : "FALLÓ"} · ${failures} fallos, ${warnings} advertencias`);
  if (failures > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
