-- Enhanced Pharmacy Database Schema v2
-- Supports multi-unit products (unit, blister, box), cash register, and inventory tracking

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

-- =====================================================
-- TABLE: cajas (Cash Register Sessions)
-- =====================================================
CREATE TABLE IF NOT EXISTS cajas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_apertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto_apertura DECIMAL(10, 2) NOT NULL DEFAULT 0,
    fecha_cierre DATETIME DEFAULT NULL,
    monto_cierre DECIMAL(10, 2) DEFAULT NULL,
    total_ventas DECIMAL(10, 2) DEFAULT 0,
    diferencia DECIMAL(10, 2) DEFAULT NULL,
    estado ENUM('abierta', 'cerrada') NOT NULL DEFAULT 'abierta',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =====================================================
-- Update productos table for multi-unit pricing
-- =====================================================
ALTER TABLE productos 
    ADD COLUMN IF NOT EXISTS precio_unidad DECIMAL(10, 2) DEFAULT NULL COMMENT 'Precio por unidad (pastilla)',
    ADD COLUMN IF NOT EXISTS precio_blister DECIMAL(10, 2) DEFAULT NULL COMMENT 'Precio por blister',
    ADD COLUMN IF NOT EXISTS precio_caja DECIMAL(10, 2) DEFAULT NULL COMMENT 'Precio por caja completa',
    ADD COLUMN IF NOT EXISTS unidades_por_blister INT DEFAULT 1 COMMENT 'Cuántas unidades (pastillas) tiene un blister',
    ADD COLUMN IF NOT EXISTS unidades_por_caja INT DEFAULT 1 COMMENT 'Cuántas unidades (pastillas) tiene una caja',
    ADD COLUMN IF NOT EXISTS require_lote BOOLEAN DEFAULT FALSE COMMENT 'Si requiere control de lote/vencimiento';

-- =====================================================
-- TABLE: lotes (Inventory lots with expiration)
-- =====================================================
CREATE TABLE IF NOT EXISTS lotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    numero_lote VARCHAR(50) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    cantidad_inicial INT NOT NULL,
    cantidad_disponible INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- =====================================================
-- Add caja_id to ventas table
-- =====================================================
ALTER TABLE ventas 
    ADD COLUMN IF NOT EXISTS caja_id INT DEFAULT NULL,
    ADD FOREIGN KEY IF NOT EXISTS (caja_id) REFERENCES cajas(id);

-- =====================================================
-- Add unidad_venta to detalle_ventas
-- =====================================================
ALTER TABLE detalle_ventas 
    ADD COLUMN IF NOT EXISTS unidad_venta ENUM('unidad', 'blister', 'caja') DEFAULT 'unidad',
    ADD COLUMN IF NOT EXISTS ganancia DECIMAL(10, 2) DEFAULT 0;

-- =====================================================
-- Update inventario table
-- =====================================================
ALTER TABLE inventario 
    ADD COLUMN IF NOT EXISTS lote_id INT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS unidades_base INT DEFAULT 0 COMMENT 'Cantidad en unidades base (pastillas)',
    ADD FOREIGN KEY IF NOT EXISTS (lote_id) REFERENCES lotes(id);

-- =====================================================
-- Update compras table
-- =====================================================
ALTER TABLE compras 
    ADD COLUMN IF NOT EXISTS caja_id INT DEFAULT NULL,
    ADD FOREIGN KEY IF NOT EXISTS (caja_id) REFERENCES cajas(id);

-- =====================================================
-- TABLE: alertas_stock (Low stock alerts)
-- =====================================================
CREATE TABLE IF NOT EXISTS alertas_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo_alerta ENUM('bajo_stock', 'sin_stock', 'por_vencer', 'vencido') NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: historial_precios (Price history tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS historial_precios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo_precio ENUM('precio_unidad', 'precio_blister', 'precio_caja', 'precio_compra', 'precio_venta') NOT NULL,
    precio_anterior DECIMAL(10, 2) NOT NULL,
    precio_nuevo DECIMAL(10, 2) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_productos_stock_minimo ON productos(stock, stock_minimo);
CREATE INDEX IF NOT EXISTS idx_lotes_vencimiento ON lotes(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_lotes_producto ON lotes(producto_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_caja ON ventas(caja_id);
CREATE INDEX IF NOT EXISTS idx_inventario_fecha ON inventario(fecha_movimiento);
CREATE INDEX IF NOT EXISTS idx_alertas_producto ON alertas_stock(producto_id, leida);

-- =====================================================
-- TRIGGER: Auto-create low stock alert
-- =====================================================
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS trigger_alerta_bajo_stock
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
    DECLARE mensaje_alerta TEXT;
    
    -- Check for low stock
    IF NEW.stock <= NEW.stock_minimo AND OLD.stock > NEW.stock_minimo THEN
        SET mensaje_alerta = CONCAT('Alerta: Stock bajo para ', NEW.nombre, '. Stock actual: ', NEW.stock, ', mínimo: ', NEW.stock_minimo);
        INSERT INTO alertas_stock (producto_id, tipo_alerta, mensaje) 
        VALUES (NEW.id, 'bajo_stock', mensaje_alerta);
    END IF;
    
    -- Check for out of stock
    IF NEW.stock = 0 AND OLD.stock > 0 THEN
        SET mensaje_alerta = CONCAT('Alerta: Sin stock para ', NEW.nombre);
        INSERT INTO alertas_stock (producto_id, tipo_alerta, mensaje) 
        VALUES (NEW.id, 'sin_stock', mensaje_alerta);
    END IF;
END$$
DELIMITER ;

-- =====================================================
-- TRIGGER: Auto-create expiration alert
-- =====================================================
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS trigger_alerta_vencimiento
AFTER INSERT ON lotes
FOR EACH ROW
BEGIN
    DECLARE dias_vencer INT;
    SET dias_vencer = DATEDIFF(NEW.fecha_vencimiento, CURDATE());
    
    IF dias_vencer <= 30 THEN
        INSERT INTO alertas_stock (producto_id, tipo_alerta, mensaje) 
        VALUES (
            NEW.producto_id, 
            'por_vencer', 
            CONCAT('El lote ', NEW.numero_lote, ' vence en ', dias_vencer, ' días')
        );
    END IF;
END$$
DELIMITER ;

-- =====================================================
-- TRIGGER: Update caja total on sale
-- =====================================================
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS trigger_actualizar_caja_venta
AFTER INSERT ON ventas
FOR EACH ROW
BEGIN
    IF NEW.caja_id IS NOT NULL THEN
        UPDATE cajas 
        SET total_ventas = total_ventas + NEW.total 
        WHERE id = NEW.caja_id AND estado = 'abierta';
    END IF;
END$$
DELIMITER ;

COMMIT;

/* Sample data for testing */
-- INSERT INTO productos (nombre, descripcion, precio_compra, precio_venta, precio_unidad, precio_blister, precio_caja, stock, stock_minimo, unidad_medida, unidades_por_blister, unidades_por_caja, categoria_id) 
-- VALUES ('Paracetamol 500mg', 'Analgésico y antipirético', 0.50, 1.00, 0.50, 5.00, 45.00, 1000, 50, 'tableta', 10, 100, 1);