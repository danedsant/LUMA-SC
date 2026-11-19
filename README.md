# LUMA — Torre 4, La Churuata

Sistema web de gestión para la Torre 4 del Conjunto Residencial La Churuata:
cartelera digital, reporte de averías, cobranza de condominio, gas y locales, y
transparencia de ingresos y egresos.

- **Stack:** Next.js 16 (App Router) · React 19 · Material UI v9 · Emotion
- **Datos y auth:** Supabase (Postgres + Auth + Storage)
- **Despliegue:** Vercel
- **Skills de agentes:** `npx autoskills` + MUI Skills oficiales (`.agents/skills/`)
- **Documentación del proyecto:** [`documentacion/Docs/`](documentacion/Docs/)

## Requisitos

- Node.js 22 LTS (`.nvmrc`)
- Cuenta y proyecto en [Supabase](https://supabase.com)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`npx supabase`)
- Cuenta en [Vercel](https://vercel.com) para desplegar

## Puesta en marcha

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Copia las variables de entorno y complétalas:

   ```bash
   copy .env.example .env.local
   ```

   | Variable | Dónde se usa | Origen |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Cliente y servidor | Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente y servidor | Supabase → Project Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | Solo scripts y servidor | Supabase → Project Settings → API (nunca en el cliente) |

3. Vincula el proyecto y aplica las migraciones:

   ```bash
   npx supabase login
   npx supabase link --project-ref <ref>
   npm run db:push
   ```

4. Importa la base 2026 y crea el administrador:

   ```bash
   npm run seed -- --admin-cedula=<cedula> --admin-password=<clave>
   npm run verify
   ```

5. Levanta el entorno local:

   ```bash
   npm run dev
   ```

## Datos base

La base 2026 vive en `documentacion/data/base-2026/` (CSV) y se valida antes de
importar:

```bash
node documentacion/scripts/validate-seed.mjs documentacion/data/base-2026
```

`personas.csv` **no se versiona** (datos personales). Usa
`personas.example.csv` como plantilla local.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificación de tipos |
| `npm run validate` | Valida los CSV de la base 2026 |
| `npm run seed` | Importa la base 2026 a Supabase (idempotente) |
| `npm run verify` | Verifica los cuadres contra `expected-base-2026.json` |
| `npm run db:push` | Aplica migraciones al proyecto vinculado |
| `npm run db:types` | Genera tipos TypeScript desde la base vinculada |

## Estructura

```text
src/
  app/            Rutas (landing, login, panel, api/health)
  components/     `next-link` y componentes compartidos
  lib/            Supabase, auth, formato y entorno
  proxy.ts        Guardia de sesión (Next 16)
  theme.ts        Tema MUI
supabase/
  migrations/     Esquema, vistas, RLS y triggers
scripts/          Importación y verificación de datos
documentacion/    Docs, datos y validador de la Fase 3
.agents/skills/   Skills de agentes (autoskills + MUI)
```

## Seguridad

- RLS activo en todas las tablas; los vecinos solo ven su apartamento.
- La `service_role` key solo se usa en scripts y en el servidor.
- No se versionan cédulas, teléfonos, correos ni claves.
- El reporte público de morosidad se publica **solo** como código de
  apartamento y monto (D-13), y queda pendiente de revisión legal (P-40).

## Despliegue

Sigue [`documentacion/Docs/Checklist-Cuentas-Supabase-Vercel.md`](documentacion/Docs/Checklist-Cuentas-Supabase-Vercel.md)
para crear las cuentas, cargar variables en Vercel y verificar el despliegue.
