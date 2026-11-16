# Datos de carga inicial — LUMA

Este directorio contiene las plantillas para transcribir los reportes de julio 2026 y el validador de cuadres. La fuente son los escaneos de `documentacion/Docs/Scaneos/Reunion 19-08/`.

## Estructura

```text
documentacion/data/
├── expected-base-2026.json      Totales de control (cobranza junio + julio)
├── templates/                   Plantillas vacías (no editar con datos reales)
├── base-2026/                   Copia de trabajo con los datos transcritos
└── README.md
documentacion/scripts/
└── validate-seed.mjs            Validador de estructura y cuadres
```

Periodos: **cobranza de junio 2026**; **gas, locales, egresos e ingresos de julio 2026**.

## Uso

1. Copiar las plantillas a `documentacion/data/base-2026/`.
2. Para datos personales, usar `documentacion/data/base-2026/personas.csv` solo en local (ignorado por git); el repo versiona `personas.example.csv` como referencia.
3. Transcribir los datos desde los JPG, manteniendo los encabezados exactos.
4. Ejecutar:

```bash
node documentacion/scripts/validate-seed.mjs documentacion/data/base-2026
```

Para validar solo la estructura de las plantillas:

```bash
node documentacion/scripts/validate-seed.mjs
```

## Formato

- Codificación UTF-8, separador coma, sin filas vacías.
- Decimales con punto (`10.69`), sin separador de miles.
- Fechas en `AAAA-MM-DD`.
- Booleanos: `true`/`false`.
- `balcon`: `true` solo para apartamentos impares; toda planta baja es `false`.
- `alicuota`: `0.00998545` con balcón; `0.00982140` sin balcón.
- `clasificacion` en cobranza: `banco`, `efectivo`, `cruce` o `extemporaneo`.
- `clasificacion` en gas: `banco`, `efectivo`, `cuenta_por_cobrar` o `pendiente`.
- `imputado_a` en egresos: `recibo_condominio`, `cuenta_locales`, `cuenta_gas` o `fuera_recibo`.

## Totales de control (julio 2026)

| Concepto | Valor |
|---|---|
| Recibo de condominio (julio) | 1.088,03 USD |
| Cobranza junio · total | 753.635,90 Bs |
| Cobranza junio · banco | 669.329,54 Bs |
| Cobranza junio · efectivo | 6.500,00 Bs |
| Cobranza junio · cruce de cuentas | 6.333,60 Bs |
| Cobranza junio · extemporáneo | 71.472,76 Bs |
| Gas julio · total | 223.512,85 Bs |
| Gas julio · banco | 214.822,82 Bs |
| Gas julio · efectivo | 4.300,00 Bs |
| Gas julio · cuenta por cobrar | 4.390,03 Bs |
| Locales julio · ingresos | 119.790,84 Bs |
| Egresos julio · flujo bancario | 995.391,42 Bs |
| Ingresos julio · bancarios | 1.054.804,61 Bs |
| Ingresos julio · otros | 17.133,60 Bs |
| Ingresos julio · total | 1.071.938,21 Bs |

Estos valores están en `expected-base-2026.json` y el validador los usa cuando hay filas de datos.

**Estado actual de `base-2026/`:** padrón, cobranza de junio, gas, locales y egresos transcritos. El validador cierra con **0 errores y 13 cuadres**; quedan solo advertencias conocidas (V-01, V-02, V-03, V-05 y los 17 ajustes de centavos). Faltan `personas.csv` y la confirmación del corte banco/extemporáneo.

## Excepciones conocidas (validadas como advertencia)

El validador distingue errores reales de diferencias ya documentadas. Estas se declaran en `expected-base-2026.json` y no rompen la validación:

| Campo | Valor | Motivo |
|---|---|---|
| `padron.cobranza_filas` | `100` | El reporte trae 100 de 101 apartamentos |
| `padron.cobranza_sin_fila` | `["67"]` | V-02: el apto 67 no aparece en la cobranza |
| `padron.gas_faltantes` | `3` | V-03: 55 filas de gas frente a 58 con servicio |
| `cobranza.clasificacion_provisional` | banco `658.073,86` · extemporáneo `82.728,44` · Δ `11.255,68` | V-01: corte recibos/banco pendiente de la contadora |
| `cobranza.ajustes` | `17` filas, máximo `1,33` USD | V-07/P-08: diferencias de centavos del reporte |

Los totales impresos (`banco 669.329,54` y `extemporáneo 71.472,76`) **no se modifican**: el validador verifica el total duro (753.635,90) y la suma de componentes, y reporta el corte V-01 como advertencia. Al confirmar la contadora, actualizar ambos valores y retirar la excepción.

## Conciliación de cobranza junio 2026

Verificadas las 100 filas contra `1.jpg` y `2.jpg` (el apto 67 no aparece en el reporte):

- Pagos en Bs: **753.635,90** ✔ (coincide con el total impreso).
- Cuota en USD: **964,43** ✔.
- Correcciones aplicadas: apto 21 (cuota Bs `6.707,91`, pagos `6.738,00`, ref. `936340`, tasa `700,22`), apto 22 (pagos `6.738,00`), apto 77 (tasa vacía), apto 105 (cuota y saldo `0,00`) y apto 125 (cuota `9,49`).
- Diferencias que provienen del reporte, no de la transcripción: saldo anterior **1.627,92** vs. impreso **1.594,22** (+33,70); pagos USD **991,07** vs. **991,09** (−0,02); saldo actual **1.598,67** vs. **1.598,66** (+0,01).
- Clasificación provisional por fecha: julio → `banco` (**658.073,86 Bs**) y agosto → `extemporaneo` (**82.728,44 Bs**). El reporte imprime **669.329,54** y **71.472,76**: la diferencia simétrica de **11.255,68 Bs** corresponde al corte entre recibos y banco (P-09) y está declarada en `expected-base-2026.json` (`cobranza.clasificacion_provisional`). No modificar los totales de control hasta que la contadora confirme ese corte.
- Los pendientes que requieren respuesta están consolidados en `documentacion/Docs/LUMA.md` §8.2 (V-01 a V-10).

## Datos provisionales

- **P-02** (cuota = alícuota × egresos), **P-07** (dos reportes de egresos) y **P-08** (saldo negativo) se cargan como provisionales.
- No sobrescribir la cuota base para montos atípicos: usar `saldo_anterior_usd`, `pagos_usd` o el ajuste correspondiente y documentar el motivo.
- Al confirmar las reglas con la contadora, recalcular el periodo y conservar la auditoría.

## Reglas

- No inventar apartamentos, propietarios ni montos. Si un dato no se lee en el JPG, dejarlo vacío y anotarlo para validación.
- No cargar datos reales en `templates/`; usar `base-2026/`.
- Los datos personales (cédula, teléfono, correo) no deben salir del repositorio ni de la base. No llenar `personas.csv` con datos reales en un repo público: usar `documentacion/data/personal/` (ignorado por git) o cargar directo a Supabase.
- La columna `activo` de `aptos.csv` es parte del modelo (V-08 resuelto) y se valida como booleano.
- Toda `planta_baja` (`PB-*`, piso 0) usa `tipo=planta_baja` y `balcon=false`.
