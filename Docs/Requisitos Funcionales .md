# Requisitos Funcionales y No Funcionales — LUMA (Estado actual)

| Campo | Valor |
|---|---|
| Documento | Especificación de requisitos (versión preliminar / estado actual) |
| Fecha | 27/09/2026 |
| Fuente | `Elicitacion.md` → hallazgos F1–F10 |
| Estado | **Preliminar** — sujeto a validación con la Junta (ver `Preguntas y Dudas.md`) |

**Convención**: `RF-xx` requisito funcional · `RNF-xx` requisito no funcional · Prioridad **M** (mínimo/MVP) / **A** (alto) / **F** (futuro).

**Roles del sistema**

| Código | Rol | Permisos base |
|---|---|---|
| R-ADM | Junta / Administración | Gestión total (cobranza, egresos, cartelera, averías, usuarios) |
| R-VIE | Propietario / Inquilino | Consulta de su apartamento, envío de comprobantes, reporte de averías, lectura de cartelera |
| R-LOC | Local comercial | Consulta y pago de su cuota de local |
| R-CON | Contador / Auditor | Solo lectura de estados financieros y reportes *(a confirmar — P-16)* |

---

## A. Módulo de Usuarios y Acceso

| ID | Requisito | Prioridad |
|---|---|---|
| RF-01 | Registrar, editar y desactivar usuarios con rol (R-ADM, R-VIE, R-LOC, R-CON) | M |
| RF-02 | Autenticación con correo/usuario y contraseña; cierre de sesión; recuperación de contraseña | M |
| RF-03 | Asociar cada usuario a un apartamento (y a un local, si aplica); un apartamento puede tener propietario **e** inquilino | M |
| RF-04 | Control de acceso por rol: el vecino solo ve y opera sobre **su** apartamento; la junta ve todos | M |
| RF-05 | Registrar actividad básica de acceso (quién y cuándo) | F |

## B. Módulo de Padrón (Entidades base)

| ID | Requisito | Prioridad |
|---|---|---|
| RF-06 | Mantener el padrón de apartamentos: identificador (PB-x, piso/x), **con/sin balcón**, alícuota asignada, estado (ocupado/vacío) | M |
| RF-07 | Mantener propietario e inquilino por apartamento: nombre, cédula, teléfono, correo | M |
| RF-08 | Mantener el catálogo de **locales comerciales**: nombre, contrato (fecha inicio/fin, 1 año), cuota mensual en USD, encargado, adeuda | M |
| RF-09 | Diferenciar parámetros de cobro por concepto: **condominio**, **gas**, **local**, **cuotas especiales** | M |

## C. Módulo de Cartelera Digital

| ID | Requisito | Prioridad |
|---|---|---|
| RF-10 | La junta crea, edita, publica y archiva anuncios (título, cuerpo, fecha de publicación, adjunto opcional) | M |
| RF-11 | Vista de lectura para vecinos con el histórico de anuncios y normativas vigentes | M |
| RF-12 | Publicación del recibo mensual y de las notas/mensajes de observación dirigidos a la comunidad | A |
| RF-13 | Notificación a los vecinos cuando se publica un anuncio nuevo (correo) | F |

## D. Módulo de Reporte de Averías / Incidencias

| ID | Requisito | Prioridad |
|---|---|---|
| RF-14 | El vecino reporta una avería: categoría (ascensor, iluminación, filtración, otro), ubicación, descripción, foto opcional | M |
| RF-15 | La junta asigna responsable/proveedor y cambia el estado: `Pendiente → En proceso → Resuelto → Cerrado` | M |
| RF-16 | Historial y bitácora de cada incidencia con fechas y observaciones | M |
| RF-17 | Consulta pública del estado de las incidencias reportadas (sin datos del reportante) | A |
| RF-18 | Notificación al reportante al cambiar el estado | F |

## E. Módulo de Cobranza de Condominio

