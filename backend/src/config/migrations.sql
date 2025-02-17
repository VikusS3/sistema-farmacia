CREATE DATABASE IF NOT EXISTS farmacia;

USE farmacia;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol ENUM('admin', 'empleado') DEFAULT 'empleado',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


    CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        precio_compra DECIMAL(10, 2) NOT NULL,
        precio_venta DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        stock_minimo INT NOT NULL,
        unidad_medida VARCHAR(50) DEFAULT 'unidad', -- Puede ser 'tableta', 'ampolla', 'caja', etc.
        conversion INT DEFAULT 1, -- Si es una caja, cuántas unidades contiene. Si es individual, será 1.
        categoria_id INT, -- Relación con tabla de categorías
        fecha_vencimiento DATE DEFAULT NULL, -- Permitir NULL para productos no perecederos
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    );


CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(15),
    direccion VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(15),
    direccion VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT,
    usuario_id INT,
    fecha DATE,
    total DECIMAL(10, 2),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

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

CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    usuario_id INT,
    fecha DATE,
    total DECIMAL(10, 2),
    descuento DECIMAL(10, 2),
    adicional DECIMAL(10, 2),
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia'),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT,
    precio_unitario DECIMAL(10, 2),
    descuento DECIMAL(10, 2),
    adicional DECIMAL(10, 2),
    subtotal DECIMAL(10, 2),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS inventarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    movimiento ENUM('compra', 'venta', 'ajuste'),
    cantidad INT,
    motivo VARCHAR(100),
    fecha_movimiento DATE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS resumen_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    total_dia DECIMAL(10, 2),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER actualizar_resumen_ventas
AFTER INSERT ON ventas
FOR EACH ROW
BEGIN
    -- Intenta actualizar el total del día en resumen_ventas
    IF EXISTS (SELECT * FROM resumen_ventas WHERE fecha = NEW.fecha) THEN
        UPDATE resumen_ventas
        SET total_dia = total_dia + NEW.total
        WHERE fecha = NEW.fecha;
    ELSE
        -- Si no existe un resumen para ese día, crea un nuevo registro
        INSERT INTO resumen_ventas (fecha, total_dia)
        VALUES (NEW.fecha, NEW.total);
    END IF;
END$$

DELIMITER ;
