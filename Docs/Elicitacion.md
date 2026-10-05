# Elicitación de Requisitos — LUMA

| Campo | Valor |
|---|---|
| Proyecto | LUMA — Sistema de información web para la gestión comunicacional y el control de incidencias / cobranza |
| Comunidad | Conjunto Residencial La Churuata, Torre 4 — RIF J-31119491-6 (Carrera Milán, Parque Residencial Churuata, Pdo. Caroní, Estado Bolívar) |
| Documento | Elicitación de requisitos (estado actual) |
| Fecha | 27/09/2026 |
| Elaborado por | Equipo de Servicio Comunitario UNEG (Daniel Villalba, Isabella Rodríguez, Luis Millán) |

---

## 1. Objetivo del documento

Consolidar **todo lo capturado de las fuentes disponibles** (notas de reunión, notas crudas, anteproyecto y escaneos de reportes administrativos) sin interpretarlo aún como especificación. Es la materia prima de `Requisitos Funcionales .md`, `Alcance.md` y `Preguntas y Dudas.md`.

---

## 2. Fuentes de información

| # | Fuente | Tipo | Contenido clave |
|---|---|---|---|
| F1 | `Docs/Notas/Notas Reunion - Dia 1 .md` | Reunión con la Junta (19/08/2026, correspondiente a semana 1 del plan) | Alcance funcional declarado, conceptos de pago, pendientes |
| F2 | `Docs/Notas/Notas Raw .md` | Notas crudas previas/posteriores a la reunión | Reglas de negocio sueltas, casos especiales |
| F3 | `Docs/Notas/Servicio Comunitario - Anteproyecto - FInal .md` | Documento oficial UNEG | Diagnóstico, objetivos, resultados esperados, plan de trabajo 15 semanas |
| F4 | `Docs/Scaneos/Reunion 19-08/1.jpg`, `2.jpg` | **Relación de Cobranzas** (marcado a mano "Base de datos ①") | Padrón, cuotas, pagos, referencias, tasas, saldos, totales |
| F5 | `Docs/Scaneos/Reunion 19-08/3.jpg` | **Relación de Pagos de Servicio de Gas** ("Base de datos ②") | Pagos de gas por apartamento |
| F6 | `Docs/Scaneos/Reunion 19-08/4.jpg` | Nota manuscrita | Contacto asesora comunitaria; tareas: Ley de Propiedad Horizontal y Junta General de Condominio |
| F7 | `Docs/Scaneos/Reunion 19-08/5.jpg` | **Resumen de Ingresos y Egresos Locales** ("Base de datos ③") | Locales, cuotas, ingresos, egresos propios |
| F8 | `Docs/Scaneos/Reunion 19-08/6.jpg` | **Egresos Cuentas Bancarias** | Detalle de egresos y notas del contador |
| F9 | `Docs/Scaneos/Reunion 19-08/7.jpg` | **Relación de Egresos del Condominio — Julio 2026** | Egresos fijos/variables, alícuotas, gas, mensajes/notas/observaciones |
| F10 | `Docs/Scaneos/Reunion 19-08/7reverso.jpg` | **Relación de Ingresos y Egresos (Bs.) — Julio 2026** | Ingresos por cuenta, otros ingresos, totales |

> Los escaneos ①②③ están marcados a mano como **"Base de datos"**: son la fuente de datos maestros para el modelado.

---

## 3. Técnicas de elicitation utilizadas

- **Observación directa** de los procesos actuales (F3: diagnóstico).
- **Entrevistas** con la Junta de Condominio y la asesora comunitaria/contador externa (F1, F2, F6).
- **Análisis documental** de los reportes administrativos existentes en Excel (F4–F10).
- **Encuesta vecinal** de disposición tecnológica — *planeada, pendiente de ejecutar* (F3, semana 2 del plan).

---

## 4. Actores e informantes

