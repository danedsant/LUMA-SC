# Alcance del Sistema — LUMA (Estado actual)

| Campo | Valor |
|---|---|
| Documento | Definición de alcance (versión preliminar) |
| Fecha | 27/09/2026 |
| Fuente | `Elicitacion.md`, `Requisitos Funcionales .md`, anteproyecto y notas de reunión |
| Estado | **Preliminar** — pendiente de aprobación por la Junta y el Asesor Académico |

---

## 1. Problema que resuelve

La Junta de Condominio de la Torre 4 gestiona la comunicación interna con carteleras físicas desactualizadas y grupos de WhatsApp saturados, y reporta las averías de forma informal. La cobranza (condominio, gas, locales), la verificación de comprobantes y los ingresos/egresos se manejan **manualmente en Excel**, con dificultad para conciliar con los estados de cuenta bancarios, sin histórico estructurado y con desconfianza creciente de los vecinos.

## 2. Objetivo general

Implementar un **sistema de información web** para la gestión comunicacional y el control de incidencias y cobranza del Conjunto Residencial La Churuata, Torre 4.

## 3. Alcance funcional (módulos incluidos)

| # | Módulo | Incluye | Prioridad MVP |
|---|---|---|---|
| 1 | **Usuarios y acceso** | Registro, autenticación, roles (junta, vecino, local, contador), asociación usuario–apartamento | ✅ |
| 2 | **Padrón** | Apartamentos (con/sin balcón, alícuota), propietarios, inquilinos, locales y contratos | ✅ |
| 3 | **Cartelera digital** | Publicación de anuncios/normativas, vista de lectura para vecinos, notas del recibo | ✅ |
| 4 | **Reporte de averías** | Envío de reporte con foto, asignación, estados, bitácora | ✅ |
| 5 | **Cobranza de condominio** | Cuota mensual por alícuota, recibos, registro de pagos (referencia/efectivo/cruce/tasa), saldo e histórico, impagos, extemporáneos | ✅ |
| 6 | **Cuota de gas** | Cobro aparte a los 58 usuarios, pagos, pago al proveedor, reporte mensual | ✅ |
| 7 | **Locales comerciales** | Cuenta propia (eventos), cuotas en USD, ingresos/egresos, contratos | ✅ |
| 8 | **Ingresos/egresos y conciliación** | Clasificación por cuenta, egresos fijos/variables en Bs y USD, conciliación con estados de cuenta, saldo real | 🔶 (conciliación automática: fase 2) |
| 9 | **Reportes y consultas** | Relación de cobranza, saldo por apartado, ingresos/egresos, exportación | ✅ |
| 10 | **Mensajes, notas y observaciones** | Espacio interno por apartamento y avisos generales | ✅ |

✅ = fase 1 (entrega 2026) · 🔶 = parcialmente incluido / fase 2

## 4. Alcance de datos (carga inicial)

- **Histórico de pagos y saldos** por apartamento a partir de la *Relación de Cobranzas* (Excel).
- **Histórico de pagos de gas** por mes.
- **Histórico de ingresos y egresos** (condominio, locales, gas) con sus tasas de cambio.
- **Padrón de apartamentos y locales** con alícuotas y contratos.
- Periodo base de arrastre: **julio 2026** (los tres escaneos marcados "Base de datos ①②③"), extendiéndose hacia atrás según los históricos disponibles.

## 5. Actores incluidos

- Junta Directiva / Administración (gestión total).
- Propietarios e inquilinos de la Torre 4 (consulta, pago, reporte).
- 5 locales comerciales (cuota y cuenta propia).
- Contador externo / asesora comunitaria (fuente de reglas y reportes).

## 6. Exclusiones explícitas (fuera de alcance)

| # | Exclusión | Motivo |
|---|---|---|
| E-01 | Portales de pago en línea, pasarelas o integrationes bancarias automáticas | No definido; los pagos siguen siendo transferencia/efectivo manejados por la junta |
| E-02 | Nómina, contabilidad fiscal y emisión de facturas | Función del contador externo, fuera del objetivo |
| E-03 | Aplicación nativa para iOS/Android | Se usará la web responsive |
| E-04 | Sistemas de acceso, cerraduras, cámaras o ascensores (telemetría) | Solo se **reportan** incidencias, no se integra con equipos |
| E-05 | Gestión de estacionamiento, áreas comunales o reservas de salones | No mencionado en las fuentes |
| E-06 | Otras torres o condominios | Proyecto limitado a la Torre 4 (escalabilidad = futuro) |
| E-07 | Medidores individuales de agua/gas (facturación por consumo) | El agua no llega a todos; el gas se cobra por cuota fija |
| E-08 | Portal de quejas anónimas o libro de reclamos formal | No definido |
| E-09 | Reemplazo total de Excel en el corto plazo | Se busca **alimentar** el sistema con los datos; la exportación a Excel se conserva (RF-51) |
| E-10 | Sistema de votaciones/asambleas electrónicas | La Junta General de Condominio se rige por la Ley de Propiedad Horizontal (estudio, no módulo) |

## 7. Supuestos

1. La Junta provee los archivos Excel históricos y los estados de cuenta bancarios en formato digital.
2. El correo `admn.churuatatorre4@gmail.com` se mantiene como canal oficial de recepción de comprobantes durante la transición.
3. Los vecinos cuentan con acceso a internet y celular (a confirmar con la **encuesta vecinal pendiente**).
4. La alícuota y la cuota mensual las define la Junta según egresos del mes (regla R2, a confirmar — P-02).
5. El hosting se contrata/supera sin costo para el condominio (recurso del proyecto: solo laptops, celulares, internet y papelería).

## 8. Dependencias

| Dependencia | Responsable | Impacto si falla |
|---|---|---|
| Entrega de reportes Excel e históricos | Lcda. Jheizzi Bethermy / Junta | No se puede cargar el histórico (RF-30) |
| Definición de reglas de cobro (cuota, gas, extemporaneidad) | Junta + contador | Bloquea RF-19 a RF-30 |
| Encuesta vecinal de disposición tecnológica | Equipo (plan sem 2) | Afecta decisiones de usabilidad/canales |
| Servidor web y dominio | Equipo | Bloquea el despliegue (plan sem 12) |
| Capacitación a la comunidad | Equipo + asesor comunitario | Afecta la adopción (plan sem 14) |

## 9. Criterios de éxito (resultados esperados del anteproyecto)

- Plataforma web instalada y operativa para uso de la Torre 4.
- Centralización de anuncios, recibos y normativas.
- Registro de incidencias con respuesta rápida y transparente.
- Control de cobranza e impagos con histórico y conciliación.
- Capacitación de la Junta para **administrar el sistema de forma autónoma** y guía rápida para los vecinos.
- Reducción del uso de papel y de la dependencia de grupos de WhatsApp.

## 10. Restricciones de plazo y recursos

- **Duración**: 120 horas / 15 semanas (03/07/2026 – 30/10/2026); entrega formal en la semana 15.
- **Equipo**: 3 estudiantes + asesor académico (Prof. Germain Salazar Yépez) + asesora comunitaria (Lcda. Jheizzi Bethermy).
- **Presupuesto**: sin infraestructura de pago; recursos físicos limitados (laptops, celulares, internet, papelería).
- **Hitos del plan de trabajo**: requerimientos (sem 3) → modelado/arquitectura (sem 4) → prototipos (sem 5) → usuarios (sem 6) → cartelera (sem 7) → averías (sem 8) → pagos (sem 9) → integración/pruebas (sem 10–11) → despliegue (sem 12) → piloto (sem 13) → manual (sem 14) → entrega (sem 15).
