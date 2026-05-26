-- ============================================
-- BASE DE DATOS: newfarmacia
-- VERSION PROFESIONAL FARMACIA
-- ============================================

CREATE DATABASE IF NOT EXISTS newfarmacia CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE newfarmacia;

-- ============================================
-- TABLA: usuarios
-- ============================================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'empleado') DEFAULT 'empleado',
    estado TINYINT(1) DEFAULT 1,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: categorias
-- ============================================

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: clientes
-- ============================================

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: proveedores
-- ============================================

CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: productos
-- ============================================

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria_id INT,
    stock INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 0,
    unidad_medida VARCHAR(50) DEFAULT 'unidad',
    unidades_por_blister INT DEFAULT 1,
    blisters_por_caja INT DEFAULT 1,
    precio_unidad DECIMAL(10, 2) DEFAULT 0,
    precio_blister DECIMAL(10, 2) DEFAULT 0,
    precio_caja DECIMAL(10, 2) DEFAULT 0,
    require_lote TINYINT(1) DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE SET NULL
);

CREATE INDEX idx_productos_stock ON productos (stock, stock_minimo);

-- ============================================
-- TABLA: cajas
-- ============================================

CREATE TABLE cajas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_apertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto_apertura DECIMAL(10, 2) DEFAULT 0,
    fecha_cierre DATETIME NULL,
    monto_cierre DECIMAL(10, 2) NULL,
    total_ventas DECIMAL(10, 2) DEFAULT 0,
    diferencia DECIMAL(10, 2) NULL,
    estado ENUM('abierta', 'cerrada') DEFAULT 'abierta',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_caja_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

-- ============================================
-- TABLA: compras
-- ============================================

CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT,
    usuario_id INT,
    caja_id INT NULL,
    fecha DATE NOT NULL,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    descuento DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    observaciones TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_compra_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores (id),
    CONSTRAINT fk_compra_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    CONSTRAINT fk_compra_caja FOREIGN KEY (caja_id) REFERENCES cajas (id)
);

-- ============================================
-- TABLA: lotes
-- ============================================

CREATE TABLE lotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    compra_id INT NULL,
    numero_lote VARCHAR(50) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    cantidad_inicial INT NOT NULL,
    cantidad_disponible INT NOT NULL,
    costo_unitario DECIMAL(10, 2) NOT NULL,
    estado ENUM(
        'activo',
        'agotado',
        'vencido'
    ) DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lote_producto FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
    CONSTRAINT fk_lote_compra FOREIGN KEY (compra_id) REFERENCES compras (id) ON DELETE SET NULL
);

CREATE INDEX idx_lote_vencimiento ON lotes (fecha_vencimiento);

-- ============================================
-- TABLA: detalle_compras
-- ============================================

CREATE TABLE detalle_compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    compra_id INT NOT NULL,
    producto_id INT NOT NULL,
    lote_id INT NULL,
    tipo_compra ENUM('unidad', 'blister', 'caja') NOT NULL,
    cantidad INT NOT NULL,
    factor_conversion INT NOT NULL,
    unidades_totales INT NOT NULL,
    costo_unitario_compra DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_detalle_compra FOREIGN KEY (compra_id) REFERENCES compras (id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos (id),
    CONSTRAINT fk_detalle_lote FOREIGN KEY (lote_id) REFERENCES lotes (id) ON DELETE SET NULL
);

-- ============================================
-- TABLA: ventas
-- ============================================

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NULL,
    usuario_id INT NULL,
    caja_id INT NULL,
    fecha DATE NOT NULL,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    descuento DECIMAL(10, 2) DEFAULT 0,
    adicional DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    metodo_pago ENUM(
        'efectivo',
        'tarjeta',
        'transferencia'
    ) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_venta_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id),
    CONSTRAINT fk_venta_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    CONSTRAINT fk_venta_caja FOREIGN KEY (caja_id) REFERENCES cajas (id)
);

CREATE INDEX idx_ventas_fecha ON ventas (fecha);

-- ============================================
-- TABLA: detalle_ventas
-- ============================================

CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    lote_id INT NULL,
    unidad_venta ENUM('unidad', 'blister', 'caja') DEFAULT 'unidad',
    cantidad INT NOT NULL,
    unidades_base INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    costo_real_unitario DECIMAL(10, 2) NOT NULL,
    descuento DECIMAL(10, 2) DEFAULT 0,
    adicional DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    ganancia DECIMAL(10, 2) DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_detalle_venta FOREIGN KEY (venta_id) REFERENCES ventas (id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_venta_producto FOREIGN KEY (producto_id) REFERENCES productos (id),
    CONSTRAINT fk_detalle_venta_lote FOREIGN KEY (lote_id) REFERENCES lotes (id) ON DELETE SET NULL
);

-- ============================================
-- TABLA: inventario
-- ============================================

CREATE TABLE inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    lote_id INT NULL,
    usuario_id INT NULL,
    movimiento ENUM(
        'compra',
        'venta',
        'ajuste',
        'vencido',
        'devolucion'
    ) NOT NULL,
    tipo_referencia ENUM('compra', 'venta', 'manual') DEFAULT 'manual',
    referencia_id INT NULL,
    cantidad INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    motivo VARCHAR(255),
    fecha_movimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventario_producto FOREIGN KEY (producto_id) REFERENCES productos (id),
    CONSTRAINT fk_inventario_lote FOREIGN KEY (lote_id) REFERENCES lotes (id),
    CONSTRAINT fk_inventario_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

-- ============================================
-- TABLA: movimiento_lotes
-- ============================================

