#!/usr/bin/env node
/**
 * Importa la base 2026 (Fase 3) a Supabase de forma idempotente.
 *
 * Uso:
 *   node scripts/import-seed.mjs
 *   node scripts/import-seed.mjs --admin-cedula=27506542 --admin-password=...
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

const root = resolve(import.meta.dirname, "..");
const dataDir = resolve(root, "documentacion", "data", "base-2026");
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
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Copia .env.example a .env.local y completa las claves.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, ...rest] = arg.slice(2).split("=");
      return [key, rest.join("=") || true];
    }),
);

function parseCsv(text) {
  const clean = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];
    if (quoted) {
      if (char === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...body] = rows.filter((line) => line.some((cell) => cell.trim() !== ""));
  return body.map((line) =>
    Object.fromEntries(header.map((name, index) => [name.trim(), (line[index] ?? "").trim()])),
  );
}

function readCsv(name) {
  return parseCsv(readFileSync(resolve(dataDir, name), "utf8"));
}

const num = (value) => {
  if (value === "" || value === null || value === undefined) return 0;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value) => Math.round((num(value) + Number.EPSILON) * 100) / 100;

function periodId(periodo) {
  if (!periodo || !/^\d{4}-\d{2}$/.test(periodo)) {
    throw new Error(`Periodo inválido: ${periodo}`);
  }
  return periodo;
}

function splitPeriod(periodo) {
  const [anio, mes] = periodId(periodo).split("-").map(Number);
  return { anio, mes };
}

function fail(context, error) {
  console.error(`\n✗ ${context}: ${error.message ?? error}`);
  if (error.details) console.error(`  ${error.details}`);
  if (error.hint) console.error(`  ${error.hint}`);
  process.exit(1);
}

async function upsert(table, row, onConflict, context) {
  const { data, error } = await supabase
    .from(table)
    .upsert(row, { onConflict })
    .select("id")
    .single();
  if (error) fail(context, error);
  return data;
}

async function main() {
  console.log("Importando base 2026 a Supabase…\n");

  const aptosCsv = readCsv("aptos.csv");
  const cobranzaCsv = readCsv("cobranza_junio.csv");
  const gasCsv = readCsv("gas_julio.csv");
  const localesCsv = readCsv("locales_julio.csv");
  const egresosCsv = readCsv("egresos_julio.csv");

  const aptoByCodigo = new Map();

  for (const row of aptosCsv) {
    const record = await upsert(
      "aptos",
      {
        codigo: row.codigo,
        piso: Number(row.piso),
        tipo: row.tipo,
        balcon: row.balcon === "true",
        alicuota: Number(row.alicuota),
        estado: row.estado || "ocupado",
        activo: row.activo !== "false",
      },
      "codigo",
      `apto ${row.codigo}`,
    );
    aptoByCodigo.set(row.codigo, record.id);
  }
  console.log(`✓ ${aptoByCodigo.size} apartamentos`);

  const localByNombre = new Map();
  for (const row of localesCsv) {
    const record = await upsert(
      "locales",
      {
        nombre: row.local,
        cuota_usd: money(row.cuota_usd),
        encargado: row.encargado || null,
        activo: true,
      },
      "nombre",
      `local ${row.local}`,
    );
    localByNombre.set(row.local, record.id);
  }
  console.log(`✓ ${localByNombre.size} locales`);

  const periodoIds = new Map();
  for (const periodo of [expected.cobranza.periodo, expected.gas.periodo]) {
    const { anio, mes } = splitPeriod(periodo);
    const record = await upsert(
      "periodos",
      { anio, mes, estado: "abierto" },
      "anio,mes",
      `periodo ${periodo}`,
    );
    periodoIds.set(periodo, record.id);
  }
  console.log(`✓ ${periodoIds.size} periodos`);

  const cobranzaPeriodo = periodoIds.get(expected.cobranza.periodo);
  const gasPeriodo = periodoIds.get(expected.gas.periodo);

  const { data: periodoGas } = await supabase
    .from("periodos_gas")
    .upsert(
      {
        periodo_id: gasPeriodo,
        modalidad: "fija_usd",
        cuota_usd: 6.6,
        total_factura_bs: expected.gas.total_bs,
      },
      { onConflict: "periodo_id" },
    )
    .select("id")
    .single();
  if (!periodoGas) fail("periodo_gas", new Error("sin id"));
  console.log("✓ periodo de gas");

  let recibos = 0;
  let pagos = 0;
  let aplicaciones = 0;
  const reciboIds = new Map();

  for (const row of cobranzaCsv) {
    const aptoId = aptoByCodigo.get(row.apto_codigo);
    if (!aptoId) {
      console.warn(`  ! cobranza sin apto: ${row.apto_codigo}`);
      continue;
    }

    const record = await upsert(
      "recibos_condominio",
      {
        apto_id: aptoId,
        periodo_id: cobranzaPeriodo,
        saldo_anterior_usd: money(row.saldo_anterior_usd),
        cuota_usd: money(row.cuota_usd),
        pagos_usd: money(row.pagos_usd),
        saldo_actual_usd: money(row.saldo_actual_usd),
        provisional: true,
        nota_origen: "Seed Fase 3 · relación de cobranza junio 2026",
      },
      "apto_id,periodo_id",
      `recibo ${row.apto_codigo}`,
    );
    reciboIds.set(row.apto_codigo, record.id);
    recibos += 1;

    const pagado = money(row.pagos_usd);
    if (pagado <= 0 || !row.referencia) continue;

    const pago = await upsert(
      "pagos",
      {
        apto_id: aptoId,
        periodo_id: cobranzaPeriodo,
        concepto: "condominio",
        monto_bs: money(row.pagos_bs),
        tasa_bcv: num(row.tasa) || 1,
        fecha_pago: row.fecha || `${expected.cobranza.periodo}-01`,
        metodo: row.clasificacion === "efectivo" ? "efectivo" : "transferencia",
        referencia: row.referencia || null,
        clasificacion: row.clasificacion || null,
        estado: "validado",
        idempotency_key: `seed:cobranza:${row.apto_codigo}:${row.referencia}:${money(row.pagos_bs)}`,
        detalles: { origen: "seed", periodo: expected.cobranza.periodo },
      },
      "idempotency_key",
      `pago ${row.apto_codigo}`,
    );
    pagos += 1;

    await supabase.from("pago_aplicaciones").delete().eq("pago_id", pago.id);
    const { error: appError } = await supabase.from("pago_aplicaciones").insert({
      pago_id: pago.id,
      recibo_condominio_id: record.id,
      monto_usd: pagado,
    });
    if (appError) fail(`aplicación ${row.apto_codigo}`, appError);
    aplicaciones += 1;
  }
  console.log(`✓ ${recibos} recibos de condominio (${pagos} pagos, ${aplicaciones} aplicaciones)`);

  let cuotasGas = 0;
  for (const row of gasCsv) {
    const aptoId = aptoByCodigo.get(row.apto_codigo);
    if (!aptoId) {
      console.warn(`  ! gas sin apto: ${row.apto_codigo}`);
      continue;
    }

    // La relación de gas se transcribió solo en Bs; la cuota del periodo es
    // fija en USD (6,6). Si el CSV trae monto_usd, se respeta.
    const montoUsd = money(row.monto_usd) || 6.6;
    const montoBs = money(row.monto_bs);
    const clasificacion = row.clasificacion || null;
    const pagada = clasificacion === "banco" || clasificacion === "efectivo";
    const estado = pagada
      ? "pagada"
      : clasificacion === "cuenta_por_cobrar"
        ? "cuenta_por_cobrar"
        : "pendiente";

    const { data: cuota } = await supabase
      .from("cuotas_gas")
      .upsert(
        {
          apto_id: aptoId,
          periodo_gas_id: periodoGas.id,
          monto_usd: montoUsd,
          monto_bs: montoBs,
          pagado_usd: pagada ? montoUsd : 0,
          clasificacion,
          estado,
          observacion: row.observacion || null,
        },
        { onConflict: "apto_id,periodo_gas_id" },
      )
      .select("id")
      .single();
    if (!cuota) fail(`cuota gas ${row.apto_codigo}`, new Error("sin id"));
    cuotasGas += 1;

    if (!pagada || montoUsd <= 0) continue;

    const tasa = montoBs > 0 && montoUsd > 0 ? Math.round((montoBs / montoUsd) * 10000) / 10000 : 1;
    const pago = await upsert(
      "pagos",
      {
        apto_id: aptoId,
        periodo_id: gasPeriodo,
        concepto: "gas",
        monto_bs: montoBs,
        tasa_bcv: tasa,
        fecha_pago: row.fecha || `${expected.gas.periodo}-31`,
        metodo: clasificacion === "efectivo" ? "efectivo" : "transferencia",
        referencia: row.referencia || null,
        clasificacion,
        estado: "validado",
        idempotency_key: `seed:gas:${row.apto_codigo}:${row.referencia || row.fecha}:${montoBs}`,
        detalles: { origen: "seed", periodo: expected.gas.periodo },
      },
      "idempotency_key",
      `pago gas ${row.apto_codigo}`,
    );
    pagos += 1;

    await supabase.from("pago_aplicaciones").delete().eq("pago_id", pago.id);
    const { error } = await supabase.from("pago_aplicaciones").insert({
      pago_id: pago.id,
      cuota_gas_id: cuota.id,
      monto_usd: montoUsd,
    });
    if (error) fail(`aplicación gas ${row.apto_codigo}`, error);
    aplicaciones += 1;
  }
  console.log(`✓ ${cuotasGas} cuotas de gas`);

  if (cuotasGas < expected.padron.gas_aptos) {
    console.warn(
      `  ! gas: ${expected.padron.gas_aptos - cuotasGas} aptos sin cuota (V-03, tolerado)`,
    );
  }

  let cuotasLocales = 0;
  for (const row of localesCsv) {
    const localId = localByNombre.get(row.local);
    if (!localId) {
      console.warn(`  ! local sin padrón: ${row.local}`);
      continue;
    }

    const montoBs = money(row.monto_bs);
    const cuotaUsd = money(row.cuota_usd);
    const pagada = row.estado === "pagado";
    const { data: cuota } = await supabase
      .from("cuotas_locales")
      .upsert(
        {
          local_id: localId,
          periodo_id: gasPeriodo,
          monto_usd: cuotaUsd,
          monto_bs: montoBs,
          pagado_usd: pagada ? cuotaUsd : 0,
          estado: pagada ? "pagada" : "pendiente",
        },
        { onConflict: "local_id,periodo_id" },
      )
      .select("id")
      .single();
    if (!cuota) fail(`cuota local ${row.local}`, new Error("sin id"));
    cuotasLocales += 1;

    if (!pagada) continue;

    const tasa = cuotaUsd > 0 ? Math.round((montoBs / cuotaUsd) * 10000) / 10000 : 1;
    const pago = await upsert(
      "pagos",
      {
        local_id: localId,
        periodo_id: gasPeriodo,
        concepto: "local",
        monto_bs: montoBs,
        tasa_bcv: tasa,
        fecha_pago: `${expected.gas.periodo}-01`,
        metodo: "transferencia",
        clasificacion: "banco",
        estado: "validado",
        idempotency_key: `seed:local:${row.local}:${expected.gas.periodo}:${montoBs}`,
        detalles: { origen: "seed", periodo: expected.gas.periodo },
      },
      "idempotency_key",
      `pago local ${row.local}`,
    );
    pagos += 1;

    await supabase.from("pago_aplicaciones").delete().eq("pago_id", pago.id);
    const { error } = await supabase.from("pago_aplicaciones").insert({
      pago_id: pago.id,
      cuota_local_id: cuota.id,
      monto_usd: cuotaUsd,
    });
    if (error) fail(`aplicación local ${row.local}`, error);
    aplicaciones += 1;
  }
  console.log(`✓ ${cuotasLocales} cuotas de locales`);

  await supabase.from("egresos").delete().eq("periodo_id", gasPeriodo);
  for (const row of egresosCsv) {
    const { error } = await supabase.from("egresos").insert({
      periodo_id: gasPeriodo,
      cuenta_origen: row.cuenta,
      fecha: row.fecha,
      descripcion: row.descripcion,
      factura: row.factura || null,
      monto_bs: money(row.monto_bs),
      tasa: num(row.tasa) || null,
      monto_usd: money(row.monto_usd),
      tipo: row.tipo || "variable",
      imputado_a: row.imputado_a || "recibo_condominio",
      observacion: row.observacion || null,
    });
    if (error) fail(`egreso ${row.factura || row.descripcion}`, error);
  }
  console.log(`✓ ${egresosCsv.length} egresos`);

  const egresosRecibo = egresosCsv
    .filter((row) => row.imputado_a === "recibo_condominio")
    .reduce((sum, row) => sum + num(row.monto_usd), 0);
  const egresosBanco = egresosCsv
    .filter((row) => row.cuenta === "condominio")
    .reduce((sum, row) => sum + num(row.monto_bs), 0);
  await supabase
    .from("periodos")
    .update({
      egresos_usd_recibo: money(egresosRecibo),
      egresos_bs_banco: money(egresosBanco),
    })
    .eq("id", gasPeriodo);

  const personasFile = ["personas.csv", "personas.example.csv"]
    .map((name) => resolve(dataDir, name))
    .find((path) => existsSync(path));
  const personasCsv = personasFile ? parseCsv(readFileSync(personasFile, "utf8")) : [];
  let personas = 0;
  for (const row of personasCsv) {
    if (!row.cedula) continue;
    const { error } = await supabase.from("personas").upsert(
      {
        cedula: row.cedula,
        nombre: row.nombre,
        telefono: row.telefono || null,
        email: row.email || null,
      },
      { onConflict: "cedula" },
    );
    if (error) fail(`persona ${row.cedula}`, error);
    personas += 1;

    const aptoId = aptoByCodigo.get(row.apto_codigo);
    if (aptoId) {
      const { error: linkError } = await supabase.from("apto_personas").upsert(
        {
          apto_id: aptoId,
          cedula: row.cedula,
          rol: row.rol || "contacto",
          es_titular: row.rol === "propietario",
        },
        { onConflict: "apto_id,cedula,rol,vigente_desde", ignoreDuplicates: true },
      );
      if (linkError) fail(`vínculo ${row.cedula}`, linkError);
    }
  }
  console.log(`✓ ${personas} personas`);

  if (args["admin-cedula"] && args["admin-password"]) {
    await ensureAdmin(String(args["admin-cedula"]), String(args["admin-password"]));
  }

  const { data: pagosDb } = await supabase
    .from("pagos")
    .select("monto_bs, concepto, clasificacion")
    .not("clasificacion", "is", null);
  const totalCobranza = (pagosDb ?? [])
    .filter((row) => row.concepto === "condominio")
    .reduce((sum, row) => sum + Number(row.monto_bs), 0);
  const totalGas = (pagosDb ?? [])
    .filter((row) => row.concepto === "gas")
    .reduce((sum, row) => sum + Number(row.monto_bs), 0);

  console.log("\nTotales en base (pagos validados):");
  console.log(`  condominio: ${money(totalCobranza).toFixed(2)} Bs (esperado ${expected.cobranza.total_bs.toFixed(2)})`);
  console.log(`  gas:        ${money(totalGas).toFixed(2)} Bs (esperado ${expected.gas.total_bs.toFixed(2)})`);
  console.log(`  pagos:      ${pagos} · aplicaciones: ${aplicaciones}`);
  console.log("\nListo.");
}

async function ensureAdmin(cedula, password) {
  const email = `${cedula}@luma.local`;
  console.log(`\nBootstrap admin ${cedula}…`);

  const { data: created, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { cedula },
  });

  let userId = created?.user?.id;

  if (error) {
    const { data: list, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (listError) fail("listar usuarios", listError);
    const existing = list.users.find((user) => user.email === email);
    if (!existing) fail("crear admin", error);
    userId = existing.id;
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    if (updateError) fail("actualizar admin", updateError);
  }

  const { error: profileError } = await supabase.from("perfiles").upsert(
    {
      auth_uid: userId,
      cedula,
      rol: "ADMIN",
      apto_id: null,
      activo: true,
    },
    { onConflict: "auth_uid" },
  );
  if (profileError) fail("perfil admin", profileError);

  console.log(`✓ admin ${cedula}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
