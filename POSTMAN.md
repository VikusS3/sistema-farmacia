# Postman — Colección de Rutas API

> **Base URL:** `http://localhost:5000/api`
>
> **Autenticación:** Todas las rutas requieren `Authorization: Bearer <token>` excepto `/usuarios/login`.
> Obtené el token primero con el login y usalo en todas las demás peticiones.

---

## 1. Autenticación

### POST /usuarios/login — Obtener token

```
POST http://localhost:5000/api/usuarios/login
```

```json
{
  "email": "admin@farmacia.com",
  "password": "admin123"
}
```

**Respuesta exitosa (200):**
```json
{
  "usuario": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@farmacia.com",
    "rol": "admin",
    "estado": 1
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

> Copiar el `token` y ponerlo en todas las rutas siguientes como:
> `Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`

---

## 2. Usuarios

### POST /usuarios — Crear empleado

```
POST http://localhost:5000/api/usuarios
```

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@farmacia.com",
  "password": "123456",
  "rol": "empleado"
}
```

### PUT /usuarios/:id — Actualizar usuario

```
PUT http://localhost:5000/api/usuarios/2
```

```json
{
  "nombre": "Juan Pérez Actualizado",
  "rol": "empleado"
}
```

### GET /usuarios — Listar todos

```
GET http://localhost:5000/api/usuarios
```

### GET /usuarios/:id — Obtener uno

```
GET http://localhost:5000/api/usuarios/2
```

### DELETE /usuarios/:id — Eliminar

```
DELETE http://localhost:5000/api/usuarios/2
```

---

## 3. Categorías

### POST /categorias — Crear

```
POST http://localhost:5000/api/categorias
```

```json
{
  "nombre": "Analgésicos",
  "descripcion": "Medicamentos para el alivio del dolor"
}
```

### PUT /categorias/:id — Actualizar

```
PUT http://localhost:5000/api/categorias/1
```

```json
{
  "nombre": "Antiinflamatorios"
}
```

### GET /categorias — Listar

```
GET http://localhost:5000/api/categorias
```

### GET /categorias/:id — Obtener

```
GET http://localhost:5000/api/categorias/1
```

### DELETE /categorias/:id — Eliminar

```
DELETE http://localhost:5000/api/categorias/1
```

---

## 4. Clientes

### POST /clientes — Crear

```
POST http://localhost:5000/api/clientes
```

```json
{
  "nombre": "María García",
  "email": "maria@email.com",
  "telefono": "987654321",
  "direccion": "Av. Principal 123, Lima"
}
```

### PUT /clientes/:id — Actualizar

```
PUT http://localhost:5000/api/clientes/1
```

```json
{
  "nombre": "María García López",
  "telefono": "999888777"
}
```

### GET /clientes — Listar

```
GET http://localhost:5000/api/clientes
```

### GET /clientes/:id — Obtener

```
GET http://localhost:5000/api/clientes/1
```

### DELETE /clientes/:id — Eliminar

```
DELETE http://localhost:5000/api/clientes/1
```

---

## 5. Proveedores

### POST /proveedores — Crear

```
POST http://localhost:5000/api/proveedores
```

```json
{
  "nombre": "Distribuidora Farmacéutica SAC",
  "email": "ventas@distribuidora.com",
  "telefono": "123456789",
  "direccion": "Jr. Comercio 456, Lima"
}
```

### PUT /proveedores/:id — Actualizar

```
PUT http://localhost:5000/api/proveedores/1
```

```json
{
  "nombre": "Distribuidora Farmacéutica del Perú SAC",
  "telefono": "111222333"
}
```

### GET /proveedores — Listar

```
GET http://localhost:5000/api/proveedores
```

### GET /proveedores/:id — Obtener

```
GET http://localhost:5000/api/proveedores/1
```

### DELETE /proveedores/:id — Eliminar

```
DELETE http://localhost:5000/api/proveedores/1
```

---

## 6. Productos

### POST /productos — Crear (sin lote)

```
POST http://localhost:5000/api/productos
```

**Producto simple (sin control de lote):**
```json
{
  "nombre": "Paracetamol 500mg",
  "descripcion": "Analgésico y antitérmico",
  "categoria_id": 1,
  "precio_unidad": 1.50,
  "precio_blister": 12.00,
  "precio_caja": 45.00,
  "unidades_por_blister": 10,
  "blisters_por_caja": 25,
  "stock": 100,
  "stock_minimo": 20,
  "require_lote": false,
  "unidad_medida": "unidad"
}
```

**Producto con control de lote (require_lote: true):**
```json
{
  "nombre": "Amoxicilina 500mg",
  "descripcion": "Antibiótico de amplio espectro",
  "categoria_id": 1,
  "precio_unidad": 2.00,
  "precio_blister": 18.00,
  "precio_caja": 70.00,
  "unidades_por_blister": 10,
  "blisters_por_caja": 20,
  "stock": 0,
  "stock_minimo": 50,
  "require_lote": true,
  "unidad_medida": "unidad"
}
```

### PUT /productos/:id — Actualizar

```
PUT http://localhost:5000/api/productos/1
```

