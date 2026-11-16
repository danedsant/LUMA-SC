#!/usr/bin/env node
/**
 * LUMA · Validador de la carga inicial (julio 2026)
 *
 * Uso:
 *   node documentacion/scripts/validate-seed.mjs
 *   node documentacion/scripts/validate-seed.mjs documentacion/data/base-2026
 *
 * Sin argumento valida la estructura de las plantillas. Con un directorio
 * valida estructura y cuadres contra documentacion/data/expected-base-2026.json.
 * Las rutas se resuelven desde la ubicación del script, no desde el cwd.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..", "..");
const dataDir = path.resolve(
  process.argv[2] ?? path.join(scriptDir, "..", "data", "templates"),
);
const expectedPath = path.join(scriptDir, "..", "data", "expected-base-2026.json");

if (!fs.existsSync(expectedPath)) {
  console.error(`No existe ${expectedPath}`);
  process.exit(2);
}

const expected = JSON.parse(fs.readFileSync(expectedPath, "utf8"));
const errors = [];
const warnings = [];
const checks = [];

const fmt = (n) =>
  Number(n).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const rel = (p) => path.relative(root, p) || p;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

function readTable(file, requiredHeaders, optional = false) {
  const full = path.join(dataDir, file);

  if (!fs.existsSync(full)) {
    if (optional) return [];
    errors.push(`Falta el archivo ${rel(full)}`);
    return [];
  }

  const rows = parseCsv(fs.readFileSync(full, "utf8"));
  if (rows.length === 0) {
    errors.push(`${file}: archivo vacío`);
    return [];
  }

  const headers = rows[0].map((h) => h.replace(/^\uFEFF/, "").trim());
  const missing = requiredHeaders.filter((h) => !headers.includes(h));
  const extra = headers.filter((h) => !requiredHeaders.includes(h));

  if (missing.length) {
    errors.push(`${file}: faltan columnas ${missing.join(", ")}`);
    return [];
  }
  if (extra.length) {
    warnings.push(`${file}: columnas extra ${extra.join(", ")}`);
  }

  return rows.slice(1).map((r, index) => {
    const obj = { __row: index + 2 };
    headers.forEach((h, i) => {
      obj[h] = (r[i] ?? "").trim();
    });
    return obj;
  });
}

function num(value, label) {
  if (value === "" || value == null) return null;
  const n = Number(String(value).replace(",", "."));
  if (!Number.isFinite(n)) {
    errors.push(`${label}: valor no numérico "${value}"`);
    return null;
  }
  return n;
}

function bool(value, label) {
  const v = String(value).toLowerCase();
  if (["true", "1", "si", "sí", "x"].includes(v)) return true;
  if (["false", "0", "no"].includes(v)) return false;
  errors.push(`${label}: booleano inválido "${value}"`);
  return null;
}

function sum(rows, fn) {
  return rows.reduce((acc, row) => acc + (fn(row) ?? 0), 0);
}

function check(name, actual, expectedValue, tolerance = 0.01) {
  if (actual == null) return;
  const diff = Math.abs(actual - expectedValue);
  if (diff > tolerance) {
    errors.push(
      `${name}: ${fmt(actual)} vs esperado ${fmt(expectedValue)} (diferencia ${fmt(diff)})`,
    );
  } else {
    checks.push(`${name}: ${fmt(actual)}`);
  }
}

function unique(rows, key, file) {
  const seen = new Map();
  for (const row of rows) {
    if (!row[key]) {
      errors.push(`${file} fila ${row.__row}: ${key} vacío`);
      continue;
    }
    if (seen.has(row[key])) {
      errors.push(
        `${file}: ${key} duplicado "${row[key]}" (filas ${seen.get(row[key])} y ${row.__row})`,
      );
    } else {
      seen.set(row[key], row.__row);
    }
  }
  return seen;
}

function countBy(rows, key) {
  const map = new Map();
  for (const row of rows) {
    const value = row[key] || "(vacío)";
    map.set(value, (map.get(value) ?? 0) + 1);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Lectura
// ---------------------------------------------------------------------------

const aptos = readTable("aptos.csv", [
  "codigo",
  "piso",
  "tipo",
  "balcon",
  "alicuota",
  "estado",
  "activo",
]);
const personas = readTable(
  "personas.csv",
  ["cedula", "nombre", "telefono", "email", "apto_codigo", "rol"],
  true,
);
const cobranza = readTable("cobranza_junio.csv", [
  "apto_codigo",
  "saldo_anterior_usd",
  "cuota_usd",
  "cuota_bs",
  "pagos_usd",
  "pagos_bs",
  "referencia",
  "tasa",
  "fecha",
  "clasificacion",
  "saldo_actual_usd",
]);
const gas = readTable("gas_julio.csv", [
  "apto_codigo",
  "monto_usd",
  "monto_bs",
  "referencia",
  "fecha",
  "clasificacion",
  "observacion",
]);
const locales = readTable("locales_julio.csv", [
  "local",
  "cuota_usd",
  "monto_bs",
  "encargado",
  "estado",
]);
const egresos = readTable("egresos_julio.csv", [
  "cuenta",
  "fecha",
  "descripcion",
  "factura",
  "monto_bs",
  "tasa",
  "monto_usd",
  "tipo",
  "imputado_a",
  "observacion",
]);

// ---------------------------------------------------------------------------
// Padrón
// ---------------------------------------------------------------------------

const aptoCodes = unique(aptos, "codigo", "aptos.csv");

if (aptos.length > 0 && aptos.length !== expected.padron.aptos) {
  errors.push(
    `aptos.csv: ${aptos.length} apartamentos; se esperaban ${expected.padron.aptos}`,
  );
}

for (const apto of aptos) {
  const label = `aptos.csv fila ${apto.__row}`;
  const alicuota = num(apto.alicuota, `${label} alicuota`);
  const balcon = bool(apto.balcon, `${label} balcon`);

  if (!["apartamento", "planta_baja"].includes(apto.tipo)) {
    errors.push(`${label}: tipo inválido "${apto.tipo}"`);
  }
  if (!["ocupado", "vacio", "vacío"].includes(apto.estado)) {
    errors.push(`${label}: estado inválido "${apto.estado}"`);
  }
  if (apto.activo !== "") {
    bool(apto.activo, `${label} activo`);
  }

  if (apto.tipo === "planta_baja") {
    if (balcon === true) {
      errors.push(`${label}: una planta baja no debe tener balcón`);
    }
    if (
      alicuota != null &&
      Math.abs(alicuota - expected.alicuotas.sin_balcon) > 1e-9
    ) {
      errors.push(`${label}: alícuota de PB debe ser ${expected.alicuotas.sin_balcon}`);
    }
  }

  if (apto.tipo === "apartamento" && balcon != null && alicuota != null) {
    const target = balcon
      ? expected.alicuotas.con_balcon
      : expected.alicuotas.sin_balcon;
    if (Math.abs(alicuota - target) > 1e-9) {
      errors.push(
        `${label}: alícuota ${alicuota} no coincide con balcón=${balcon} (${target})`,
      );
    }
  }
}

const cedulas = unique(personas, "cedula", "personas.csv");
const titulares = new Map();

for (const persona of personas) {
  const label = `personas.csv fila ${persona.__row}`;
  if (!["propietario", "inquilino", "contacto"].includes(persona.rol)) {
    errors.push(`${label}: rol inválido "${persona.rol}"`);
  }
  if (persona.apto_codigo && !aptoCodes.has(persona.apto_codigo)) {
    errors.push(
      `${label}: apartamento "${persona.apto_codigo}" no existe en aptos.csv`,
    );
  }
  if (persona.rol === "propietario" && persona.apto_codigo) {
    titulares.set(
      persona.apto_codigo,
      (titulares.get(persona.apto_codigo) ?? 0) + 1,
    );
  }
}

for (const [apto, count] of titulares) {
  if (count !== 1) {
    errors.push(`personas.csv: ${apto} tiene ${count} propietarios titulares`);
  }
}

if (personas.length === 0 && aptos.length > 0) {
  warnings.push(
    "personas.csv vacío o ausente (V-05): copiar personas.example.csv solo en local; no se valida el titular único por apartamento",
  );
}

// ---------------------------------------------------------------------------
// Cobranza
// ---------------------------------------------------------------------------

unique(cobranza, "apto_codigo", "cobranza_junio.csv");

const ajustes = [];

for (const row of cobranza) {
  const label = `cobranza_junio.csv fila ${row.__row}`;
  if (row.apto_codigo && !aptoCodes.has(row.apto_codigo)) {
    errors.push(`${label}: apartamento "${row.apto_codigo}" no existe`);
  }

  const saldoAnterior = num(row.saldo_anterior_usd, `${label} saldo_anterior_usd`);
  const cuota = num(row.cuota_usd, `${label} cuota_usd`);
  const pagosUsd = num(row.pagos_usd, `${label} pagos_usd`);
  const pagosBs = num(row.pagos_bs, `${label} pagos_bs`);
  const tasa = num(row.tasa, `${label} tasa`);
  const saldoActual = num(row.saldo_actual_usd, `${label} saldo_actual_usd`);

  if (
    saldoAnterior != null &&
    cuota != null &&
    pagosUsd != null &&
    saldoActual != null
  ) {
    const calculado = saldoAnterior + cuota - pagosUsd;
    const diff = Math.abs(calculado - saldoActual);
    const maxAjuste = expected.cobranza.ajustes?.max_usd ?? 1.5;
    if (diff > 0.02 && diff <= maxAjuste) {
      ajustes.push({ row: row.__row, diff });
    } else if (diff > maxAjuste) {
      errors.push(
        `${label}: saldo ${fmt(saldoActual)} vs fórmula ${fmt(calculado)} excede el ajuste conocido (${fmt(diff)} > ${fmt(maxAjuste)})`,
      );
    }
  }

  if (pagosBs != null && tasa != null && pagosUsd != null && tasa > 0) {
    const convertido = pagosBs / tasa;
    if (Math.abs(convertido - pagosUsd) > 0.05) {
      warnings.push(
        `${label}: pagos_usd ${fmt(pagosUsd)} vs pagos_bs/tasa ${fmt(convertido)}`,
      );
    }
  }

  if (
    !["banco", "efectivo", "cruce", "extemporaneo", "extemporáneo", ""].includes(
      row.clasificacion,
    )
  ) {
    errors.push(`${label}: clasificación inválida "${row.clasificacion}"`);
  }
}

if (cobranza.length > 0) {
  check(
    "Cobranza junio · pagos en Bs",
    sum(cobranza, (r) => num(r.pagos_bs, `cobranza fila ${r.__row}`)),
    expected.cobranza.total_bs,
  );

  if (
    expected.padron.cobranza_filas != null &&
    cobranza.length !== expected.padron.cobranza_filas
  ) {
    errors.push(
      `cobranza_junio.csv: ${cobranza.length} filas; se esperaban ${expected.padron.cobranza_filas}`,
    );
  }

  const sinFila = [...aptoCodes.keys()].filter(
    (codigo) => !cobranza.some((row) => row.apto_codigo === codigo),
  );
  for (const codigo of sinFila) {
    const conocida = (expected.padron.cobranza_sin_fila ?? []).includes(codigo);
    const mensaje = `cobranza_junio.csv: el apartamento ${codigo} no tiene fila`;
    if (conocida) {
      warnings.push(`${mensaje} (V-02: excepción conocida)`);
    } else {
      errors.push(mensaje);
    }
  }

  const porClase = (clase) =>
    cobranza
      .filter((r) => r.clasificacion === clase)
      .reduce((acc, r) => acc + (num(r.pagos_bs, `cobranza fila ${r.__row}`) ?? 0), 0);

  const banco = porClase("banco");
  const efectivo = porClase("efectivo");
  const cruce = porClase("cruce");
  const extemporaneo = porClase("extemporaneo") + porClase("extemporáneo");

  check("Cobranza junio · efectivo", efectivo, expected.cobranza.efectivo_bs);
  check("Cobranza junio · cruce", cruce, expected.cobranza.cruce_bs);
  check(
    "Cobranza junio · suma de componentes",
    banco + efectivo + cruce + extemporaneo,
    expected.cobranza.total_bs,
  );

  const provisional = expected.cobranza.clasificacion_provisional;
  if (provisional) {
    check("Cobranza junio · banco (provisional V-01)", banco, provisional.banco_bs);
    check(
      "Cobranza junio · extemporáneo (provisional V-01)",
      extemporaneo,
      provisional.extemporaneo_bs,
    );
    warnings.push(
      `Cobranza junio · ${provisional.motivo}: banco ${fmt(banco)} vs impreso ${fmt(expected.cobranza.banco_bs)} y extemporáneo ${fmt(extemporaneo)} vs ${fmt(expected.cobranza.extemporaneo_bs)} (Δ ${fmt(provisional.diferencia_bs)})`,
    );
  } else {
    check("Cobranza junio · banco", banco, expected.cobranza.banco_bs);
    check("Cobranza junio · extemporáneo", extemporaneo, expected.cobranza.extemporaneo_bs);
  }

  if (ajustes.length > 0) {
    const esperados = expected.cobranza.ajustes?.filas;
    const maxDiff = Math.max(...ajustes.map((a) => a.diff));
    const detalle = `${ajustes.length} filas con diferencia ≤ ${fmt(maxDiff)} USD (P-08/V-07)`;
    if (esperados != null && ajustes.length !== esperados) {
      warnings.push(
        `Cobranza junio · ajustes de centavos: ${detalle}; se esperaban ${esperados}`,
      );
    } else {
      warnings.push(`Cobranza junio · ajustes de centavos: ${detalle}`);
    }
    warnings.push(
      `Cobranza junio · ajustes en filas ${ajustes.map((a) => a.row).join(", ")}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Gas
// ---------------------------------------------------------------------------

unique(gas, "apto_codigo", "gas_julio.csv");

for (const row of gas) {
  const label = `gas_julio.csv fila ${row.__row}`;
  if (row.apto_codigo && !aptoCodes.has(row.apto_codigo)) {
    errors.push(`${label}: apartamento "${row.apto_codigo}" no existe`);
  }
  if (
    !["banco", "efectivo", "cuenta_por_cobrar", "pendiente", ""].includes(
      row.clasificacion,
    )
  ) {
    errors.push(`${label}: clasificación inválida "${row.clasificacion}"`);
  }
  num(row.monto_usd, `${label} monto_usd`);
  num(row.monto_bs, `${label} monto_bs`);
}

if (gas.length > 0 && gas.length !== expected.padron.gas_aptos) {
  const faltan = expected.padron.gas_faltantes;
  warnings.push(
    `gas_julio.csv: ${gas.length} registros; se esperaban ${expected.padron.gas_aptos} para el corte${faltan ? ` (V-03: faltan ${faltan})` : ""}`,
  );
}

if (gas.length > 0) {
  check(
    "Gas julio · monto en Bs",
    sum(gas, (r) => num(r.monto_bs, `gas fila ${r.__row}`)),
    expected.gas.total_bs,
  );
  check(
    "Gas julio · banco",
    sum(
      gas.filter((r) => r.clasificacion === "banco"),
      (r) => num(r.monto_bs, `gas fila ${r.__row}`),
    ),
    expected.gas.banco_bs,
  );
  check(
    "Gas julio · efectivo",
    sum(
      gas.filter((r) => r.clasificacion === "efectivo"),
      (r) => num(r.monto_bs, `gas fila ${r.__row}`),
    ),
    expected.gas.efectivo_bs,
  );
  check(
    "Gas julio · cuenta por cobrar",
    sum(
      gas.filter((r) => r.clasificacion === "cuenta_por_cobrar"),
      (r) => num(r.monto_bs, `gas fila ${r.__row}`),
    ),
    expected.gas.cxc_bs,
  );
}

// ---------------------------------------------------------------------------
// Locales
// ---------------------------------------------------------------------------

unique(locales, "local", "locales_julio.csv");

if (locales.length > 0 && locales.length !== expected.padron.locales) {
  warnings.push(
    `locales_julio.csv: ${locales.length} locales; se esperaban ${expected.padron.locales}`,
  );
}

for (const row of locales) {
  const label = `locales_julio.csv fila ${row.__row}`;
  num(row.cuota_usd, `${label} cuota_usd`);
  num(row.monto_bs, `${label} monto_bs`);
}

if (locales.length > 0) {
  check(
    "Locales julio · ingresos en Bs",
    sum(locales, (r) => num(r.monto_bs, `locales fila ${r.__row}`)),
    expected.locales.total_bs,
  );
}

// ---------------------------------------------------------------------------
// Egresos
// ---------------------------------------------------------------------------

for (const row of egresos) {
  const label = `egresos_julio.csv fila ${row.__row}`;
  if (!["condominio", "locales", "gas"].includes(row.cuenta)) {
    errors.push(`${label}: cuenta inválida "${row.cuenta}"`);
  }
  if (
    !["recibo_condominio", "cuenta_locales", "cuenta_gas", "fuera_recibo"].includes(
      row.imputado_a,
    )
  ) {
    errors.push(`${label}: imputado_a inválido "${row.imputado_a}"`);
  }
  num(row.monto_bs, `${label} monto_bs`);
  num(row.monto_usd, `${label} monto_usd`);
  num(row.tasa, `${label} tasa`);
}

if (egresos.length > 0) {
  check(
    "Egresos julio · flujo bancario en Bs",
    sum(egresos, (r) => num(r.monto_bs, `egresos fila ${r.__row}`)),
    expected.egresos.flujo_banco_bs,
  );
  check(
    "Egresos julio · imputados al recibo (USD)",
    sum(
      egresos.filter((r) => r.imputado_a === "recibo_condominio"),
      (r) => num(r.monto_usd, `egresos fila ${r.__row}`),
    ),
    expected.egresos.recibo_condominio_usd,
  );
}

// ---------------------------------------------------------------------------
// Salida
// ---------------------------------------------------------------------------

console.log(
  `\nLUMA · validación de seed (cobranza ${expected.cobranza.periodo} · julio ${expected.gas.periodo})`,
);
console.log(`Directorio: ${rel(dataDir)}`);
console.log(
  `Filas: aptos=${aptos.length} personas=${personas.length} cobranza=${cobranza.length} gas=${gas.length} locales=${locales.length} egresos=${egresos.length}\n`,
);

if (aptos.length === 0 && personas.length === 0) {
  warnings.push("Las plantillas están vacías; solo se validó la estructura.");
}

if (checks.length) {
  console.log("CUADRES");
  for (const item of checks) console.log(`  ✔ ${item}`);
  console.log("");
}

if (warnings.length) {
  console.log(`ADVERTENCIAS (${warnings.length})`);
  for (const item of warnings) console.log(`  ! ${item}`);
  console.log("");
}

if (errors.length) {
  console.log(`ERRORES (${errors.length})`);
  for (const item of errors) console.log(`  ✘ ${item}`);
  console.log("");
  process.exit(1);
}

console.log("Resultado: OK\n");