| Actor | Rol en el sistema | Fuente |
|---|---|---|
| Junta Directiva / Administración | Gestiona cobranza, aprueba pagos, publica cartelera, atiende averías | F1, F3, F8 |
| Lcda. Jheizzi Bethermy (Contadora externa, asesora comunitaria) | Elabora los reportes de cobranza/ingresos/egresos; fuente de reglas contables (Tel. 0412-0873917) | F3, F6, F8 |
| Propietarios (≈96–128 unidades) | Consultan saldo/recibos, pagan, reportan averías | F1, F3 |
| Inquilinos (residentes) | Mismos derechos de consulta y reporte que propietarios | F2, F7 |
| Locales comerciales (5: peluquería, spa, depósito, repuestos motos, antena) | Pago de cuota mensual en USD, cuenta propia | F7 |
| Contador/auditador (rol futuro) | Solo lectura de estados financieros | F8 |

---

## 5. Hallazgos por dominio

### 5.1 Comunicación interna (diagnóstico del anteproyecto)
- Carteleras físicas desactualizadas y grupos de WhatsApp saturados → pérdida de información (F3).
- No existe canal oficial, accesible e inmediato (F3).
- Ya existe una práctica de "Mensajes, Notas y Observaciones" impresos en el recibo mensual (F9) → el sistema debe digitalizar ese espacio.

### 5.2 Incidencias / averías
- Reporte informal de averías en áreas comunes (ascensores, iluminación, filtraciones) → sin seguimiento ni respuesta oportuna (F3).
- Se requiere plataforma centralizada de reporte con control de estatus (F3, plan semanas 8).

### 5.3 Cobranza de condominio (dominio principal)
Fuente: F1, F2, F4.
- **Conceptos separados**: condominio ≠ gas; el agua no llega a todos los apartamentos.
- **Cuota variable mensual** por apartamento, con dos categorías: **con balcón** y **sin balcón** (F4: 9,49 / 9,34 en el reporte de junio).
- **Columnas del reporte de cobranza** (modelo de datos mínimo): Apto · Propietario · Saldo anterior ($) · Condominio mes ($) · Condominio mes (Bs) · Pagos ($) · Pagos en cuenta · Referencia · Tasa promedio · Fecha · Saldo actual ($).
- **Pagos** pueden ser: transferencia con referencia, **efectivo**, **"cruce de cuentas"**, o **varias referencias combinadas** (ej. `748865/987249`).
- **Fechas de pago en rango** (ej. `03-13/07/26`, `04-30/07/26`) → un registro de pago puede cubrir varios depósitos.
- **Tasa de cambio aplicada por pago** (columna "Tasa promedio": 633,36 a 755,90) → conversión Bs↔USD al momento del depósito.
- **Saldos negativos** = crédito/saldo a favor o saldo anterior pendiente (interpretación a confirmar).
- **~70 % paga a tiempo**; el resto genera **condominio extemporáneo** (pagos posteriores a la fecha establecida).
- Deudas pagaderas en **cuotas**, y también **pagos por adelantado**.
- **Descuentos** cuando un inquilino presta un servicio al condominio (F2).
- **Pagos devueltos** → requieren registro y conciliación (F1, F2).
- Referencias **recibidas tarde** o **capturas sin fecha visible** → requieren validación (F1, F2).
- Transferencias que llegan primero a **cuentas personales de los administradores** y luego se trasladan a la cuenta del condominio (F1).

### 5.4 Servicio de gas
Fuente: F5, F9.
- Concepto **independiente del condominio**, pago separado, solo para apartamentos con el servicio (**58 usuarios** según F9).
- Regla vigente impresa: **USD 6,40 por apartamento con servicio, adicional al condominio** (F9, nota 1).
- Reporte mensual de pagos: Apto · Monto · Referencia · Fecha; incluye casos especiales: pago **"CON APTO 28"** (compartido), **"CON CONDOMINIO"** (pago conjunto), **EFECTIVO**, referencia doble.
- Apartamentos sin pago en el mes quedan en blanco (pendientes/ctas por cobrar).
- La administración paga al proveedor de gas: factura julio **395.689**, **1.367 litros**, precio/litro **161,0506**, total **Bs 220.156,17** (F9) → el gas es un paso (recaudación ≈ egreso), se presenta **aparte** del total de egresos del condominio.
- Totales F5: **223.512,85** = banco **214.822,82** + efectivo **4.300,00** + cuenta por cobrar **4.390,03** ✔ (cuadra).

