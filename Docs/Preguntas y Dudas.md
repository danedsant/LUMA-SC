# Preguntas y Dudas — LUMA

> **Documento único y vigente.** Reemplaza la versión anterior de `Preguntas y Dudas.md` y el archivo `Preguntas y Dudas- actualizado.md`. Consolida las 52 preguntas (P-01 a P-52), las respuestas informales de la contraparte, las decisiones registradas en [`LUMA.md`](LUMA.md) §8 y los pendientes de validación posterior (V-01 a V-10).
>
> El resumen de 23 preguntas bloqueantes de las versiones anteriores quedó **obsoleto**. Hoy no hay bloqueantes para modelar o implementar; P-40 sí bloquea publicar listas de morosos hasta revisar el marco legal.

| Campo | Valor |
|---|---|
| Documento | Registro único de preguntas, respuestas, dudas abiertas y puntos a validar |
| Fecha de consolidación | 21/10/2026 |
| Destinatarios | Junta de Condominio · Lcda. Jheizzi Bethermy (contadora) · Asesor Académico |
| Fuentes | Notas de reunión, escaneos `Docs/Scaneos/Reunion 19-08/`, respuestas informales de la contraparte y verificaciones aritméticas |
| Regla | Toda respuesta nueva se registra aquí y se refleja en `LUMA.md` §8/§8.2 |

**Estados:** `Cerrada` (respondida y aplicada) · `Provisional` (se implementa y se valida después) · `Condicional` (requiere seguimiento) · `Abierta` (no bloqueante) · `Pendiente V-xx` (dato cargado provisionalmente, requiere confirmación).

## Resumen

| Estado | Cantidad | IDs |
|---|---|---|
| Cerradas | 39 | P-01, P-03, P-04, P-05, P-10, P-12, P-14, P-15, P-16, P-17, P-18, P-19, P-20, P-21, P-22, P-24, P-27, P-28, P-29, P-30, P-32, P-34, P-35, P-36, P-37, P-38, P-39, P-41, P-42, P-43, P-44, P-45, P-46, P-47, P-48, P-49, P-50, P-51, P-52 |
| Provisionales | 3 | P-02, P-07, P-08 |
| Condicionales | 2 | P-09, P-13 |
| Abiertas | 8 | P-06, P-11, P-23, P-25, P-26, P-31, P-33, P-40 |
| Pendientes de validación | 10 | V-01 a V-10 (ver sección final) |

**Prioridad de consulta:** V-01, V-02, V-03 y V-05 con la contadora/Junta; V-04, V-06 a V-10 pueden resolverse por escrito con el Excel de respaldo.

---

## A. Padrón, apartamentos y alícuotas

| ID | Pregunta | Respuesta actualizada | Estado |
|---|---|---|---|
| P-01 | ¿Cuántos apartamentos son realmente? | **101**: 8 por piso × 12 pisos + 5 en planta baja. El "91" inicial se descarta. | Cerrada |
| P-02 | ¿La cuota se calcula como alícuota × egresos del mes? | Verificada aritméticamente (1.088,03 USD × 0,982140 % = 10,69 y × 0,998545 % = 10,86). Falta firma de la contadora. | Provisional |
| P-03 | ¿La alícuota es fija o se recalcula? | Fija y constante por apartamento. | Cerrada |
| P-04 | ¿Impares con balcón? ¿Aplica a PB? | Impares con balcón (0,998545 %); pares y toda la planta baja sin balcón (0,982140 %). | Cerrada |
| P-05 | ¿Los vacíos pagan? | Sí, sin exenciones ni descuentos por antigüedad. | Cerrada |
| P-06 | Montos atípicos en la cuota (aptos 48, 105, 106, 121) | Se registran como ajuste con motivo (`monto_ajustado_usd`); validar con la contadora. | Abierta |

## B. Saldos y conciliación de egresos

| ID | Pregunta | Respuesta actualizada | Estado |
|---|---|---|---|
| P-07 | ¿Por qué no cuadran los dos reportes de egresos? | Recibo = gastos imputables; banco = flujo real (gas, ascensor 0908, cuenta por cobrar). Se implementa como provisional (D-05). | Provisional |
| P-08 | ¿Qué significa el saldo negativo? | Crédito a favor. Los ajustes de centavos se validan caso por caso; hay 17 filas con diferencias ≤ 1,33 USD (V-07). | Provisional |
| P-09 | ¿El "condominio extemporáneo" (71.472,76) se depositó en el mismo mes? | Se pagó aparte. Clasificación provisional: julio → `banco` (658.073,86) y agosto → `extemporaneo` (82.728,44). La diferencia simétrica de 11.255,68 Bs con el reporte (669.329,54 / 71.472,76) es el corte recibos/banco y queda pendiente (V-01). | Condicional |
| P-10 | ¿El cruce de cuentas (6.333,60) es un pago? | Sí: descuento por reparación o servicio realizado por un residente. | Cerrada |
| P-11 | ¿La cuenta por cobrar administración (9.795,00) es un traspaso? | Sin respuesta. La arquitectura la vincula a la Ref. 877422 del 08/08/2026. | Abierta |
| P-12 | ¿Tasa promedio o tasa del día? | Tasa BCV del día del pago, guardada por transacción. | Cerrada |
| P-13 | ¿Qué hacer con la referencia 668374 no reportada? | Bandeja de pagos por validar; puede no reflejarse en el sistema. | Condicional |