```json
{
  "precio_unidad": 1.80,
  "stock_minimo": 30
}
```

### GET /productos — Listar todos

```
GET http://localhost:5000/api/productos
```

### GET /productos?categoria_id=1 — Filtrar por categoría

```
GET http://localhost:5000/api/productos?categoria_id=1
```

### GET /productos/bajo-stock — Stock bajo

```
GET http://localhost:5000/api/productos/bajo-stock
```

### GET /productos/por-vencer?dias=30 — Por vencer

```
GET http://localhost:5000/api/productos/por-vencer?dias=30
```

### GET /productos/vencimiento/vencidos — Vencidos

```
GET http://localhost:5000/api/productos/vencimiento/vencidos
```

### GET /productos/:id — Obtener uno

```
GET http://localhost:5000/api/productos/1
```

### POST /productos/verificar-stock — Verificar disponibilidad

```
POST http://localhost:5000/api/productos/verificar-stock
```

```json
{
  "producto_id": 1,
  "cantidad": 5,
  "unidad_venta": "unidad"
}
```

### DELETE /productos/:id — Eliminar

```
DELETE http://localhost:5000/api/productos/1
```

---

## 7. Lotes

### POST /productos/lotes — Crear lote manualmente

```
POST http://localhost:5000/api/productos/lotes
```

```json
{
  "producto_id": 2,
  "numero_lote": "LOTE-2025-001",
  "fecha_vencimiento": "2026-12-31",
  "cantidad_inicial": 200,
  "costo_unitario": 1.20
}
```

### GET /productos/lotes — Listar todos los lotes

```
GET http://localhost:5000/api/productos/lotes
```

### GET /productos/:id/lotes — Lotes de un producto

```
GET http://localhost:5000/api/productos/2/lotes
```

---

## 8. Compras (ingreso de stock)

**Flujo:** Primero crear categoría → proveedor → producto → abrir caja → luego registrar compra.

### POST /cajas/abrir — Abrir caja (antes de comprar o vender)

```
POST http://localhost:5000/api/cajas/abrir
```

```json
{
  "usuario_id": 1,
  "monto_apertura": 500.00
}
```

### POST /compras — Registrar compra

```
POST http://localhost:5000/api/compras
```

```json
{
  "proveedor_id": 1,
  "usuario_id": 1,
  "caja_id": 1,
  "subtotal": 240.00,
  "descuento": 10.00,
  "total": 230.00,
  "observaciones": "Compra mensual",
  "detalles": [
    {
      "producto_id": 1,
      "cantidad": 10,
      "tipo_compra": "blister",
      "subtotal": 120.00
    },
    {
      "producto_id": 2,
      "cantidad": 5,
      "tipo_compra": "caja",
      "subtotal": 120.00,
      "numero_lote": "LOTE-AMOXI-001",
      "fecha_vencimiento": "2026-10-15"
    }
  ]
}
```

### GET /compras — Listar compras

```
GET http://localhost:5000/api/compras
```

### GET /compras/:id — Obtener compra con detalles

```
GET http://localhost:5000/api/compras/1
```

---

## 9. Cajas

### POST /cajas/abrir — Abrir caja

```
POST http://localhost:5000/api/cajas/abrir
```

```json
{
  "usuario_id": 1,
  "monto_apertura": 500.00
}
```

### POST /cajas/cerrar — Cerrar caja

```
POST http://localhost:5000/api/cajas/cerrar
```

```json
{
  "caja_id": 1,
  "usuario_id": 1,
  "monto_cierre": 850.00
}
```

### GET /cajas/abierta/:usuario_id — Ver si hay caja abierta

```
GET http://localhost:5000/api/cajas/abierta/1
```

### GET /cajas — Listar todas las cajas

```
GET http://localhost:5000/api/cajas
```

### GET /cajas/:id — Obtener caja con ventas

```
GET http://localhost:5000/api/cajas/1
```

### GET /cajas/cerradas — Últimas cajas cerradas

```
GET http://localhost:5000/api/cajas/cerradas?limit=10
```

### GET /cajas/resumen-diario — Resumen del día

```
GET http://localhost:5000/api/cajas/resumen-diario?fecha=2025-05-26
```

> Si no se envía `fecha`, usa la fecha actual.

---

## 10. Ventas

> **Requisito:** Tener una caja abierta para el usuario. El middleware `verificarCajaAbierta` inyecta automáticamente el `caja_id`.

### POST /ventas — Registrar venta

```
POST http://localhost:5000/api/ventas
```

```json
{
  "cliente_id": 1,
  "usuario_id": 1,
  "adicional": 0,
  "descuento": 5.00,
  "metodo_pago": "efectivo",
  "detalle_venta": [
    {
      "producto_id": 1,
      "cantidad": 2,
      "unidad_venta": "unidad"
    },
    {
      "producto_id": 2,
      "cantidad": 1,
      "unidad_venta": "blister"
    }
  ]
}
```

> **Nota:** No enviar `caja_id` en el body. El middleware `verificarCajaAbierta` lo agrega automáticamente.

### GET /ventas — Listar ventas

```
GET http://localhost:5000/api/ventas
```

