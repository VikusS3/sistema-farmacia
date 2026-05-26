# Changelog — Refactor para BD.sql (newfarmacia)

**Fecha:** 2026-05-25  
**Objetivo:** Adaptar todo el backend de Express + TypeScript + MySQL al nuevo esquema de base de datos definido en `BD.sql`.

---

## Resumen de cambios

### Arquitectura general

- Se eliminaron columnas obsoletas (`precio_compra`, `precio_venta`, `ganancia` en productos; `ruc` en proveedores; `unidades_por_caja` reemplazado por `blisters_por_caja`)
- Se agregaron nuevos modelos para las nuevas tablas: `movimiento_lotes`, `historial_precios`
- Se corrigió el typo `proovedor` → `proveedor` en nombres de archivos, clases, variables e imports
- Se actualizó la base de datos por defecto en `db.ts` de `farmacia` a `newfarmacia`

---

## Archivos modificados / creados / eliminados

### 1. `src/types.d.ts` — REESCRITO

**Cambios:**
- `Producto`: eliminó `precio_compra`, `precio_venta`, `fecha_vencimiento`, `unidad_venta`, `factor_conversion`, `factor_caja` — estos campos ya no existen en la nueva tabla `productos`
- `Lote`: `precio_unitario` → `costo_unitario`; agregó `compra_id`, `estado`
- `Proovedor` → `Proveedor`: eliminó `ruc`, agregó `email`
- `DetalleCompra`: `unidad_compra` → `tipo_compra`; agregó `lote_id`, `factor_conversion`, `unidades_totales`, `costo_unitario_compra`
- `DetalleVenta`: agregó `lote_id`, `unidades_base`, `costo_real_unitario`, `descuento`, `adicional`
- `Venta`: agregó `subtotal`
- `Inventario`: expandió `movimiento` a 5 opciones; agregó `lote_id`, `usuario_id`, `tipo_referencia`, `referencia_id`, `stock_anterior`, `stock_nuevo`; eliminó `unidades_base`
- `ResumenVentas`: `total_diario` → `total_dia`
- Nuevos tipos: `MovimientoLote`, `HistorialPrecio`
- `ProductoConStock`: `unidades_por_caja` → `blisters_por_caja`; `tiene_lotes` → `require_lote`
- `VentaTicket.metodo_pago`: eliminó `yape/plin`

### 2. `src/models/productos.ts` — REESCRITO

**Cambios:**
- Eliminó `PRICE_CALC_COLUMNS` (columnas calculadas de precio): los precios ahora son directos (`precio_unidad`, `precio_blister`, `precio_caja`)
- `createLote`: usa `costo_unitario` en vez de `precio_unitario`; inserta `compra_id`; estado por defecto `'activo'`
- `consumeLote`: ahora inserta en `movimiento_lotes` automáticamente; llama a `_updateLoteEstado`
- `returnToLote`: ahora inserta en `movimiento_lotes` automáticamente; llama a `_updateLoteEstado`
- Nuevo: `getCostoUnitarioLote(productoId)` — obtiene el costo unitario FIFO del lote más antiguo
- Nuevo: `_updateLoteEstado(loteId)` — actualiza estado del lote a `'agotado'` o `'vencido'`
- `create`: eliminó columnas `precio_compra`, `precio_venta`, `fecha_vencimiento` del INSERT
- `UPDATEABLE_FIELDS`: eliminó `precio_compra`, `precio_venta`, `fecha_vencimiento`; agregó `blisters_por_caja`
- `getAll`, `findById`: simplificó queries (ya no necesita calcular precios derivados)
- `calculatePrice`: simplificado para usar columnas directas
- `convertToBaseUnits`: usa `blisters_por_caja` en vez de `unidades_por_caja`

### 3. `src/models/ventas.ts` — REESCRITO

**Cambios:**
- `create`: inserta `subtotal` en tabla `ventas`; ahora calcula `costo_real_unitario` desde el lote (FIFO); registra `lote_id` en `detalle_ventas`; inserta en `inventario` con `stock_anterior`/`stock_nuevo`, `tipo_referencia`, `referencia_id`
- `cancelVenta`: ahora registra movimiento en `inventario` como tipo `'devolucion'` con `stock_anterior`/`stock_nuevo`; usa `unidades_base` de `detalle_ventas`
- `getById`, `getVentaConProductosById`: actualizó columnas SELECT para incluir nuevos campos (`lote_id`, `unidades_base`, `costo_real_unitario`, etc.)