### 5.5 Locales comerciales
Fuente: F1, F7.
- 5 locales: **Peluquería (USD 25), Spa (USD 40), Depósito (USD 30), Repuestos Motos (USD 50), Antena (USD 60)** — cuota mensual en USD, columnas *Encargado* y *Adeuda*.
- Contratos de **alquiler de 1 año**; pago dentro de los **primeros 5 días** del mes.
- Sus ingresos **no forman parte de la cuenta de condominio**: tienen **cuenta propia (eventos)**.
- Ingresos de julio locales: **119.790,84** Bs (coincide con `Alquiler percibido de locales` en F10 ✔).
- **Egreso de locales**: Mano de obra ascensor **67.108,00** — pero aparece listado también en "Egresos cuentas bancarias" (F8) con marca ✔ → **clasificación ambigua entre cuentas**.
- Existen **cuotas de impermeabilización** y **compra de divisa** (F7).

### 5.6 Tesorería, ingresos/egresos y conciliación bancaria
Fuente: F8, F9, F10.
- Todo el filtrado y los reportes se hacen hoy en **Excel** (F1).
- **Egresos clasificados**: fijos (servicios, sueldos/y salarios, comisiones bancarias) vs variables/eventuales (bolsas, corte de grama, cemento, oficina, cerradura, escoba, previsión vacaciones).
- Cada egreso lleva: descripción · fecha · factura/referencia · monto (Bs) · **tasa de cambio** · **dólares**; algunas tasas son `PROM` (promedio) y algunas filas solo traen USD (previsión vacaciones).
- **No todos los egresos coinciden con los recibos**; y los egresos de locales **no deben** entrar en el recibo de condominio (F1, F2).
- El **saldo real disponible** es la **última fila** del estado de cuenta (F1, F2).
- **Cuentas**: 0908 (locales/eventos), Banco Del Sur `0157-0013-1337-1301-3013` (condominio), Pago Móvil (0157) RIF J-31119491-6 Tlf 0426-5914616, correo `admn.churuatatorre4@gmail.com` para enviar comprobantes (F9).
- **Notas del contador** (F8): una referencia no reportada por el propietario no se registró como pago; una cuenta por cobrar a administración fue cancelada después → el sistema debe **registrar pagos no reportados y anulaciones**.

### 5.7 Verificación de comprobantes
- El vecino envía **captura/referencia** por correo; la junta debe **validar fecha, monto y destino**, y registrar excepciones (F1, F2, F9).

### 5.8 Marco legal y normativo
- **Ley de Propiedad Horizontal** y **Junta General de Condominio** a estudiar (F6, F1).
- Reglas internas del condominio La Churuata (F1).
- Ley del Servicio Comunitario (Gaceta Nº 38.272) — contexto del proyecto (F3).
- Diferenciación **apartamentos pares/impares** (los impares cuentan con balcón) (F1, F2).

---

## 6. Reglas de negocio detectadas (preliminares)

| # | Regla | Fuente |
|---|---|---|
| R1 | Condominio y gas son conceptos de cobro distintos y se pagan por separado | F1, F2, F9 |
| R2 | La cuota de condominio varía mensualmente según los egresos del mes y la alícuota del apartamento (con/sin balcón) — *hipótesis, ver §7* | F4, F9 |
| R3 | La alícuota de julio 2026 fue 0,982140 % (sin balcón → USD 10,69) y 0,998545 % (con balcón → USD 10,86) | F9 |
| R4 | El pago se Valora con la tasa BCV **al momento del depósito**; cada pago guarda su propia tasa | F1, F2, F9 |
| R5 | Un saldo negativo indica saldo anterior/arrastre | F1, F2 |
| R6 | Las deudas se pueden pagar en cuotas o por adelantado | F1, F2 |
| R7 | El pago posterior a la fecha establecida se clasifica **extemporáneo** | F1, F2 |
| R8 | Los ingresos de locales van a una cuenta propia (eventos) y **nunca** al recibo de condominio | F1, F2, F7 |
| R9 | No todos los gastos de locales entran en el recibo de condominio: requieren clasificación explícita | F1, F2 |
| R10 | Ingresos y egresos internos deben **conciliarse** con el estado de cuenta bancario | F1, F2 |
| R11 | Un pago devuelto debe registrarse y conciliarse | F1, F2 |
| R12 | Un inquilino que presta un servicio al condominio puede solicitar **descuento** en la factura del mes | F2 |
| R13 | El gas solo se cobra a los apartamentos con el servicio (58 usuarios) | F9 |
| R14 | Los locales pagan dentro de los primeros 5 días del mes y sus ingresos se registran en su cuenta | F1, F7 |
| R15 | Referencias sin fecha visible o recibidas fuera de plazo requieren validación manual y observación | F1, F2 |
| R16 | El saldo real de cuenta es el de la última fila del estado de cuenta | F1, F2 |
| R17 | Egresos fijos y variables se reportan en Bs y en USD con su tasa | F9 |

