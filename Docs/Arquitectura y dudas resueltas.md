# Definición Técnica (Opción B), Cierre de Reglas de Negocio y Consultas Finales — LUMA

| Campo | Valor |
|---|---|
| Proyecto | **LUMA** — Sistema de información web para la gestión comunicacional, incidencias y cobranza |
| Comunidad | Conjunto Residencial La Churuata, Torre 4 — RIF J-31119491-6 |
| Documento | Consolidado de Arquitectura (Opción B), Reglas Cerradas y Cuestionario Depurado |
| Estado | **Listo para implementación (Sprint Final)** |

---

## 1. Reglas de Negocio Cerradas (Revisión Interna + Cruce con Escaneos)

A partir de las respuestas levantadas con Isabella (residente del conjunto) y la verificación matemática de los escaneos `1.jpg` al `7.jpg`, se cierran **19 de las 23 preguntas bloqueantes**:

### 1.1 Padrón y Alícuotas
* **Total real de apartamentos (P-01):** **101 apartamentos** exactos (`12 pisos × 8 apartamentos = 96` + `5 apartamentos en Planta Baja = 101`).
* **Alícuotas constantes (P-03, P-04):**
  * Apartamentos **con balcón** (impares): `$0,998545\%$` (`0.00998545`).
  * Apartamentos **sin balcón** (pares y **todos los de Planta Baja**): `$0,982140\%$` (`0.00982140`).
* **Apartamentos desocupados/vacíos (P-05):** Pagan exactamente la misma cuota mensual sin exenciones.

### 1.2 Fórmulas Contables Verificadas en Escaneos (`1.jpg` a `7.jpg`)
* **Significado de Saldos Positivos y Negativos (P-08 — Resuelto por `1.jpg`):**
  La ecuación exacta del reporte de cobranza es:
  $$\text{Saldo Actual (\$)} = \text{Saldo Anterior (\$)} + \text{Cuota Condominio Mes (\$)} - \text{Pagos (\$)}$$
  * **Valor Positivo (`> 0`):** Representa **deuda pendiente** del apartamento.
  * **Valor Negativo (`< 0`):** Representa **saldo a favor (crédito)** del propietario por pagos adelantados o abonos superiores a la deuda (demostrado en `1.jpg`, Apto 58: `$11,65 + 9,49 - 50,00 = -28,86$`).
* **Conciliación entre los dos reportes de Egresos (P-07 y P-11 — Resuelto por `5.jpg` y `7.jpg`):**
  * **`Relación de Egresos del Condominio` (`5.jpg` = `$1.088,03\text{ USD}$`):** Es la relación de **gastos imputables al recibo** de los vecinos (incluye provisiones contables como los `$110,00\text{ USD}$` de *Previsión Vacaciones Dora Azuaje*).
  * **`Egresos Cuentas Bancarias` (`7.jpg` = `$995.391,42\text{ Bs}$`):** Es el **flujo de caja bancario real** consolidado. Incluye salidas de dinero que **no** se cobran en el recibo general de condominio: el pago al proveedor de **Servicio de Gas (`220.300,00 Bs`)**, la **Mano de Obra Ascensor pagada por Cuenta Locales (`67.108,00 Bs`)** y la **Cuenta por Cobrar Administración (`9.795,00 Bs`)**, la cual según nota al pie de `7.jpg` fue un adelanto reintegrado el `08/08/2026` bajo la `Ref. 877422`.

### 1.3 Pagos, Gas y Locales
* **Tasa de cambio (P-12, P-27):** Todas las obligaciones (condominio, gas, locales) se fijan en **USD** y se pagan en Bs a la **tasa BCV del día del pago** (registrando la tasa aplicada en cada transacción).
* **Política de Mora (P-14):** Plazo de **15 días** tras la emisión del recibo antes de pasar a estado moroso.
* **Cruce de cuentas y Descuentos (P-10, P-19):** Corresponde a descuentos por reparaciones o servicios realizados por un residente (ej. arreglo de cerradura por `6.333,60 Bs`), aprobados por la administración.
* **Pagos compartidos y abonos (P-18, P-21):** Se permiten abonos parciales y pagos con referencia compartida entre apartamentos (`"CON APTO 28"`) o entre conceptos (`"CON CONDOMINIO"`).
* **Lógica del Servicio de Gas (P-20, P-22, P-24):** Solo **58 apartamentos** cuentan con conexión de gas (los 43 restantes usan cocina eléctrica). Por tanto, los espacios en blanco dentro de la lista de 58 en `3.jpg` (ej. PB-6, 18, 64) **son impagos del mes**.

