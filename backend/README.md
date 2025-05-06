# TAREAS

    - [x] Crear la base de datos y sus tablas
    - [x] Crear la configuración inicial del proyecto
    - [x] Crear el CRUD de la primera tabla (Usuarios)
    - [x] Hacer el CRUD de las demás tablas
    - [ ] Ver si hacer el registro de la venta en el inventario

# CONSIDERACIONES

Áreas de mejora y sugerencias:

### Gestión de lotes de productos

Si algunos productos tienen diferentes lotes (por ejemplo, con distintas fechas de vencimiento), sería útil agregar una tabla `lotes` relacionada con productos. Esto sería importante si necesitas rastrear inventarios más detalladamente:

```sql
    CREATE TABLE lotes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        producto_id INT NOT NULL,
        lote VARCHAR(50) NOT NULL,
        fecha_vencimiento DATE NOT NULL,
        cantidad INT NOT NULL,
        FOREIGN KEY (producto_id) REFERENCES productos(id)
    );
```

Esto también te ayudará a manejar inventarios con más precisión.

## Detalle de compras

Actualmente, la tabla `compras` no tiene una relación directa con los productos. Considera agregar una tabla `detalle_compras`, similar a `detalle_ventas`, para registrar los productos comprados y sus cantidades:

```sql
CREATE TABLE detalle_compras (
        id INT AUTO_INCREMENT PRIMARY KEY,
        compra_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad NULL,
        precio_unitario DECIMAL(10, 2)  NULL,
        subtotal DECIMAL(10, 2)  NULL,
        FOREIGN KEY (compra_id) REFERENCES compras(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
        );
```

### Control de stock en inventarios

Aunque la tabla `inventarios` registra movimientos, no parece haber un mecanismo para actualizar automáticamente el stock de productos. Podrías usar triggers para incrementar o decrementar el stock según el tipo de movimiento:

```sql
    DELIMITER $$

    CREATE TRIGGER actualizar_stock
    AFTER INSERT ON inventarios
    FOR EACH ROW
    BEGIN
        IF NEW.movimiento = 'compra' THEN
            UPDATE productos SET stock = stock + NEW.cantidad WHERE id = NEW.producto_id;
        ELSEIF NEW.movimiento = 'venta' THEN
            UPDATE productos SET stock = stock - NEW.cantidad WHERE id = NEW.producto_id;
        END IF;
    END$$

    DELIMITER ;
```

### Historial de precios

Si los precios de compra o venta cambian con el tiempo, sería útil crear una tabla para rastrear el historial de precios:

```sql
    CREATE TABLE historial_precios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        producto_id INT NOT NULL,
        precio_compra DECIMAL(10, 2) NOT NULL,
        precio_venta DECIMAL(10, 2) NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE DEFAULT NULL,
        FOREIGN KEY (producto_id) REFERENCES productos(id)
    );
```

### Mejoras en clientes y proveedores

Considera agregar un campo para identificar a los clientes o proveedores de manera única (como un RFC o NIT), dependiendo de las regulaciones de tu país.

### Métodos de pago en detalle

En la tabla `ventas`, el campo `metodo_pago` es útil, pero podrías considerar agregar una tabla `pagos` para manejar pagos parciales o múltiples métodos de pago en una misma venta.

### Correcciones de mensajes de errores del backend para el frontend

[] Cuando la venta el producto no tiene stock sufieciente mandar el mensaje, de igual manera con la actualizacion de la venta para corregir la cantidad de productos
