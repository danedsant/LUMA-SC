# Avance — LUMA (Documento central)

> **Documento consolidado:** el contenido canónico y las decisiones vigentes están en [`LUMA.md`](LUMA.md). Este archivo se mantiene como tablero de estado del proyecto.

| Campo | Valor |
|---|---|
| Proyecto | **LUMA** — Sistema de información web para la gestión comunicacional y el control de incidencias y cobranza |
| Comunidad | Conjunto Residencial La Churuata, Torre 4 — RIF J-31119491-6 |
| Programa | Servicio Comunitario UNEG — Ingeniería Informática, Sede Puerto Ordaz (120 h, 03/07/2026 – 30/10/2026) |
| Equipo | Daniel Villalba, Isabella Rodríguez, Luis Millán |
| Asesores | Académico: Prof. Germain Salazar Yépez · Comunitario: Lcda. Jheizzi Bethermy |
| Última actualización | 16/11/2026 |

---

## 1. Estado general

**Fase actual: Fase 4 (scaffold y migraciones) lista en código; falta conectar Supabase y Vercel** (Fases 0–3 cerradas).

**Cierre del 16/11/2026:** `node documentacion/scripts/validate-seed.mjs documentacion/data/base-2026` → **0 errores y 13 cuadres**. Se corrigieron los PB a `planta_baja`, se incorporó `activo` al modelo/validador (V-08) y V-01/V-02/V-03/V-07 quedaron como excepciones toleradas y documentadas. `personas.csv` sigue vacío por falta de datos (V-05). Detalle en [`Implementacion-2026-11-16.md`](Implementacion-2026-11-16.md).

**Fase 4 (16/11/2026):** app Next.js 16.4.6 + **Material UI v9** en la raíz, migraciones `supabase/migrations/` con RLS, vistas y auditoría, scripts `import-seed.mjs` y `verify-cuadres.mjs`; `npm run lint`, `npm run typecheck` y `npm run build` correctos, `npm audit` en 0. Skills de agentes integradas con `npx autoskills` (+ MUI Skills). Detalle en [`Implementacion-Fase-4.md`](Implementacion-Fase-4.md) y pendientes en [`Pendientes.md`](Pendientes.md).

| Documento | Estado | Descripción |
|---|---|---|
| [`LUMA.md`](LUMA.md) | ✅ Canónico | Alcance, requisitos, 52 preguntas, decisiones D-01 a D-25, arquitectura, modelo de datos y plan |
| [`Elicitacion.md`](Elicitacion.md) | 📚 Fuente | Fuentes, actores, hallazgos por dominio, reglas de negocio, cuadres aritméticos, gaps |
| [`Requisitos Funcionales .md`](<Requisitos Funcionales .md>) | ✅ Creado | 54 RF + 21 RNF organizados en 10 módulos, con trazabilidad |
| [`Alcance.md`](Alcance.md) | ✅ Creado | Alcance funcional y de datos, exclusiones, supuestos, dependencias, éxito |
| [`Preguntas y Dudas.md`](<Preguntas y Dudas.md>) | ✅ Consolidado | 52 preguntas + V-01 a V-10; sin bloqueantes para modelar (P-40 bloquea publicar morosos) |
| [`Implementacion-2026-11-16.md`](Implementacion-2026-11-16.md) | ✅ Fase 3 | Base 2026 congelada, validador sin errores y repo versionado |
| [`Implementacion-Fase-4.md`](Implementacion-Fase-4.md) | ✅ Fase 4 | Scaffold Next.js 16, migraciones Supabase, RLS, importador y verificador |
| [`Pendientes.md`](Pendientes.md) | 🔜 Tablero | Pendientes manuales, datos faltantes y deuda técnica priorizada |
| `documentacion/data/` + `documentacion/scripts/` | ✅ Congelado | 101 aptos, cobranza junio, gas, locales y egresos; validador sin errores (16/11/2026) |
| `Avance.md` | ✅ Este documento | Consolidado central |

**Fuentes de entrada** (no modificadas): `documentacion/Docs/Notas/*` (anteproyecto, reunión día 1, notas raw) y `documentacion/Docs/Scaneos/Reunion 19-08/*` (7 reportes administrativos y 1 nota manuscrita).

---

## 2. Qué es el sistema (consolidado)

Una **aplicación web responsive** que reemplaza el manejo manual en Excel y los grupos de WhatsApp de la Torre 4, con dos grandes bloques:

1. **Gestión comunicacional e incidencias**: cartelera digital (anuncios, normativas, recibos) y reporte de averías con estados y seguimiento.
2. **Gestión financiera y de cobranza** (el grueso real de los requisitos): cobranza de condominio por alícuota, cuota de gas aparte, locales comerciales con cuenta propia, verificación de comprobantes, histórico de saldos, impagos, ingresos/egresos y conciliación bancaria.

**Usuarios**: Junta/Administración · Propietarios e Inquilinos · Locales comerciales · Contador (solo lectura, a confirmar).

**Datos maestros (de los escaneos)**: Padrón de apartamentos (PB-x … 128, con/sin balcón), 5 locales (Peluquería 25 USD, Spa 40, Depósito 30, Repuestos Motos 50, Antena 60), 58 usuarios de gas, alícuotas 0,982140 % / 0,998545 %, cuentas Banco Del Sur `0157-0013-1337-1301-3013` y locales `0908`, correo oficial `admn.churuatatorre4@gmail.com`.

---

## 3. Alcance en una página (resumen de `Alcance.md`)

**Incluido (fase 1):** usuarios y roles · padrón · cartelera digital · averías · cobranza de condominio · cuota de gas · locales · ingresos/egresos y conciliación (parcial) · reportes y exportación · mensajes/notas/observaciones.

**Carga inicial:** histórico de pagos y saldos de junio 2026, más gas, locales, ingresos y egresos de julio 2026, desde los reportes Excel/JPG.

**Excluido:** pasarelas de pago, nómina/facturación, app nativa, telemetría de ascensores/cámaras, otras torres, facturación por consumo de agua/gas, reservas de áreas, asambleas electrónicas, reemplazo total de Excel.

**Supuestos clave:** la Junta entrega los Excel históricos y estados de cuenta; la cuota la define la Junta según egresos del mes; hay encuesta vecinal pendiente; hosting sin costo durante el proyecto.

---

## 4. Requisitos en una página (resumen de `Requisitos Funcionales .md`)

| Módulo | RF | Prioridad |
|---|---|---|
| A. Usuarios y acceso | RF-01 … RF-05 | M |
| B. Padrón | RF-06 … RF-09 | M |
| C. Cartelera digital | RF-10 … RF-13 | M/A |
| D. Reporte de averías | RF-14 … RF-18 | M/A |
| E. Cobranza de condominio | RF-19 … RF-30 | M (núcleo) |
| F. Cuota de gas | RF-31 … RF-35 | M |
| G. Locales comerciales | RF-36 … RF-40 | M/A |
| H. Ingresos/egresos y conciliación | RF-41 … RF-47 | M/A |
| I. Reportes y consultas | RF-48 … RF-52 | M/A |
| J. Mensajes, notas y observaciones | RF-53 … RF-54 | M |

**No funcionales destacados:** mobile-first (RNF-01), interfaz en español sin conocimientos técnicos (RNF-02), disponibilidad 99 % (RNF-04), < 3 s en móvil (RNF-05), seguridad/roles (RNF-07/08), respaldos (RNF-13), **reproducir los cuadres de los reportes Excel** (RNF-14), manual de usuario y capacitación (RNF-20).

---

## 5. Reglas de negocio confirmadas (resumen de `Elicitacion.md` §6)

1. Condominio y gas son cobros **separados**; el agua no llega a todos los apartamentos.
2. La cuota de condominio **varía cada mes** = alícuota del apartamento × egresos del mes *(hipótesis verificada aritméticamente, pendiente de confirmación — P-02)*.
3. Cada pago guarda **su propia tasa BCV** (depósitos entre 633 y 755 Bs/$ en julio 2026).
4. Saldos negativos, **extemporáneos**, **abonos en cuotas**, **pagos adelantados** y **descuentos por servicios** son escenarios reales y recurrentes.
5. Locales: ingresos a **cuenta propia (eventos)**, jamás en el recibo de condominio.
6. Todo movimiento interno debe **conciliarse** con el estado de cuenta bancario; el saldo real es el de la **última fila**.
7. Pagos devueltos, referencias sin fecha y transferencias por cuentas personales de administradores **requieren flujo de validación**.

### Cuadres financieros verificados (base de cualquier módulo)

| Conjunto | Resultado |
|---|---|
| Cobranza junio: 753.635,90 = 669.329,54 (banco) + 6.500 (efectivo) + 6.333,60 (cruce) + 71.472,76 (extemporáneo) | ✔ |
| Gas julio: 223.512,85 = 214.822,82 (banco) + 4.300 (efectivo) + 4.390,03 (cta/cobrar) | ✔ |
| Ingresos julio: 50.861,41 + 669.329,54 + 214.822,82 + 119.790,84 = 1.054.804,61 | ✔ |
| Alícuota: 1.088,03 USD × 0,982140 % = 10,69 · × 0,998545 % = 10,86 | ✔ |
| Dos reportes de egresos (995.391,42 Bs vs ≈ 709.599,72 Bs) | ✘ pendiente (P-07) |