## C. Fechas, pagos y políticas

| ID | Pregunta | Respuesta actualizada | Estado |
|---|---|---|---|
| P-14 | ¿Fecha límite y mora del condominio y del gas? | Condominio: 15 días después del recibo. Gas: la define el administrador. | Cerrada |
| P-15 | ¿Se acepta un pago sin fecha visible? | Se confirma y se registra la fecha real del pago. | Cerrada |
| P-16 | ¿Cómo validar referencias fuera de plazo o cuentas personales? | Se guarda la referencia y se confirma manualmente antes de trasladarla. | Cerrada |
| P-17 | ¿Cómo se registra un pago devuelto? | Se anula el original y se revierte el saldo. | Cerrada |
| P-18 | ¿Se permiten abonos en cuotas? | Sí. | Cerrada |
| P-19 | ¿Quién aprueba los descuentos por servicios? | La administración. | Cerrada |

## D. Gas

| ID | Pregunta | Respuesta actualizada | Estado |
|---|---|---|---|
| P-20 | ¿La cuota de gas es fija o por consumo? | Modalidad configurable por periodo: fija, consumo prorrateado o manual. | Cerrada |
| P-21 | ¿Qué significa "CON APTO 28" y "CON CONDOMINIO"? | Pago compartido. | Cerrada |
| P-22 | ¿Los blancos de la lista de gas son impagos? | Son impagos dentro de los 58; la lista solo incluye a quienes pagan. | Cerrada |
| P-23 | ¿La diferencia recaudado vs pagado al proveedor es reserva o flete? | Investigar si es reserva o flete. | Abierta |
| P-24 | ¿Consumo o cuota fija? ¿Quién define los 58? | Configurable; solo pagan los apartamentos con servicio de gas. | Cerrada |

## E. Locales comerciales

| ID | Pregunta | Respuesta actualizada | Estado |
|---|---|---|---|
| P-25 | ¿A qué cuenta va la mano de obra del ascensor (67.108,00)? | Existen dos cuentas (locales y condominio); la imputación exacta está pendiente. | Abierta |
| P-26 | ¿Qué gastos de locales entran al recibo de condominio? | Clasificación cerrada pendiente. | Abierta |
| P-27 | ¿Con qué tasa se convierten las cuotas de locales? | Tasa BCV del día; las cuotas se presentan en USD y el propietario las convierte. | Cerrada |
| P-28 | ¿Quién es el encargado de cada local? | El administrador; sin rol propio en el sistema. | Cerrada |
| P-29 | ¿Impermeabilización y compra de divisa son cuotas especiales? | Impermeabilización = cuota especial; compra de divisa = movimiento interno. | Cerrada |

## F. Comunicación y averías

| ID | Pregunta | Respuesta actualizada | Estado |
|---|---|---|---|
| P-30 | ¿Quién publica en la cartelera? | Personal administrativo. | Cerrada |
| P-31 | ¿Se envían anuncios por correo/WhatsApp? | Los recibos y reportes se publican por WhatsApp de forma manual; no hay integración automática. | Abierta |
| P-32 | ¿Categorías oficiales de averías? | Sin clasificación fija; categoría libre. | Cerrada |
| P-33 | ¿El reporte de avería es identificado o anónimo? | Anonimato opcional; el detalle de la vista pública se define al implementar. | Abierta |
| P-34 | ¿Se requiere historial de averías resueltas? | Sí. | Cerrada |

## G. Usuarios e identidad

| ID | Pregunta | Respuesta actualizada | Estado |
|---|---|---|---|
| P-35 | ¿Cómo se identifica cada vecino? | Por cédula. | Cerrada |
| P-36 | ¿Un apartamento puede tener varios usuarios? | Solo el propietario tiene cuenta. | Cerrada |
| P-37 | ¿La contadora externa tendrá acceso? | Sí, solo lectura. | Cerrada |
| P-38 | ¿Uno o varios administradores? | Un solo tipo de usuario administrativo. | Cerrada |
| P-39 | ¿Se verifica que pague el dueño? | No se exige. | Cerrada |

## H. Marco legal

| ID | Pregunta | Respuesta actualizada | Estado |
|---|---|---|---|
| P-40 | ¿Qué artículos de la Ley de Propiedad Horizontal impactan? | Investigar el reglamento del condominio, especialmente la mora. Bloquea publicar morosos hasta revisarlo. | Abierta |
| P-41 | ¿Se publica el reglamento completo? | Sí, si no es excesivamente largo. | Cerrada |
| P-42 | ¿Qué datos personales se muestran en reportes públicos? | Solo número de apartamento y monto de la deuda. | Cerrada |

## I. Aspectos técnicos