| ID | Requisito | Prioridad |
|---|---|---|
| RF-19 | Definir por periodo (mes/año) los **egresos totales** del condominio y calcular la **cuota por apartamento = alícuota × egresos del mes** (con/sin balcón) | M |
| RF-20 | Generar el recibo de condominio por apartamento y periodo, con saldo anterior, cuota del mes y saldo actual | M |
| RF-21 | Registrar pagos: apartamento, concepto (condominio/gas/local/cuota especial), monto, moneda (Bs/USD/efectivo), **tasa BCV aplicada**, referencia, fecha y **captura del comprobante** | M |
| RF-22 | Soportar pagos combinados: varias referencias en un mismo registro, referencias compartidas entre apartamentos y "cruce de cuentas" | M |
| RF-23 | Registrar pagos en **efectivo** con validación manual de la junta | M |
| RF-24 | Calcular y mostrar **saldo actual** por apartamento (arrastre de saldo anterior; saldo negativo = crédito a favor) | M |
| RF-25 | Clasificar los pagos del periodo como **del mes** o **extemporáneos** (de meses anteriores) | M |
| RF-26 | Registrar **abonos en cuotas** y **pagos por adelantado** sobre la deuda del apartamento | A |
| RF-27 | Aplicar **descuentos** por servicios prestados al condominio, con motivo y aprobación | A |
| RF-28 | Marcar y conciliar **pagos devueltos/rechazados** por el banco, revirtiendo el saldo | A |
| RF-29 | Reporte de **impagos** por apartamento y por concepto | M |
| RF-30 | Al cargar el histórico inicial desde los reportes Excel: saldo anterior, pagos, referencias, tasas y fechas por apartamento | M |

## F. Módulo de Cuota de Gas

| ID | Requisito | Prioridad |
|---|---|---|
| RF-31 | Registrar los apartamentos con servicio de gas (58 usuarios) y excluir a los demás del cobro | M |
| RF-32 | Generar la cuota mensual de gas por apartamento (USD 6,40 o el monto definido por la junta para el periodo) | M |
| RF-33 | Registrar los pagos de gas con referencia/fecha/efectivo, y su clasificación: banco / efectivo / cuenta por cobrar | M |
| RF-34 | Registrar el pago al proveedor de gas (factura, litros, precio por litro, total) y compararlo con lo recaudado | A |
| RF-35 | Reporte mensual de pagos de gas por apartamento con totales (banco + efectivo + pendiente) | M |

## G. Módulo de Locales Comerciales

| ID | Requisito | Prioridad |
|---|---|---|
| RF-36 | Registrar los ingresos de alquiler de locales en la **cuenta propia (eventos)**, excluidos del recibo de condominio | M |
| RF-37 | Registrar cuota mensual por local en USD con su conversión, encargado y estado de adeudo | M |
| RF-38 | Registrar los egresos de la cuenta de locales y **clasificar** cuáles sí se imputan al condominio y cuáles no | M |
| RF-39 | Control de vencimiento de contratos (1 año) y de los primeros 5 días del mes para el pago | A |
| RF-40 | Resumen mensual de ingresos y egresos de locales con saldo inicial y saldo final | M |

## H. Módulo de Ingresos, Egresos y Conciliación Bancaria

| ID | Requisito | Prioridad |
|---|---|---|
| RF-41 | Registrar egresos con: descripción, fecha, factura/referencia, monto Bs, **tasa de cambio**, monto USD, y si es **fijo** o **variable/eventual** | M |
| RF-42 | Clasificar cada movimiento por **cuenta bancaria**: condominio, locales (eventos) o gas | M |
| RF-43 | Registrar ingresos bancarios por concepto (condominio, gas, alquiler de locales) y **otros ingresos** en efectivo | M |
| RF-44 | **Conciliación bancaria**: comparar los registros internos con el estado de cuenta importado y marcar coincidencias/diferencias | A |
| RF-45 | Mostrar el **saldo real disponible** (última fila del estado de cuenta) como dato de referencia | M |
| RF-46 | Registrar pagos recibidos en cuentas personales de administradores y su traslado posterior a la cuenta del condominio | A |
| RF-47 | Generar los estados financieros mensuales: ingresos/egresos en Bs y USD, egresos fijos/variables, totales por cuenta | M |

## I. Módulo de Reportes y Consultas

| ID | Requisito | Prioridad |
|---|---|---|
| RF-48 | **Relación de cobranza** mensual por apartamento (saldo anterior, cuota, pagos, referencia, tasa, fecha, saldo actual) con totales y cierres (condominio total, extemporáneo, según banco, efectivo, cruce de cuentas) | M |
| RF-49 | Consulta de saldo e histórico de movimientos de un apartamento en cualquier periodo | M |
| RF-50 | Reportes de ingresos/egresos por periodo y por cuenta | M |
| RF-51 | Exportación de reportes a **Excel/PDF** (compatibilidad con el flujo actual) | A |
| RF-52 | Tablero resumen para la junta: recaudación del mes, incumplimientos, incidencias abiertas | F |

