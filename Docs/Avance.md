# Avance — LUMA (Documento central)

| Campo | Valor |
|---|---|
| Proyecto | **LUMA** — Sistema de información web para la gestión comunicacional y el control de incidencias y cobranza |
| Comunidad | Conjunto Residencial La Churuata, Torre 4 — RIF J-31119491-6 |
| Programa | Servicio Comunitario UNEG — Ingeniería Informática, Sede Puerto Ordaz (120 h, 03/07/2026 – 30/10/2026) |
| Equipo | Daniel Villalba, Isabella Rodríguez, Luis Millán |
| Asesores | Académico: Prof. Germain Salazar Yépez · Comunitario: Lcda. Jheizzi Bethermy |
| Última actualización | 27/09/2026 |

---

## 1. Estado general

**Fase actual: Levantamiento y definición de requerimientos** (semana 3 del plan de trabajo).

| Documento | Estado | Descripción |
|---|---|---|
| [`Elicitacion.md`](Elicitacion.md) | ✅ Creado | Fuentes, actores, hallazgos por dominio, reglas de negocio, cuadres aritméticos, gaps |
| [`Requisitos Funcionales .md`](<Requisitos Funcionales .md>) | ✅ Creado | 54 RF + 21 RNF organizados en 10 módulos, con trazabilidad |
| [`Alcance.md`](Alcance.md) | ✅ Creado | Alcance funcional y de datos, exclusiones, supuestos, dependencias, éxito |
| [`Preguntas y Dudas.md`](<Preguntas y Dudas.md>) | ✅ Creado | 52 preguntas (23 🔴 bloqueantes) a resolver antes de continuar |
| `Avance.md` | ✅ Este documento | Consolidado central |

**Fuentes de entrada** (no modificadas): `Docs/Notas/*` (anteproyecto, reunión día 1, notas raw) y `Docs/Scaneos/Reunion 19-08/*` (7 reportes administrativos marcados "Base de datos ①②③").

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

**Carga inicial:** histórico de pagos, saldos, gas, ingresos y egresos desde los reportes Excel, con base en julio 2026.

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
| Cobranza julio: 753.635,90 = 669.329,54 (banco) + 6.500 (efectivo) + 6.333,60 (cruce) + 71.472,76 (extemporáneo) | ✔ |
| Gas julio: 223.512,85 = 214.822,82 (banco) + 4.300 (efectivo) + 4.390,03 (cta/cobrar) | ✔ |
| Ingresos julio: 50.861,41 + 669.329,54 + 214.822,82 + 119.790,84 = 1.054.804,61 | ✔ |
| Alícuota: 1.088,03 USD × 0,982140 % = 10,69 · × 0,998545 % = 10,86 | ✔ |
| Dos reportes de egresos (995.391,42 Bs vs ≈ 709.599,72 Bs) | ✘ pendiente (P-07) |

---

## 6. Decisiones abiertas críticas (de `Preguntas y Dudas.md`)

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

> **Observación:** los entregables de las semanas 3–5 se concentran hoy; el cronograma requiere replanificación o recuperación de atraso (P-50). Hoy es 27/09/2026 (semana 12 del plan original).

---

## 8. Próximos pasos

1. **Reunión de desbloqueo** con Junta + contador sobre P-01, P-02, P-07, P-20 y P-51.
2. Resolver por escrito el resto de preguntas 🔴 con la Lcda. Jheizzi Bethermy.
3. Aplicar (o confirmar como no aplicable) la **encuesta vecinal** (P-49).
4. Ejecutar la **semana 4** del plan: modelo Entidad-Relación y arquitectura, tomando como base los escaneos "Base de datos ①②③".
5. Definir **stack y hosting** (P-43, P-44) antes de prototipar.
6. Actualizar este documento con cada avance; cada cambio de alcance o requisito debe reflejarse primero en su documento de origen y luego aquí.
