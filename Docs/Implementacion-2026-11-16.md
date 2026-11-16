# Implementación — 16/11/2026

> **Documento de cierre de jornada.** Registra qué se encontró, qué se cambió, cómo se verificó y qué queda pendiente. Complementa [`LUMA.md`](LUMA.md) §12–§13 y el tablero [`Avance.md`](Avance.md).

| Campo | Valor |
|---|---|
| Fecha | 16/11/2026 |
| Fase | Cierre de Fase 3 (base 2026 + validador) |
| Alcance | Congelar la base de datos inicial, eliminar errores del validador y versionar el repo |
| Resultado | `validate-seed.mjs` → **0 errores, 13 cuadres, 6 advertencias conocidas** |

---

## 1. Estado encontrado

| Área | Hallazgo |
|---|---|
| Documentación | `LUMA.md` v1.0 consolidado; cambios sin commitear y `Docs/Preguntas y Dudas- actualizado.md` borrado |
| Datos | 101 aptos, 100 cobranza, 55 gas, 5 locales, 19 egresos; `personas.csv` vacío |
| Validador | 2 errores (V-01) y 19 advertencias; PB con `tipo=apartamento`; columna `activo` no reconocida |
| Código | Sin `package.json` ni scaffold; `.gitignore` vacío (0 bytes) |
| Entorno | Node v25.9.0, npm 11.12.1; `gh` no instalado |

## 2. Cambios realizados

### 2.1 Repositorio

- Se creó `.gitignore` con reglas para Node/Next.js, entornos (`.env*`), Vercel, Supabase local, `data/personal/` (datos personales, RNF-09) y archivos de sistema.
- Se verificó que los CSV actuales no contienen cédulas, teléfonos ni correos.
- Se versionaron `data/` y `scripts/` (antes sin trackear).

### 2.2 Datos (`data/base-2026/`)

- `aptos.csv`: los 5 apartamentos de planta baja (`PB-2`, `PB-3`, `PB-5`, `PB-6`, `PB-7`) pasaron de `tipo=apartamento` a `tipo=planta_baja`; conservan `balcon=false` y alícuota `0.00982140`.
- `data/templates/aptos.csv`: se agregó la columna `activo` al encabezado.
- No se modificó ningún monto, referencia ni total.

### 2.3 Totales de control (`data/expected-base-2026.json`)

Se añadieron excepciones explícitas para distinguir diferencias conocidas de errores reales:

| Campo | Valor |
|---|---|
| `padron.cobranza_filas` | `100` |
| `padron.cobranza_sin_fila` | `["67"]` (V-02) |
| `padron.gas_faltantes` | `3` (V-03) |
| `cobranza.clasificacion_provisional` | banco `658.073,86`, extemporáneo `82.728,44`, Δ `11.255,68` (V-01) |
| `cobranza.ajustes` | `17` filas, máximo `1,33` USD (V-07/P-08) |

Los totales impresos (`banco 669.329,54` y `extemporáneo 71.472,76`) **no se alteraron**.

### 2.4 Validador (`scripts/validate-seed.mjs`)

| Cambio | Efecto |
|---|---|
| `activo` obligatorio en `aptos.csv` y validado como booleano | Cierra V-08 |
| Chequeo de filas de cobranza y apartamentos sin fila | Apto 67 sale como advertencia; cualquier otro faltante es error |
| V-01 contra valores provisionales + verificación de `banco + efectivo + cruce + extemporáneo = total` | El corte queda tolerado, pero el total sigue siendo un check duro |
| Ajustes de centavos acotados (`≤ 1,33` USD, 17 filas) | Una diferencia mayor se reporta como error |
| Advertencia explícita si `personas.csv` está vacío con padrón cargado | V-05 visible, no silenciosa |
| Advertencia de gas con conteo faltante | V-03 trazable |

### 2.5 Documentación

- `Docs/LUMA.md`: D-22 registrada; V-08 resuelta en §8.2; V-05/V-07 anotadas; nota de estado en §12.2; Fase 3 marcada como cerrada en §13.
- `Docs/Avance.md`: fecha, estado de fase, tabla de documentos, observación de cronograma vencido y nuevos próximos pasos.
- `data/README.md` y `data/base-2026/README.md`: estado real, tabla de excepciones conocidas, regla de PB y regla de datos personales.

## 3. Verificación

```bash
node scripts/validate-seed.mjs data/base-2026
```

Resultado:

```text
Filas: aptos=101 personas=0 cobranza=100 gas=55 locales=5 egresos=19

CUADRES (13)
  ✔ Cobranza junio · pagos en Bs: 753.635,90
  ✔ Cobranza junio · efectivo: 6.500,00
  ✔ Cobranza junio · cruce: 6.333,60
  ✔ Cobranza junio · suma de componentes: 753.635,90
  ✔ Cobranza junio · banco (provisional V-01): 658.073,86
  ✔ Cobranza junio · extemporáneo (provisional V-01): 82.728,44
  ✔ Gas julio · monto en Bs: 223.512,85
  ✔ Gas julio · banco: 214.822,82
  ✔ Gas julio · efectivo: 4.300,00
  ✔ Gas julio · cuenta por cobrar: 4.390,03
  ✔ Locales julio · ingresos en Bs: 119.790,84
  ✔ Egresos julio · flujo bancario en Bs: 995.391,42
  ✔ Egresos julio · imputados al recibo (USD): 1.088,02

ADVERTENCIAS (6)
  ! personas.csv vacío (V-05)
  ! apto 67 sin fila (V-02: excepción conocida)
  ! corte V-01 (Δ 11.255,68 Bs)
  ! 17 ajustes de centavos ≤ 1,33 USD (V-07/P-08)
  ! filas con ajuste: 3, 8, 13, 15, 19, 20, 27, 36, 39, 42, 45, 53, 59, 61, 64, 74, 77
  ! gas 55 de 58 (V-03)

Resultado: OK
```

```bash
node scripts/validate-seed.mjs
```

Resultado: estructura de plantillas OK (solo advertencia de plantillas vacías).

## 4. Decisiones tomadas

- **D-22:** se congela la base 2026 con las excepciones declaradas; los totales impresos no se tocan y el corte V-01 espera a la contadora.
- V-08 se cierra conservando `activo` en modelo, plantilla y validador.
- `personas.csv` permanece vacío: la Junta no puede entregar los datos por ahora (V-05).

## 5. Pendientes

| ID | Pendiente | Bloquea |
|---|---|---|
| V-01 | Confirmar el corte banco/extemporáneo con la contadora | Clasificación definitiva de cobranza |
| V-02 | Confirmar el apto 67 | Recibo y saldo inicial del 67 |
| V-03 | Identificar los 3 aptos de gas sin fila | Cuota de gas completa |
| V-04 | Confirmar la CxC del apto 116 | Total de gas |
| V-05 | Obtener cédulas/nombres de titulares | Padrón, recibos y notificaciones |
| V-06/V-07 | Validar saldo anterior y ajustes de centavos | Saldos iniciales |
| V-09/V-10 | Cuotas atípicas y fechas con rango | Recibos y clasificación |

## 6. Siguiente fase (Fase 4)

1. Replantear el cronograma con los asesores (ventana 03/07–30/10/2026 vencida).
2. Crear el scaffold Next.js (App Router) + TypeScript + Tailwind + shadcn/ui.
3. Crear el proyecto Supabase y migrar el modelo de `LUMA.md` §11 (enums, tablas, vistas, RLS y auditoría).
4. Importar el seed validado y usar `expected-base-2026.json` como prueba automática de cuadres.
5. Continuar con los módulos en el orden de `LUMA.md` §13.1.