### GET /ventas/:id — Obtener venta

```
GET http://localhost:5000/api/ventas/1
```

### GET /ventas/by-date — Por rango de fechas

```
GET http://localhost:5000/api/ventas/by-date?fecha_inicio=2025-01-01&fecha_fin=2025-12-31
```

### GET /ventas/estadisticas — Estadísticas

```
GET http://localhost:5000/api/ventas/estadisticas?fecha_inicio=2025-01-01&fecha_fin=2025-12-31
```

### GET /ventas/cliente/:id — Ventas de un cliente

```
GET http://localhost:5000/api/ventas/cliente/1
```

### GET /ventas/:id/generar-ticket — Descargar ticket PDF

```
GET http://localhost:5000/api/ventas/1/generar-ticket
```

### GET /ventas/venta/:id/productos — Obtener venta con productos

```
GET http://localhost:5000/api/ventas/venta/1/productos
```

### POST /ventas/:id/cancel — Cancelar venta (devuelve stock)

```
POST http://localhost:5000/api/ventas/1/cancel
```

```json
{
  "motivo": "El cliente devolvió los productos por defecto de fábrica",
  "usuario_id": 1
}
```

---

## 11. Inventario

### GET /inventario — Listar movimientos

```
GET http://localhost:5000/api/inventario
```

### GET /inventario/:id — Obtener movimiento

```
GET http://localhost:5000/api/inventario/1
```

### POST /inventario/registrar — Registrar movimiento manual (ajuste)

```
POST http://localhost:5000/api/inventario/registrar
```

```json
{
  "producto_id": 1,
  "usuario_id": 1,
  "movimiento": "ajuste",
  "tipo_referencia": "manual",
  "cantidad": 50,
  "stock_anterior": 100,
  "stock_nuevo": 50,
  "motivo": "Ajuste por inventario físico"
}
```

### POST /inventario/verificar-stock — Verificar stock simple

```
POST http://localhost:5000/api/inventario/verificar-stock
```

```json
{
  "producto_id": 1,
  "cantidad": 10
}
```

---

## 12. Reportes (JSON)

### GET /reportes/metricas-dashboard — Métricas del dashboard

```
GET http://localhost:5000/api/reportes/metricas-dashboard
```

### GET /reportes/top-productos — Productos más vendidos

```
GET http://localhost:5000/api/reportes/top-productos?limit=5
```

### GET /reportes/ventas-mensuales — Ventas por mes

```
GET http://localhost:5000/api/reportes/ventas-mensuales
```

---

## 13. Reportes (PDF)

### GET /reportesPdf/reporte-ventas — Ventas por rango de fechas

```
GET http://localhost:5000/api/reportesPdf/reporte-ventas?desde=2025-01-01&hasta=2025-12-31
```

### GET /reportesPdf/reporte-ventas-mes — Ventas por mes

```
GET http://localhost:5000/api/reportesPdf/reporte-ventas-mes?mes=1&anio=2025
```

### GET /reportesPdf/reporte-ventas-anio — Ventas por año

```
GET http://localhost:5000/api/reportesPdf/reporte-ventas-anio?anio=2025
```

### GET /reportesPdf/reporte-inventario — Control de inventario

```
GET http://localhost:5000/api/reportesPdf/reporte-inventario
```

---

## 14. Alertas

### GET /alertas — Listar alertas

```
GET http://localhost:5000/api/alertas
```

```
GET http://localhost:5000/api/alertas?leida=false
```

### GET /alertas/contador — Contar no leídas

```
GET http://localhost:5000/api/alertas/contador
```

### PUT /alertas/:id/leida — Marcar como leída

```
PUT http://localhost:5000/api/alertas/1/leida
```

### PUT /alertas/leer-todas — Marcar todas como leídas

```
PUT http://localhost:5000/api/alertas/leer-todas
```

### DELETE /alertas/:id — Eliminar alerta

```
DELETE http://localhost:5000/api/alertas/1
```

---

## 15. Backup

### POST /backup — Descargar backup de BD

```
POST http://localhost:5000/api/backup
```

> Esto descarga un archivo `.sql`. No requiere body.

---

## Flujo de prueba recomendado (orden)

| Paso | Ruta | Descripción |
|------|------|-------------|
| 1 | `POST /usuarios/login` | Obtener token JWT |
| 2 | `POST /categorias` | Crear "Analgésicos" |
| 3 | `POST /clientes` | Crear "María García" |
| 4 | `POST /proveedores` | Crear distribuidora |
| 5 | `POST /productos` | Crear "Paracetamol 500mg" (sin lote) |
| 6 | `POST /productos` | Crear "Amoxicilina 500mg" (con lote) |
| 7 | `POST /cajas/abrir` | Abrir caja con monto inicial |
| 8 | `POST /compras` | Registrar compra con detalles |
| 9 | `POST /ventas` | Registrar venta (requiere caja abierta) |
| 10 | `GET /ventas/:id/generar-ticket` | Descargar ticket PDF |
| 11 | `POST /cajas/cerrar` | Cerrar caja |
| 12 | `GET /reportes/metricas-dashboard` | Ver dashboard |