### 4. `src/models/compras.ts` — REESCRITO

**Cambios:**
- `create`: inserta `caja_id`, `subtotal`, `descuento`, `observaciones` en `compras`; calcula `factor_conversion` y `unidades_totales` según `tipo_compra`; crea lotes automáticos si `require_lote`; registra en `movimiento_lotes`; registra en `inventario` con stock tracking completo
- `getById`: incluye `numero_lote` en detalles; JOIN con `lotes`
- Los detalles ahora usan `tipo_compra` en vez de `unidad_compra`

### 5. `src/models/inventario.ts` — REESCRITO

**Cambios:**
- `registrarMovimiento`: ahora acepta `usuario_id`, `tipo_referencia`, `referencia_id`, `stock_anterior`, `stock_nuevo`; eliminó `unidades_base`
- `findAll`: incluye `usuario_nombre` vía JOIN
- `getMovimientosResumen`: actualizó CASE para incluir `'devolucion'` y `'vencido'`
- Movimiento `'ajuste'` actualiza stock del producto directamente

### 6. `src/models/proveedores.ts` — NUEVO (reemplaza proovedores.ts)

**Cambios:**
- Nombre corregido: `ProveedoresModel` (antes `ProovedoresModel`)
- Eliminó columna `ruc` del INSERT
- Agregó columna `email`

### 7. `src/models/movimientoLotes.ts` — NUEVO

Modelo para la tabla `movimiento_lotes`: métodos `findByLoteId`, `create`, `getResumen`.

### 8. `src/models/historialPrecios.ts` — NUEVO

Modelo para la tabla `historial_precios`: métodos `findByProductoId`, `create`.

### 9. `src/models/reportes.ts` — EDITADO

- Valor inventario: `precio_venta` → `precio_unidad`
- Stock bajo: `WHERE stock < 10` → `WHERE stock <= stock_minimo`

### 10. `src/models/reportePdf.ts` — EDITADO

- `controlInventario()`: eliminó `precio_compra`, `precio_venta`, `fecha_vencimiento` directos; agregó `precio_unidad`, `precio_blister`, `precio_caja`, JOIN con `lotes`

### 11. `src/validators/productosValidators.ts` — REESCRITO

- Eliminó `precio_compra`, `precio_venta`
- `unidades_por_caja` → `blisters_por_caja`
- Lote: `precio_unitario` → `costo_unitario`; agregó `compra_id`

### 12. `src/validators/comprasValidators.ts` — REESCRITO

- `unidad_compra` → `tipo_compra`
- Agregó `numero_lote`, `fecha_vencimiento` a detalle de compra
- Agregó `caja_id`, `subtotal`, `descuento`, `observaciones` a compra

### 13. `src/validators/proveedoresValidators.ts` — RENOMBRADO + REESCRITO

- Nombre corregido: `proovedoresValidators.ts` → `proveedoresValidators.ts`
- Eliminó `ruc`; agregó `email`

### 14. `src/validators/inventarioValidators.ts` — REESCRITO

- Expandió `movimiento` a 5 opciones (agregó `'vencido'`, `'devolucion'`)
- Agregó campos: `lote_id`, `usuario_id`, `tipo_referencia`, `referencia_id`, `stock_anterior`, `stock_nuevo`

### 15. `src/models/detalleCompra.ts` — REESCRITO

- Columnas actualizadas: `tipo_compra` (en vez de `unidad_compra`), agregó `lote_id`, `factor_conversion`, `unidades_totales`, `costo_unitario_compra`

### 16. `src/models/detalleVenta.ts` — REESCRITO

- Columnas actualizadas: agregó `lote_id`, `unidades_base`, `costo_real_unitario`, `descuento`, `adicional`

### 17. `src/controllers/proveedoresControllers.ts` — NUEVO (reemplaza proovedoresControllers.ts)

- Nombre corregido: `ProveedoresController`, importa de `../models/proveedores`

### 18. `src/routes/proveedoresRoutes.ts` — NUEVO (reemplaza proovedoresRoutes.ts)

- Nombre corregido: importa de `../controllers/proveedoresControllers`

### 19. `src/index.ts` — EDITADO

- Import corregido: `./routes/proovedoresRoutes` → `./routes/proveedoresRoutes`

### 20. `src/config/db.ts` — EDITADO