---

## 7. Verificación aritmética de los reportes (hallazgos clave)

Estos cuadres son la base para validar cualquier módulo financiero futuro:

| Conjunto | Cuadre | Resultado |
|---|---|---|
| Cobranza julio | Total pagos en cuenta **753.635,90** = banco **669.329,54** + efectivo **6.500,00** + cruce de cuentas **6.333,60** + extemporáneo **71.472,76** | ✔ exacto |
| Gas julio | **223.512,85** = banco **214.822,82** + efectivo **4.300,00** + cta por cobrar **4.390,03** | ✔ exacto |
| Ingresos julio | 50.861,41 + 669.329,54 + 214.822,82 + 119.790,84 = **1.054.804,61** | ✔ exacto |
| Alícuota | Egresos julio USD **1.088,03** × 0,982140 % = **10,69** (sin balcón); × 0,998545 % = **10,86** (con balcón) | ✔ exacto → **la cuota = alícuota × egresos del mes** |
| Cuota junio | 9,34 / 0,982140 % ≈ **950,4** USD y 9,49 / 0,998545 % ≈ **950,4** USD de egresos | ✔ consistente |
| Egresos | "Egresos cuentas bancarias" (F8) **995.391,42 Bs** vs "Relación de egresos del condominio" (F9) **≈ 709.599,72 Bs** | ✘ **no cuadran** → ver pregunta P-07 |

**Hipótesis R2 confirmada aritméticamente** (pendiente de validación con la contador): *cuota de condominio del mes = alícuota fija del apartamento × egresos totales del mes expresados en USD*.

---

## 8. Restricciones

- **Presupuesto**: sin costo de infraestructura externa (recursos: laptops, celulares, internet, papelería) (F3).
- **Plazo**: 03/07/2026 – 30/10/2026, 120 horas, 15 semanas (F3).
- **Interfaz**: debe ser **web** y **adaptada a dispositivos móviles** (F3).
- **Alfabetización digital**: usuarios no técnicos → requisitos de usabilidad y capacitación con *Manual Rápido de Usuario* (F3).
- **Punto de partida**: el desarrollo debe basarse en los **reportes existentes** y **comenzar por crear el histórico** (F1).

---

## 9. Trazabilidad hallazgo → documento

| Dominio | Hallazgos | Documento de derivación |
|---|---|---|
| Requisitos extraídos | §5 | `Requisitos Funcionales .md` (RF/RNF) |
| Alcance | §1, §5, §8 | `Alcance.md` |
| Dudas y pendientes | §7, §10 | `Preguntas y Dudas.md` |
| Consolidado y estado | todo | `Avance.md` |

---

## 10. Gaps detectados (no definidos en las fuentes)

1. Padrón definitivo de apartamentos y propietarios (96 vs. listado hasta el 128).
2. Regla exacta de cálculo de la cuota y de la alícuota (confirmada solo por aritmética).
3. Moneda base de registro (USD, Bs o ambas con tasa).
4. Fechas límite de pago y política de extemporaneidad (intereses/multas).
5. Flujo de aprobación/rechazo de comprobantes.
6. Qué egresos se imputan al recibo de condominio vs. locales vs. gas.
7. Rol y permisos de la contador externa en el sistema.
8. Identidad/duplicidad de "egresos cuentas bancarias" vs. "relación de egresos".
9. Stack tecnológico, hosting y dominio (no definidos en ninguna fuente).
10. Resultado de la encuesta vecinal de disposición tecnológica (pendiente).

> Todas están formalizadas como preguntas en `Preguntas y Dudas.md`.
