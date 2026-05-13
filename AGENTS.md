# Sistema Farmacia

Monorepo with Express/TypeScript backend + Next.js 15 frontend.

## Commands

```bash
# Backend (Express + TypeScript + MySQL)
cd backend && npm run dev   # runs ts-node-dev src/index.ts

# Frontend (Next.js 15 + React 19 + Tailwind)
cd frontend && npm run dev    # dev server
cd frontend && npm run build  # production build
cd frontend && npm run lint   # ESLint
```

## Environment

Backend requires `.env` file in `backend/` with:
```
DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT, JWT_SECRET
```

## Database Schema

New schema at `backend/src/config/farmacia_v2.sql` with enhanced features:
- **Multi-unit pricing**: Products support prices per unidad, blister, caja
- **Conversion factors**: `unidades_por_blister`, `unidades_por_caja`
- **Cash register (caja)**: Opening/closing with sales tracking
- **Lot tracking**: Expiration dates and batch management
- **Stock alerts**: Auto-generated low stock and expiration alerts

## API Endpoints

### Products (`/api/productos`)
- `GET /` - List all products with calculated prices
- `GET /bajo-stock` - Products with stock <= stock_minimo
- `GET /por-vencer?dias=30` - Lots expiring soon
- `GET /lotes` - All lots with stock
- `GET /lotes/:id` - Lots for specific product
- `POST /lotes` - Create new lot (adds stock)
- `POST /verificar-stock` - Check if stock is available

### Cash Register (`/api/cajas`)
- `POST /abrir` - Open caja with opening balance
- `POST /cerrar` - Close caja with closing balance
- `GET /abierta/:usuario_id` - Get open caja
- `GET /resumen-diario?fecha=YYYY-MM-DD` - Daily summary
- `GET /cerradas` - List closed cajas

### Alerts (`/api/alertas`)
- `GET /` - List all alerts
- `GET /contador` - Unread alert count
- `PUT /:id/leida` - Mark as read
- `PUT /leer-todas` - Mark all as read
- `DELETE /:id` - Delete alert

### Sales (`/api/ventas`)
- `POST /` - Create sale (requires open caja, validates stock)
- `GET /by-date?fecha_inicio=...&fecha_fin=...` - Sales by date range
- `GET /estadisticas?fecha_inicio=...&fecha_fin=...` - Sales statistics
- `POST /:id/cancel` - Cancel sale (returns stock)

## Architecture

- **Backend entry**: `backend/src/index.ts` (Express on port 5000)
- **Database**: MySQL - schema at `backend/src/config/farmacia.sql` (legacy) / `farmacia_v2.sql` (new)
- **Backend validation**: Zod (see `backend/src/validators/`)
- **Frontend**: Next.js 15, React 19, React Query, Tailwind CSS
- **Frontend API**: Uses axios, API base at `localhost:5000`

## Key Features

### Multi-Unit Products
- Products can be sold in: `unidad` (single pill), `blister`, `caja`
- Prices: `precio_unidad`, `precio_blister`, `precio_caja`
- Stock always tracked in base units (pills)
- Auto-calculation: blister = precio_venta * unidades_por_blister (if not set)

### Cash Register
- Must open caja before making sales
- Sales automatically tracked to active caja
- Closing calculates: apertura + ventas = monto_sistema
- Difference = monto_cierre - monto_sistema

### Inventory Logic
- Stock updated in base units (e.g., individual pills)
- Conversion: venta de 2 blisters = 20 unidades (if 10 por blister)
- Lot-based products: stock consumed from oldest lot first

## Known Issues (from README)

- Undefined values being saved to localStorage
- Missing error handling when no client/provider selected in forms
- Error when creating user with duplicate email