### 1.4 Usuarios, Roles y Privacidad
* **Identificación (P-35, P-36):** **1 usuario titular por apartamento**, autenticado mediante su **Cédula de Identidad** (sin depender de que el vecino tenga correo electrónico activo).
* **Roles simplificados (P-28, P-30, P-38):** Un único rol administrativo (`ADMIN`) para la Junta/Administración que gestiona condominio, gas, locales, cartelera y averías; un rol vecino (`VECINO`); y un rol de lectura/auditoría para contaduría (`CONTADOR`).
* **Privacidad en reportes de morosidad (P-42):** En la vista pública para vecinos **solo se muestra el número de apartamento y el monto adeudado**, ocultando nombres y cédulas.

---

## 2. Cuestionario Final Depurado para la Administradora / Contadora

Mensaje listo para enviar por WhatsApp a la **Lcda. Jheizzi Bethermy (`0412-0873917`)** o a la Junta Directiva con los únicos 6 puntos que requieren confirmación administrativa:

> **Mensaje para copiar y enviar:**
>
> *"Buenas tardes, Lcda. Jheizzi y Junta de Condominio. Les escribe el equipo de Servicio Comunitario UNEG (Proyecto LUMA - Torre 4). Revisando a detalle los reportes de Julio 2026 junto con Isabella, ya logramos cuadrar en el sistema las fórmulas de saldos, las alícuotas (con y sin balcón para los 101 apartamentos) y la separación entre el Recibo de Condominio ($1.088,03) y el reporte de Egresos Bancarios (995.391,42 Bs). Solo nos quedan **6 consultas puntuales** para dejar listas las reglas en el programa:*
>
> *1. **Montos especiales en la columna 'Condominio Mes ($)' (P-06):** En la Relación de Cobranzas vimos que la cuota general de ese corte fue $9,49 (con balcón) y $9,34 (sin balcón), pero 4 apartamentos tienen un monto distinto en esa columna: **Apto 48 ($15,89), Apto 105 ($0,00), Apto 106 ($28,88) y Apto 121 ($16,12)**. ¿A qué se debe que su cuota del mes sea distinta (cuota especial, ajuste manual o exoneración)?*
> *2. **Ajuste de saldos a favor pequeños (P-08):** Notamos en el Apto 54 que tenía un saldo a favor de `-$10,03`, se le cobró el mes (`$9,49`) y su Saldo Actual quedó en `$0,00` (en lugar de `-$0,54`). ¿El sistema debe mantener siempre el cálculo exacto (`-$0,54`) o tener un botón de ajuste manual de centavos?*
> *3. **Variación en montos de Servicios entre Recibo y Banco (P-07):** En la Relación de Egresos del recibo figuran **Hidrobolívar por 91.475,65 Bs** y **Corpoelec por 127.826,24 Bs + 1.776,31 Bs**, pero en Egresos Cuentas Bancarias figuran **Hidrobolívar por 110.025,00 Bs** y **Eleoriente por 99.641,90 Bs**. ¿Esta diferencia se debe a facturas de distintos cortes o comisiones/ajustes al momento de pagar?*
> *4. **Diferencia y reserva en el Servicio de Gas (P-23):** En julio la factura de gas con flete fue de **220.156,17 Bs**, del banco salieron **220.300,00 Bs**, y entre los vecinos se facturaron **223.512,85 Bs**. ¿Ese remanente a favor queda como un fondo de reserva exclusivo de la cuenta de gas?*
> *5. **Criterio para gastos de la Cuenta 0908 de Locales (P-25 / P-26):** Vimos que la 'Mano de Obra Ascensor (67.108,00 Bs)' se cubrió con la Cuenta 0908 de Locales y por eso no aumentó el recibo de los vecinos. ¿En el sistema basta con que el administrador elija al registrar cada gasto si sale de 'Cuenta Condominio' o de 'Cuenta Locales (0908)'?*
> *6. **Pagos no reportados como la Ref. 668374 (P-13) y Condominio Extemporáneo (P-09):** Cuando aparece en el estado de cuenta una transferencia que ningún vecino ha reportado (como la ref. 668374), ¿les parece bien que quede en una bandeja de 'Pagos en banco por reclamar/asignar'? Y para clasificar un pago como 'Condominio Extemporáneo (71.472,76 Bs)', ¿se marca así cuando paga deuda de meses anteriores o cuando paga después del día 15?*
>
> *¡Muchas gracias de antemano!"*