| ID | Pregunta | Respuesta actualizada | Estado |
|---|---|---|---|
| P-43 | ¿Qué stack tecnológico se usará? | TypeScript + PostgreSQL/JSONB; Next.js + Supabase. | Cerrada |
| P-44 | ¿Dónde se despliega y quién paga? | Vercel + Supabase Free; prevalece la arquitectura (D-11). | Cerrada |
| P-45 | ¿Se necesita dominio propio? | No; URL gratuita. | Cerrada |
| P-46 | ¿Cómo se importan los históricos? | Captura inicial del mes y carga del histórico desde los CSV. | Cerrada |
| P-47 | ¿Se requiere modo offline? | Sí, solo lectura; las escrituras requieren conexión. | Cerrada |
| P-48 | ¿Quién mantiene el sistema al final? | Sin soporte; traspaso documentado (D-18). | Cerrada |

## J. Proceso y plazos

| ID | Pregunta | Respuesta actualizada | Estado |
|---|---|---|---|
| P-49 | ¿Se aplicó la encuesta vecinal? | No; se usarán los datos de residentes existentes. | Cerrada |
| P-50 | ¿Se mantiene el cronograma? | Sí, las fechas académicas se mantienen. | Cerrada |
| P-51 | ¿Orden prioritario de módulos? | No hay orden impuesto; lo define el equipo. | Cerrada |
| P-52 | ¿Quién valida los documentos? | Asesor académico, asesor comunitario y Junta. | Cerrada |

---

## Pendientes de validación posterior (V-01 a V-10)

> Datos que hoy se cargan de forma provisional. Al resolverse, actualizar esta tabla, `LUMA.md` §7.1/§8.2 y, solo con decisión registrada, `data/expected-base-2026.json`.

| ID | Tema | Dato registrado (21/10/2026) | Qué falta / decisión | Impacto |
|---|---|---|---|---|
| V-01 | Reparto banco/extemporáneo (P-09) | Cobranza junio: julio → `banco` **658.073,86 Bs**; agosto → `extemporaneo` **82.728,44 Bs**. Reporte: **669.329,54** y **71.472,76**. Diferencia simétrica **11.255,68 Bs** | Confirmar el corte recibos/banco con el Excel o estado de cuenta | El validador marca 2 diferencias; el total **753.635,90** no cambia |
| V-02 | Apto 67 ausente | No aparece en la relación de cobranza (100 de 101 filas) | Confirmar si no se emitió recibo o si falta la fila | Cobranza y saldo inicial del apto 67 |
| V-03 | Gas 55 vs 58 | `gas_julio.csv` tiene **55** filas; el padrón espera **58** con servicio | Identificar los 3 apartamentos sin fila (impago, exento o error del reporte) | Advertencia del validador; cuota de gas |
| V-04 | Apto 116 gas | Clasificado `cuenta_por_cobrar` por **4.390,03 Bs** | Confirmar si es cobro pendiente o pago | Total de gas (hoy cuadra con CxC) |
| V-05 | `personas.csv` | Vacío: los escaneos no traen nombres ni cédulas | Obtener titulares o acordar cargar el padrón sin datos personales | Módulo de padrón, recibos y notificaciones |
| V-06 | Saldo anterior del reporte | Suma de filas **1.627,92** vs. impreso **1.594,22** (+33,70). Pagos USD **991,07** vs. **991,09** (−0,02); saldo actual **1.598,67** vs. **1.598,66** (+0,01) | Verificar con el Excel si el total impreso o alguna celda está mal | Saldos iniciales por apartamento |
| V-07 | Ajustes de centavos (P-08) | 17 filas con diferencia ≤ 1,33 USD entre saldo mostrado y fórmula | Definir si se registran como ajuste/redondeo o se corrige el escaneo | Saldo actual y recibo |
| V-08 | Columna `activo` en `aptos.csv` | Columna extra no prevista en la plantilla | Eliminarla o incorporarla al modelo/validador | Advertencia del validador |
| V-09 | Cuotas atípicas (P-06) | Aptos 48, 105, 106 y 121 con montos fuera del patrón | Confirmar el tratamiento como `monto_ajustado_usd` | Recibos de esos apartamentos |
| V-10 | Fechas con rango | Filas 25 (`04-30/07`), 35 (`06-29/07`) y 86 (`7/11-01/08`); fila 36 con `5/8/26` | Confirmar la fecha real de aplicación al banco | Clasificación banco/extemporáneo (V-01) |

## Estado de los datos base

- 10 cuadres exactos: cobranza (pagos en Bs, efectivo y cruce), gas, locales y egresos.
- 2 diferencias conocidas: banco y extemporáneo de cobranza (V-01).
- 19 advertencias menores: 17 ajustes de centavos (V-07), columna `activo` (V-08) y gas 55/58 (V-03).
- `personas.csv` vacío (V-05) y apto 67 ausente en la cobranza (V-02).

## Cambios respecto a versiones anteriores

- Se eliminó el listado de "23 preguntas bloqueantes": ya no aplica.
- Se incorporaron las respuestas informales de la contraparte y las decisiones D-01 a D-21 de `LUMA.md`.
- Se agregó el seguimiento V-01 a V-10 para los datos cargados de forma provisional.