---

## 6. Decisiones abiertas críticas

> **Actualizado en [`LUMA.md`](LUMA.md) §8 y §9.** Ya no hay bloqueantes para modelar o implementar. Quedan 3 reglas provisionales (P-02, P-07, P-08), 2 condicionales (P-09, P-13) y 8 abiertas no bloqueantes (P-06, P-11, P-23, P-25, P-26, P-31, P-33, P-40). La tabla siguiente es histórica.

| # | Pregunta | Bloquea |
|---|---|---|
| P-01 | Padrón real de apartamentos (96 vs lista hasta 128) | Modelo de datos |
| P-02 | Regla oficial de cálculo de la cuota (alícuota × egresos) | Módulo de cobranza |
| P-07 | Reporte de egresos oficial y diferencias entre los dos | Conciliación y reportes |
| P-08 | Significado de saldo negativo (crédito vs arrastre) | Saldos/histórico |
| P-12 | Tasa por pago vs tasa promedio mensual | Conversión Bs/USD |
| P-14/P-15/P-16 | Fecha límite, validación de capturas sin fecha y pagos fuera de plazo | Flujo de pagos |
| P-20/P-24 | Cuota de gas: fija 6,40 USD vs facturación por litros | Módulo de gas |
| P-35/P-36 | Identidad de los vecinos y usuarios por apartamento | Autenticación |
| P-43/P-44 | Stack tecnológico y hosting (no definidos en ningún doc) | Desarrollo |
| P-51 | Orden real de módulos: ¿histórico financiero primero? | Cronograma |

**Total: 52 preguntas — 23 🔴 bloqueantes, 25 🟡 importantes, 4 🔵 futuro.**

---

## 7. Cronograma vs. plan de trabajo

| Sem. | Plan (F3) | Estado |
|---|---|---|
| 1 (13–17/07) | Reunión inicial con la Junta | ✅ Realizada (acta 19/08/2026) |
| 2 (20–24/07) | Encuesta vecinal | ⚠️ No confirmada (P-49) |
| 3 (27–31/07) | **Levantamiento de requerimientos y especificación** | ✅ **Este avance** |
| 4 (03–07/08) | Modelado E-R y arquitectura | ⬜ Siguiente (requiere respuestas 🔴) |
| 5 (10–14/08) | Prototipos visuales mobile | ⬜ |
| 6 (17–21/08) | Usuarios, BD y autenticación | ⬜ |
| 7 (24–28/08) | Cartelera digital | ⬜ |
| 8 (31/08–04/09) | Reporte de averías | ⬜ |
| 9 (07–11/09) | Control de pagos | ⬜ |
| 10–11 (14–25/09) | Integración, pruebas de caja negra, correcciones | ⬜ |
| 12 (28/09–02/10) | Despliegue en servidor | ⬜ |
| 13 (05–09/10) | Carga de datos iniciales y piloto | ⬜ |
| 14 (12–16/10) | Manual rápido de usuario | ⬜ |
| 15 (19–23/10) | Entrega formal y carta de culminación | ⬜ |

> **Observación (16/11/2026):** la ventana académica 03/07–30/10/2026 ya venció y el software aún no se ha implementado; hay que replantear las fechas con los asesores conservando las dependencias de `LUMA.md` §13. La base 2026 ya está congelada y validada (Fase 3).

---

## 8. Próximos pasos

1. Replantear el cronograma con los asesores: la ventana 03/07–30/10/2026 ya venció.
2. ✅ Scaffold técnico (Fase 4): Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui en la raíz.
3. Crear el proyecto Supabase y ejecutar `npx supabase link` + `npm run db:push` (migraciones con RLS, vistas y auditoría ya escritas).
4. Ejecutar `npm run seed -- --admin-cedula=… --admin-password=…` y `npm run verify` usando `expected-base-2026.json` como prueba de cuadres.
5. Cargar `personas.csv`, los 3 aptos de gas y el apto 67 cuando la Junta entregue esos datos (V-02, V-03, V-05).
6. Implementar por dependencias: padrón → cobranza → gas → locales → egresos → cartelera/averías → reportes (Fase 5).
7. Ejecutar el mes de operación en paralelo con Excel y el traspaso de cuentas (D-18, D-20).