## J. Módulo de Mensajes, Notas y Observaciones

| ID | Requisito | Prioridad |
|---|---|---|
| RF-53 | Espacio de mensajes/notas/observaciones por apartamento y por periodo, visible para la junta | M |
| RF-54 | Publicar observaciones generales en el recibo/cartelera (ej.: exhortos de pago, datos de cuenta y tasa) | M |

---

## K. Requisitos No Funcionales

| ID | Categoría | Requisito |
|---|---|---|
| RNF-01 | Usabilidad | Interfaz **mobile-first** y responsive: usable desde celular (objetivo específico del anteproyecto) |
| RNF-02 | Usabilidad | Sin requerir conocimientos técnicos; flujo apto para usuarios con baja alfabetización digital; interfaz 100 % en español |
| RNF-03 | Usabilidad | Alta visibilidad de acciones clave (pagar, reportar, consultar saldo) en ≤ 3 clics |
| RNF-04 | Disponibilidad | Disponibilidad ≥ 99 % con acceso continuo desde internet (24/7) |
| RNF-05 | Rendimiento | Páginas principales cargadas en < 3 s sobre conexión móvil 4G |
| RNF-06 | Rendimiento | Soportar ~100 usuarios concurrentes y ~130 apartamentos + 5 locales sin degradación |
| RNF-07 | Seguridad | Contraseñas cifradas (hash), sesión con expiración, bloqueo por intentos fallidos |
| RNF-08 | Seguridad | Autorización estricta por rol; el vecino nunca accede a datos de otros apartamentos |
| RNF-09 | Seguridad | Protección de datos personales (cédula, teléfono, correo) y de la información financiera |
| RNF-10 | Integridad de datos | Valores monetarios con 2 decimales; no pérdida de precisión en cálculos de tasa y alícuota |
| RNF-11 | Integridad de datos | Concurrencia controlada en el registro de pagos del mismo apartamento (sin duplicados) |
| RNF-12 | Trazabilidad | Registro de autor y fecha de cambios en pagos, egresos y estados de incidencias |
| RNF-13 | Respaldo | Copias de seguridad automáticas diarias y recuperación verificable |
| RNF-14 | Confiabilidad | Los cuadres financieros (cobranza, gas, locales, ingresos/egresos) deben reproducir los totales de los reportes Excel |
| RNF-15 | Portabilidad | Despliegue en servidor web accesible por URL pública, sin instalación en los equipos del condominio |
| RNF-16 | Compatibilidad | Navegadores actuales (Chrome, Edge, Safari, Firefox) en iOS y Android |
| RNF-17 | Mantenibilidad | Código estructurado por módulos y documentado para la continuidad del proyecto |
| RNF-18 | Legal | Alineado con la Ley de Propiedad Horizontal y las reglas internas del condominio |
| RNF-19 | Legal | Observancia de la Ley del Servicio Comunitario (Gaceta Nº 38.272) como marco del proyecto |
| RNF-20 | Capacitación | Entrega de **Manual Rápido de Usuario** digital y sesiones de capacitación a junta y vecinos |
| RNF-21 | Escalabilidad | Arquitectura que permita en el futuro incorporar otras torres/condominios sin rediseño mayor *(futuro)* |

---

## L. Trazabilidad requisito → fuente

| Requisitos | Fuente principal en `Elicitacion.md` |
|---|---|
| RF-01 a RF-05 | F3 (módulo de usuarios, plan sem 6) |
| RF-06 a RF-09 | F4 (padrón/cobranzas), F7 (locales) |
| RF-10 a RF-13 | F3 (cartelera digital, sem 7) |
| RF-14 a RF-18 | F3 (reporte de averías, sem 8) |
| RF-19 a RF-30 | F1, F2, F4 (cobranza, históricos, alícuotas) |
| RF-31 a RF-35 | F5, F9 (gas) |
| RF-36 a RF-40 | F1, F7 (locales) |
| RF-41 a RF-47 | F8, F9, F10 (egresos, ingresos, conciliación) |
| RF-48 a RF-52 | F1, F4 (reportes de cobranza) |
| RF-53 a RF-54 | F1, F2, F9 (mensajes/notas/observaciones) |
| RNF-01 a RNF-03, RNF-20 | F3 (móvil, alfabetización digital, manual) |
| RNF-14 | §7 de `Elicitacion.md` (cuadres) |
| RNF-18 a RNF-19 | F6, F1, F3 (marco legal) |