CREATE TABLE movimiento_lotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lote_id INT NOT NULL,
    tipo ENUM(
        'entrada',
        'salida',
        'ajuste',
        'vencido'
    ) NOT NULL,
    cantidad INT NOT NULL,
    motivo TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movimiento_lote FOREIGN KEY (lote_id) REFERENCES lotes (id) ON DELETE CASCADE
);

-- ============================================
-- TABLA: alertas_stock
-- ============================================

CREATE TABLE alertas_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo_alerta ENUM(
        'bajo_stock',
        'sin_stock',
        'por_vencer',
        'vencido'
    ) NOT NULL,
    mensaje TEXT NOT NULL,
    leida TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alerta_producto FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
);

-- ============================================
-- TABLA: historial_precios
-- ============================================

CREATE TABLE historial_precios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo_precio ENUM(
        'precio_unidad',
        'precio_blister',
        'precio_caja'
    ) NOT NULL,
    precio_anterior DECIMAL(10, 2) NOT NULL,
    precio_nuevo DECIMAL(10, 2) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historial_producto FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
);

-- ============================================
-- TABLA: resumen_ventas
-- ============================================

CREATE TABLE resumen_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    total_dia DECIMAL(10, 2) DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER $$

-- ============================================
-- ALERTA BAJO STOCK
-- ============================================

CREATE TRIGGER trigger_alerta_bajo_stock
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN

    DECLARE mensaje_alerta TEXT;

    IF NEW.stock <= NEW.stock_minimo
    AND OLD.stock > NEW.stock_minimo THEN

        SET mensaje_alerta = CONCAT(
            'Stock bajo para ',
            NEW.nombre,
            '. Stock actual: ',
            NEW.stock
        );

        INSERT INTO alertas_stock (
            producto_id,
            tipo_alerta,
            mensaje
        )
        VALUES (
            NEW.id,
            'bajo_stock',
            mensaje_alerta
        );

    END IF;

    IF NEW.stock = 0
    AND OLD.stock > 0 THEN

        SET mensaje_alerta = CONCAT(
            'Producto sin stock: ',
            NEW.nombre
        );

        INSERT INTO alertas_stock (
            producto_id,
            tipo_alerta,
            mensaje
        )
        VALUES (
            NEW.id,
            'sin_stock',
            mensaje_alerta
        );

    END IF;

END$$

-- ============================================
-- ALERTA VENCIMIENTO
-- ============================================

CREATE TRIGGER trigger_alerta_vencimiento
AFTER INSERT ON lotes
FOR EACH ROW
BEGIN

    DECLARE dias_vencer INT;

    SET dias_vencer =
    DATEDIFF(NEW.fecha_vencimiento, CURDATE());

    IF dias_vencer <= 30 THEN

        INSERT INTO alertas_stock (
            producto_id,
            tipo_alerta,
            mensaje
        )
        VALUES (
            NEW.producto_id,
            'por_vencer',
            CONCAT(
                'Lote ',
                NEW.numero_lote,
                ' vence en ',
                dias_vencer,
                ' días'
            )
        );

    END IF;

END$$

-- ============================================
-- ACTUALIZAR RESUMEN VENTAS
-- ============================================

CREATE TRIGGER trigger_resumen_ventas
AFTER INSERT ON ventas
FOR EACH ROW
BEGIN

    IF EXISTS (
        SELECT id
        FROM resumen_ventas
        WHERE fecha = NEW.fecha
    ) THEN

        UPDATE resumen_ventas
        SET total_dia = total_dia + NEW.total
        WHERE fecha = NEW.fecha;

    ELSE

        INSERT INTO resumen_ventas (
            fecha,
            total_dia
        )
        VALUES (
            NEW.fecha,
            NEW.total
        );

    END IF;

END$$

-- ============================================
-- ACTUALIZAR TOTAL CAJA
-- ============================================

CREATE TRIGGER trigger_actualizar_caja_venta
AFTER INSERT ON ventas
FOR EACH ROW
BEGIN

    IF NEW.caja_id IS NOT NULL THEN

        UPDATE cajas
        SET total_ventas = total_ventas + NEW.total
        WHERE id = NEW.caja_id
        AND estado = 'abierta';

    END IF;

END$$

DELIMITER;

-- ============================================
-- DATOS INICIALES
-- ============================================

INSERT INTO
    categorias (nombre, descripcion)
VALUES (
        'Pastillas',
        'Medicamentos en tabletas'
    ),
    (
        'Cuidado de piel',
        'Productos dermatológicos'
    );

INSERT INTO
    usuarios (nombre, email, password, rol)
VALUES (
        'Administrador',
        'admin@farmacia.com',
        '$2b$10$vLtoh3qKzz/MWW/CMuR1Ku6jvKMLYiXrVFIcCpr1.77jI5hd0NYIO',
        'admin'
    );

INSERT INTO
    clientes (
        nombre,
        email,
        telefono,
        direccion
    )
VALUES (
        'Cliente General',
        'cliente@example.com',
        '999999999',
        'Lima'
    );

INSERT INTO
    proveedores (
        nombre,
        email,
        telefono,
        direccion
    )
VALUES (
        'Distribuidora Farma',
        'proveedor@example.com',
        '988888888',
        'Av Perú 123'
    );

INSERT INTO
    productos (
        nombre,
        descripcion,
        categoria_id,
        stock,
        stock_minimo,
        unidad_medida,
        unidades_por_blister,
        blisters_por_caja,
        precio_unidad,
        precio_blister,
        precio_caja,
        require_lote
    )
VALUES (
        'Ibuprofeno 200mg',
        'Antiinflamatorio',
        1,
        0,
        20,
        'tableta',
        8,
        4,
        1.50,
        5.50,
        20.00,
        1
    );

-- ============================================
-- FIN SCRIPT
-- ============================================