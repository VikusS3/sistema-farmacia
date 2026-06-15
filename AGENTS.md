# Sistema Farmacia

Monorepo with two independent packages:

| Package  | Dir        | PM    | Language/Framework                          |
|----------|------------|-------|---------------------------------------------|
| Backend  | `backend/` | npm   | Express + TypeScript + MySQL                |
| Frontend | `frontend/`| pnpm  | Next.js 16 + React 19 + Tailwind CSS 4 + JS |

**Do not install or run both packages from the repo root.** Each has its own `dev` script.

## Commands

```bash
# Backend
cd backend && npm run dev                          # ts-node-dev src/index.ts on :5000
cd backend && npm run seed:master                  # seed master admin user

# Frontend
cd frontend && pnpm dev                            # dev server on :3000
cd frontend && pnpm build                          # production build
cd frontend && pnpm lint                           # ESLint (flat config + core-web-vitals)

# DB schema (run against MySQL)
mysql -u root < backend/src/config/farmacia_v2.sql  # layered on top of legacy farmacia.sql
```

- **No tests** exist in either package.
- **No typecheck** script — backend uses `ts-node-dev` (not `tsc --noEmit`); frontend is plain JS.
- Backend hot-reloads via `ts-node-dev`; manually restart after adding new routes/middleware if needed.

## Key Architecture

- **Backend entry**: `backend/src/index.ts` — Express on `:5000`, all routes mounted under `/api`.
- **MySQL pool**: `backend/src/config/db.ts` — `mysql2/promise` pool (env-driven via `.env`).
- **Auth**: JWT in `Authorization: Bearer <token>` header. Every route (except login) uses `authMiddleware`. Token/user stored in `localStorage`.
- **Validation**: Zod schemas in `backend/src/validators/`, parsed in each controller.
- **Cash register flow**: Must `POST /api/cajas/abrir` before creating sales. The `verificarCajaAbierta` middleware auto-injects `caja_id` into the sale request body.

### Frontend specifics
- `'use client'` throughout — all pages are client-rendered.
- Auth state via React Context (`@/context/AuthContext`). No React Query.
- Path alias `@/` → `./src/*` (jsconfig.json).
- API client: axios instance in `src/lib/api.js` — auto-attaches JWT + redirects to `/login` on 401.
- Error handling helper: `src/lib/errorHandler.js` — `parseBackendError()` / `useFieldErrors()` / Swal alerts.

## Notable Conventions

- **All API responses are Spanish** — messages, errors, field names.
- **Roles**: `admin` | `empleado` (from JWT payload and `usuarios.rol`).
- **Cash register** is mandatory for sales — no exceptions.
- **Stock always in base units** (pills). Multi-unit sales (blister/caja) are converted via `unidades_por_blister` / `unidades_por_caja`.
- **Inventory consumption**: oldest lot first (FIFO).
- **Backend uses CommonJS** (`"module": "commonjs"`) despite `.ts` files.
- **Tailwind v4** — uses `@tailwindcss/postcss` (no legacy `tailwind.config.js`).

## API Endpoints at a Glance

All routes require `authMiddleware` except login. Prefix: `/api`.

- `POST /usuarios/login` — authenticate, returns JWT + user object
- Full CRUD: `/usuarios`, `/productos`, `/clientes`, `/proveedores`, `/categorias`, `/compras`, `/inventario`
- `GET /productos/bajo-stock` — stock ≤ stock_minimo
- `GET /productos/por-vencer?dias=N` — lots expiring soon
- `GET /productos/lotes` / `POST /productos/lotes` / `GET /productos/:id/lotes` — lot management
- `GET /productos/vencimiento/with-experied` — products with expired lots
- `POST /productos/verificar-stock` — check availability
- `POST /cajas/abrir` / `POST /cajas/cerrar` — open/close cash register
- `GET /cajas/abierta/:usuario_id` / `GET /cajas/cerradas` / `GET /cajas/resumen-diario`
- `POST /ventas` — create sale (auto-fills `caja_id` from middleware)
- `POST /ventas/:id/cancel` — cancels and returns stock
- `GET /ventas/:id/generar-ticket` — PDF ticket (PDFKit)
- `GET /reportes/estadisticas?fecha_inicio=...&fecha_fin=...`
- `GET /alertas` / `PUT /alertas/:id/leida` / `PUT /alertas/leer-todas`
