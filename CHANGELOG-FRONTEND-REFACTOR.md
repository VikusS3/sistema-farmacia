# Frontend Refactor — Architecture & API Integration Changes

> **Date:** 2026-05-27
> **Scope:** Frontend (Next.js 16 + React 19) — refactored to match backend API contract.

---

## Summary of Changes

### 1. API Layer (`lib/api.js`)

| Change | Before | After | Reason |
|--------|--------|-------|--------|
| `ventasService.cancel` | `cancel(id, usuario_id)` → `POST /ventas/:id/cancel { usuario_id }` | `cancel(id, data)` → `POST /ventas/:id/cancel { data }` | Backend requires `motivo` (min 10 chars) + `usuario_id` |
| `ventasService.getVentaConProductos` | `GET /ventas/:id` | `GET /ventas/venta/:id/productos` | Correct endpoint per POSTMAN.MD |
| Added `ventasService.getVentasPorCliente` | Missing | `GET /ventas/cliente/:clienteId` | Backend has the route, was not exposed |
| `cajaService` — added `getById` | Missing | `GET /cajas/:id` | Backend has the route |
| `reportesService` | Had `getEstadisticas` (wrong endpoint) | Replaced with `getMetricasDashboard()`, `getTopProductos(limit)`, `getVentasMensuales()` | Backend routes at `/reportes/` not `/ventas/estadisticas` |

### 2. Auth Context (`context/AuthContext.js`)

- **Added proper `loading` state:** `setLoading(true)` before login API call, `setLoading(false)` in `finally` block.
  - Previously `loading` was always `false`, making the dashboard layout's loading guard never activate during login.

### 3. Dashboard (`dashboard/page.js`)

- **Added `router.push("/caja")` onClick** to the Abrir/Cerrar Caja button. Previously the button had no `onClick` — purely decorative.

### 4. Product Forms (`productos/nuevo/page.js` & `productos/[id]/page.js`)

**Field mapping fixes:**

| Removed Field | Reason |
|---------------|--------|
| `precio_compra` | Backend does not have this field |
| `precio_venta` | Backend uses `precio_unidad` |
| `unidades_por_caja` | Backend uses `blisters_por_caja` |

| Added Field | Type | Default |
|-------------|------|---------|
| `unidad_medida` | Select (unidad/ml/g) | `"unidad"` |

**Payload (`buildPayload`)** now sends: `nombre`, `descripcion`, `categoria_id`, `precio_unidad`, `precio_blister`, `precio_caja`, `unidades_por_blister`, `blisters_por_caja`, `stock`, `stock_minimo`, `require_lote`, `unidad_medida`.

### 5. Product List (`productos/page.js`)

- Changed `producto.precio_venta` → `producto.precio_unidad` in table display.

### 6. New Sale (`ventas/nueva/page.js`)

- Changed `producto.precio_venta` → `producto.precio_unidad` in product cards and cart price reference.
- **Removed `caja_id` from request body** — the backend middleware `verificarCajaAbierta` auto-injects it per POSTMAN spec.

### 7. Suppliers (`proveedores/page.js`)

- **Removed `contacto` field** from form, table, and payload. Backend `proveedores` only has: `nombre`, `email`, `telefono`, `direccion`.

### 8. Purchases (`compras/page.js`) — Major Refactor

**The old form was completely incompatible with the backend. Rewritten to match:**

| Aspect | Before (Broken) | After (Fixed) |
|--------|----------------|---------------|
| Payload | Sent `fecha`, `detalles` with `precio_unitario` | Removed `fecha` (server-side), added `subtotal`, `descuento`, `observaciones`, `caja_id`, `usuario_id` |
| `detalles` | Flat product list without unit type | Each detail has: `producto_id`, `cantidad`, `tipo_compra` (unidad/blister/caja), `subtotal`, optional `numero_lote` + `fecha_vencimiento` |
| UI | Simple quantity +/- | Added: tipo_compra selector, lote fields for `require_lote` products, descuento input, observaciones |
| Pre-requisite | No caja check | Now checks for open cash register before allowing purchase creation |

**Detailed breakdown of `detalle_compra` payload:**
```json
{
  "detalles": [{
    "producto_id": 1,
    "cantidad": 10,
    "tipo_compra": "unidad|blister|caja",
    "subtotal": 120.00,
    "numero_lote": "LOTE-001",        // if require_lote
    "fecha_vencimiento": "2026-12-31" // if require_lote
  }]
}
```

### 9. New Venta Detail Page (`ventas/[id]/page.js`)

- **Created from scratch** — the "Ver" button in the sales list linked to this route but it didn't exist.
- Displays: client info, user, status badge, financial summary (subtotal, descuento, adicional, total), product table with unit/cantidad/prices.
- **Cancel sale flow:** Text area for motivo (min 10 chars), SweetAlert2 confirmation, calls `POST /ventas/:id/cancel` with `{ motivo, usuario_id }`.
- **Ticket download:** Opens `GET /ventas/:id/generar-ticket` in new tab.

### 10. ESLint Cleanup

- Fixed `react-hooks/set-state-in-effect` errors in `compras/page.js` and `proveedores/page.js`.
- Both were calling `setState` directly in effect bodies; refactored to single async IIFE per effect.

---

## Verified

- [x] ESLint: `pnpm lint` passes with 0 errors, 0 warnings.
- [x] All API endpoints match POSTMAN.MD and backend routes.
- [x] All request payloads match backend Zod validators.
- [x] Auth token auto-attached via axios interceptor + 401 redirect.
- [x] Cash register flow: open → purchase/sell → close.
- [x] No UI redesign — all existing Tailwind styles, CSS variables, component patterns preserved.

## Files Modified

| File | Change |
|------|--------|
| `lib/api.js` | Fixed endpoints, params, added missing methods |
| `context/AuthContext.js` | Added loading state during login |
| `app/(dashboard)/dashboard/page.js` | Added onClick to caja button |
| `app/(dashboard)/productos/nuevo/page.js` | Fixed field names to match backend |
| `app/(dashboard)/productos/[id]/page.js` | Fixed field names to match backend |
| `app/(dashboard)/productos/page.js` | Fixed price display field |
| `app/(dashboard)/ventas/nueva/page.js` | Fixed price field, removed caja_id from payload |
| `app/(dashboard)/proveedores/page.js` | Removed contacto field, fixed ESLint |
| `app/(dashboard)/compras/page.js` | Major refactor for backend compatibility |

## Files Created

| File | Purpose |
|------|---------|
| `app/(dashboard)/ventas/[id]/page.js` | Venta detail + cancel + ticket download |
| `CHANGELOG-FRONTEND-REFACTOR.md` | This document |
