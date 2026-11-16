# Checklist de cuentas — Supabase y Vercel

> **Uso interno.** Marcar cada casilla a medida que se completa. **Nunca** pegar claves, contraseñas ni `service_role` en este documento, en el chat o en el repositorio (que es público). Los valores viven en `.env.local` y en las variables de entorno de Vercel.

| Campo | Valor |
|---|---|
| Proyecto | LUMA — Torre 4, La Churuata |
| Fecha de apertura | 16/11/2026 |
| Responsable | Equipo LUMA (Daniel, Isabella, Luis) |
| Costo | $0 (planes Free/Hobby) |
| Decisión | D-18 (cuentas a nombre de los estudiantes con traspaso final) |

---

## 1. Supabase (≈ 15 min)

### Cuenta y proyecto
- [ ] Crear cuenta con GitHub y activar 2FA.
- [ ] Crear organización `luma-churuata` (plan Free).
- [ ] Crear proyecto `luma-churuata`; región **US East (N. Virginia)** o **São Paulo**.
- [ ] Guardar la contraseña de la base en el gestor de contraseñas del equipo.
- [ ] Copiar `Project URL`, `anon key` y `service_role key` a un lugar seguro.

### Autenticación
- [ ] Auth → Providers → Email activo.
- [ ] Desactivar registro público (`Allow new users to sign up` = off); las altas las hace `ADMIN` con `service_role`.
- [ ] Desactivar confirmación de correo (se usan correos sintéticos `${cedula}@luma.local`).
- [ ] Site URL: `http://localhost:3000` al inicio; luego el dominio de Vercel.
- [ ] Redirect URLs: `http://localhost:3000/**` y `https://<proyecto>.vercel.app/**`.
- [ ] JWT expiry: 3600 s.

### Storage
- [ ] Crear buckets privados `comprobantes`, `fotos-averias` y `anuncios`.
- [ ] Definir políticas: el vecino solo lee/escribe lo suyo; `ADMIN` todo; `CONTADOR` solo lectura.

### CLI y migraciones (sin Docker)
- [ ] `npx supabase login`
- [ ] `npx supabase link --project-ref <project-ref>`
- [ ] `npx supabase db push` (aplica `supabase/migrations/`)
- [ ] `npx supabase gen types typescript --linked > src/types/db.ts`

### Operación
- [ ] Keep-alive: cron de Vercel a `/api/health` cada 3 días (evita la pausa por inactividad).
- [ ] Respaldo: `pg_dump` programado + prueba de restauración antes del piloto.
- [ ] Revisar límites Free: 500 MB de base, 1 GB de Storage, pausa por inactividad.
- [ ] Anotar `project-ref` y región en el acta de traspaso (D-18).

---

## 2. Vercel (≈ 10 min)

### Cuenta y proyecto
- [ ] Crear cuenta con GitHub (plan Hobby).
- [ ] Importar el repositorio `danedsant/LUMA-SC`.
- [ ] Framework: Next.js · Root Directory: `.` · Build: `npm run build` · Install: `npm install`.
- [ ] Node 22 (`engines` en `package.json` y `.nvmrc`).

### Variables de entorno
Configurar en **Production**, **Preview** y **Development**:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (solo servidor; nunca `NEXT_PUBLIC_`)
- [ ] `CRON_SECRET`

### Despliegue
- [ ] Deploy inicial correcto y URL de producción anotada.
- [ ] Desactivar Deployment Protection para el dominio público.
- [ ] `vercel.json` con el cron de keep-alive.
- [ ] Verificar `GET /api/health` → 200.
- [ ] Probar login `ADMIN` y RLS con `VECINO` y `CONTADOR`.

### Riesgos y traspaso
- [ ] Documentar que Hobby no es para uso comercial; plan B: Cloudflare Pages.
- [ ] Documentar que la disponibilidad depende de terceros gratuitos (RNF-04).
- [ ] Al cierre: transferir proyecto/repo, rotar claves y firmar acta (D-18).

---

## 3. Criterios de aceptación

- [ ] `npm run build` y `npm run lint` sin errores.
- [ ] Migraciones aplicadas en Supabase remoto.
- [ ] Seed importado dos veces sin duplicar (idempotencia T-02).
- [ ] 13/13 cuadres del validador reproducidos por `scripts/verify-cuadres.mjs`.
- [ ] `/api/health` responde 200.
- [ ] RLS: `VECINO` solo ve su apartamento; `CONTADOR` solo lectura; `ADMIN` total.
- [ ] Respaldo restaurado en un proyecto de prueba.

## 4. Registro de avance

| Fecha | Paso | Estado | Nota |
|---|---|---|---|
| 16/11/2026 | Checklist creado | ✅ | Pendiente ejecución manual de cuentas |
| | Supabase creado | ⬜ | |
| | Vercel importado | ⬜ | |
| | Migraciones aplicadas | ⬜ | |
| | Seed importado | ⬜ | |
| | Health + RLS verificados | ⬜ | |
| | Traspaso firmado | ⬜ | |