---

## 3. Arquitectura Seleccionada: Opción B (Vercel + Supabase Free Tier + PWA Offline)

Para garantizar que el sistema **funcione en flujo real durante al menos 1 mes (y de forma indefinida posterior a la entrega)** con **costo $0** (`P-44`), **sin requerir soporte técnico constante** (`P-48`) y con **tolerancia a fallas de internet** (`P-47`), se selecciona la **Opción B**.

### 3.1 Stack Tecnológico Definitivo (`P-43`)
* **Frontend & Fullstack Framework:** **Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui** (configurado como **PWA** para soporte offline/caché en teléfonos).
* **Base de Datos y Backend:** **Supabase (PostgreSQL 15+ con soporte nativo `JSONB` + Row Level Security + Storage)**.
* **Validación y Reportes:** **Zod + React Hook Form** para formularios blindados y **`xlsx`** para exportar los cuadros idénticos al Excel actual.
* **Despliegue (Hosting):** **Vercel (Hobby Tier Gratuito)** conectado al repositorio `danedsant/LUMA-SC`.

### 3.2 ¿Por qué este Stack garantiza operación continua sin caídas ("Contabilidad Real")?
1. **Flexibilidad `PostgreSQL + JSONB` ante casos atípicos:**
   Los reportes físicos (`1.jpg`, `3.jpg`, `5.jpg`) demuestran que la operación real tiene excepciones todos los meses: pagos con doble referencia (`748865/987249`), pagos compartidos (`"CON APTO 28"`), cruces de cuentas por cerraduras o tasas marcadas como `"PROM"`.
   * Las columnas financieras que suman en los cuadres (`monto_usd`, `monto_bs`, `tasa_bcv`, `saldo_actual`) se definen como `NUMERIC(12,2)` estrictos para garantizar precisión matemática (cumpliendo `RNF-10` y `RNF-14`).
   * Los metadatos variables (múltiples referencias, observaciones de fechas borrosas en capturas, aptos vinculados en un pago compartido) se almacenan en una columna **`detalles JSONB`**. Así el sistema **jamás arrojará un error por rigidez de esquema** durante el mes de operación.
2. **Captura Inicial Mensual Ágil (`P-46`):**
   Permite cargar el corte base (Julio 2026) mediante un script semilla (`seed.ts`) o desde una interfaz rápida de captura inicial de saldos, dejando el sistema listo para operar el mes en curso inmediatamente.
3. **Acceso Real para los 101 Vecinos vs. Limitación del Despliegue Local (Opción A):**
   * Con la **Opción A (Servidor solo en la laptop de la junta)**, ningún vecino podría consultar su deuda, ver la cartelera ni subir su captura de pago desde su celular a menos que esa laptop esté encendida 24/7 con IP pública sin cortes eléctricos.
   * Con la **Opción B (Vercel + Supabase)**, tanto la Junta como los 101 apartamentos acceden 24/7 desde cualquier celular con datos móviles o WiFi, y gracias al Service Worker (PWA), pueden seguir visualizando los últimos recibos y anuncios cargados aunque falle temporalmente la conexión (`P-47`).

---

## 4. Viabilidad en Flujo Real: Cálculo de Límites del Plan Gratuito de Supabase y Vercel