- `DB_NAME` por defecto: `"farmacia"` → `"newfarmacia"`

### 21. `.env.example` — EDITADO

- Valores por defecto sugeridos; `DB_NAME="newfarmacia"`

---

## Archivos eliminados

| Archivo | Motivo |
|---------|--------|
| `src/models/proovedores.ts` | Reemplazado por `proveedores.ts` (corrección typo) |
| `src/controllers/proovedoresControllers.ts` | Reemplazado por `proveedoresControllers.ts` |
| `src/routes/proovedoresRoutes.ts` | Reemplazado por `proveedoresRoutes.ts` |

---

## Archivos verificados sin cambios necesarios

- `models/caja.ts`, `models/clientes.ts`, `models/categorias.ts`, `models/usuarios.ts`, `models/resumenVentas.ts`
- `controllers/usuarioControllers.ts`, `controllers/categoriaControllers.ts`, `controllers/clientesControllers.ts`, `controllers/reporteControllerPdf.ts`, `controllers/backupController.ts`
- `routes/alertasRoutes.ts`, `routes/backUpRoutes.ts`, `routes/cajaRoutes.ts`, `routes/categoriaRoutes.ts`, `routes/clientesRoutes.ts`, `routes/comprasRoutes.ts`, `routes/inventarioRoutes.ts`, `routes/productoRoutes.ts`, `routes/reportePdfRoutes.ts`, `routes/reporteRoutes.ts`, `routes/usuarioRoutes.ts`, `routes/ventasRoutes.ts`
- `validators/categoriasValidators.ts`, `validators/clientesValidators.ts`, `validators/usuarioValidators.ts`, `validators/cajaValidators.ts`
- `middlewares/authMiddleware.ts`, `middlewares/verificarCajaAbierta.ts`
- `utils/ticketGenerator.ts`, `utils/cajaUtils.ts`
- `constants/cajaConstants.ts`, `constants/estadisticas.ts`
- `services/backup.services.ts`, `services/diagnostic.services.ts`
- `types/express/index.d.ts`

---

## Mejoras arquitectónicas

1. **Separación de responsabilidades**: Los movimientos de lotes ahora tienen su propio modelo (`movimientoLotes.ts`) y se insertan automáticamente desde `productos.ts` en cada consumo/devolución.
2. **Historial de precios**: El nuevo modelo `historialPrecios.ts` permite trackear cambios de precio — listo para integración futura con el controlador de productos.
3. **Seguimiento de inventario completo**: Cada movimiento de inventario ahora registra `stock_anterior`/`stock_nuevo`, `usuario_id` y `tipo_referencia`/`referencia_id`, permitiendo trazabilidad total.
4. **Cálculo de ganancia real**: Las ventas ahora calculan `costo_real_unitario` desde el lote (FIFO), dando ganancia exacta por producto.
5. **Manejo de estado de lotes**: Los lotes se actualizan automáticamente a `'agotado'` o `'vencido'` según disponibilidad y fecha.
6. **Normalización de nombres**: Se corrigió el typo `proovedor` → `proveedor` en toda la base de código.
7. **Migración a triggers**: La nueva BD.sql incluye triggers para alertas de stock, resumen de ventas y actualización de caja — la lógica de aplicación ya no necesita duplicar estas funciones.

---

## Notas de migración

1. La base de datos debe ejecutarse con `BD.sql` para crear la BD `newfarmacia` con todas las tablas, relaciones, índices y triggers.
2. El `seed:master` existente en `package.json` usa el modelo `UsuarioModel.create` y debería funcionar sin cambios.
3. Los endpoints existentes mantienen la misma estructura de rutas (`/api/productos`, `/api/ventas`, etc.).
4. Las respuestas JSON mantienen compatibilidad hacia atrás para campos comunes.
5. Antes de desplegar, ejecutar `npm install` para asegurar todas las dependencias.
6. El backend se ejecuta con `ts-node-dev` — no requiere compilación previa.

---

## Próximos pasos recomendados

- [ ] Conectar el frontend para usar los nuevos campos opcionales (`lote_id`, `costo_real_unitario`, etc.)
- [ ] Integrar `historial_precios` en el controlador de productos (registrar cambios automáticamente al actualizar precios)
- [ ] Agregar pruebas unitarias para las nuevas funcionalidades de lotes e inventario
- [ ] Verificar que los triggers de la BD funcionan correctamente con la lógica de aplicación