Cálculo de consumo real proyectado para la **Torre 4 (101 apartamentos + 5 locales)** operando al 100%:

### 4.1 Volumen de Base de Datos (PostgreSQL)
* **Registros fijos (Padrón y Usuarios):** $101\text{ aptos} + 5\text{ locales} + 108\text{ usuarios} \approx 214\text{ filas}$.
* **Operación mensual máxima:**
  * $101\text{ recibos de condominio} + 101\text{ pagos de condominio}$.
  * $58\text{ cuotas/pagos de gas}$.
  * $5\text{ cobros de locales}$.
  * $\sim 25\text{ egresos mensuales} + \sim 15\text{ anuncios/averías}$.
  * **Total mensual:** $\sim 305\text{ filas nuevas/mes} \times \sim 0,5\text{ KB por fila (incluyendo JSONB)} \approx \mathbf{152\text{ KB/mes}}$ ($\mathbf{0,15\text{ MB/mes}}$).

### 4.2 Volumen de Archivos (Supabase Storage: Capturas de Pago y Fotos de Averías)
* **Compresión automática en el cliente (Frontend):** Antes de subir la foto del comprobante o de la avería a Supabase Storage, el navegador la redimensiona con HTML5 `<canvas>` a formato `WebP/JPEG` ($\le 80\text{ KB}$ por imagen).
* **Consumo mensual:** $160\text{ comprobantes/fotos al mes} \times 80\text{ KB} \approx \mathbf{12,8\text{ MB/mes}}$.

### 4.3 Tabla Comparativa de Límites Gratuitos vs. Consumo Real de LUMA

| Recurso | Límite Plan Gratuito (Supabase / Vercel) | Consumo LUMA (1 Mes) | Consumo LUMA (1 Año Completo) | Margen de Seguridad |
|---|---|---|---|---|
| **Base de Datos (`PostgreSQL`)** | **$500\text{ MB}$** | **$0,15\text{ MB}$** | **$1,80\text{ MB}$** | Usa solo el **$0,36\%$** en un año |
| **Almacenamiento (`Storage`)** | **$1.024\text{ MB}$ ($1\text{ GB}$)** | **$12,8\text{ MB}$** | **$153,6\text{ MB}$** | Aguanta **$> 6\text{ años}$** gratis |
| **Autenticación (`MAU`)** | **$50.000\text{ usuarios/mes}$** | **$108\text{ usuarios}$** | **$108\text{ usuarios}$** | Usa solo el **$0,21\%$** |
| **Transferencia / Bandwidth** | **$5\text{ GB}$ (DB) / $100\text{ GB}$ (Web)** | **$< 250\text{ MB}$** | **$\sim 3,0\text{ GB}$** | **$100\%$ cubierto** |

### 4.4 Blindaje contra la pausa por inactividad de Supabase (Keep-Alive)
El único requisito del plan gratuito de Supabase es que el proyecto no pase **7 días continuos sin recibir ninguna petición**.
* **Solución implementada en la arquitectura:** Se incluye un endpoint ligero `/api/health` en Next.js activado automáticamente cada 72 horas mediante **Vercel Cron Jobs** (`vercel.json`) o **GitHub Actions Cron**, ejecutando un `SELECT 1` en PostgreSQL. Esto garantiza que **la base de datos jamás entre en hibernación**, ni siquiera en periodos vacacionales.

---

## 5. Integración de `midudev/autoskills` en el Flujo de Desarrollo

Dado que `autoskills` inspecciona el `package.json` del repositorio para instalar las reglas óptimas de agentes de IA (`.cursorrules`, `CLAUDE.md`, `.github/copilot-instructions.md`), el procedimiento exacto de inicialización es:

```bash
# 1. Inicializar Next.js con TypeScript, Tailwind y App Router
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Instalar las dependencias del stack Opción B
npm install @supabase/supabase-js @supabase/ssr zod react-hook-form @hookform/resolvers lucide-react xlsx date-fns

# 3. Inicializar componentes base de shadcn/ui
npx shadcn@latest init -d

# 4. Ejecutar autoskills de midudev para inyectar las skills del stack detectado
npx autoskills -y
```