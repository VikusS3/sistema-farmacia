-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-05-2025 a las 00:33:23
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `farmacia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `creado_en`, `actualizado_en`) VALUES
(1, 'pastillas 2232', 'pastillas de diversos tamaños y colores', '2025-02-14 13:44:46', '2025-03-07 14:57:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `email`, `telefono`, `direccion`, `creado_en`, `actualizado_en`) VALUES
(1, 'Sin cliente', 'cliente1@example.com', '987858474', 'Calle Principal 123, Ciudad', '2025-02-13 13:11:07', '2025-02-13 13:13:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id` int(11) NOT NULL,
  `proveedor_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`id`, `proveedor_id`, `usuario_id`, `fecha`, `total`, `creado_en`, `actualizado_en`) VALUES
(23, 1, 4, '2025-03-21', 40.60, '2025-02-26 13:27:56', '2025-03-21 15:32:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compras`
--

CREATE TABLE `detalle_compras` (
  `id` int(11) NOT NULL,
  `compra_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_compras`
--

INSERT INTO `detalle_compras` (`id`, `compra_id`, `producto_id`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(52, 23, 1, 2, 12.50, 25.00),
(53, 23, 3, 1, 15.60, 15.60);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

CREATE TABLE `detalle_ventas` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) DEFAULT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `adicional` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_ventas`
--

INSERT INTO `detalle_ventas` (`id`, `venta_id`, `producto_id`, `cantidad`, `precio_unitario`, `descuento`, `adicional`, `subtotal`, `creado_en`, `actualizado_en`) VALUES
(31, 22, 1, 3, 15.99, NULL, NULL, 47.97, '2025-03-14 16:14:52', '2025-03-14 16:14:52'),
(32, 22, 3, 2, 20.40, NULL, NULL, 40.80, '2025-03-14 16:14:52', '2025-03-14 16:14:52'),
(33, 22, 5, 2, 3.00, NULL, NULL, 6.00, '2025-03-14 16:14:52', '2025-03-14 16:14:52');

--
-- Disparadores `detalle_ventas`
--
DELIMITER $$
CREATE TRIGGER `ajustar_stock_venta` BEFORE UPDATE ON `detalle_ventas` FOR EACH ROW BEGIN
    DECLARE diferencia INT;
    SET diferencia = OLD.cantidad - NEW.cantidad; 

    UPDATE productos 
    SET stock = stock + diferencia
    WHERE id = OLD.producto_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `devolver_stock_venta` AFTER DELETE ON `detalle_ventas` FOR EACH ROW BEGIN
    UPDATE productos 
    SET stock = stock + OLD.cantidad
    WHERE id = OLD.producto_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `restar_stock_venta` AFTER INSERT ON `detalle_ventas` FOR EACH ROW BEGIN
    UPDATE productos 
    SET stock = stock - NEW.cantidad
    WHERE id = NEW.producto_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `movimiento` enum('compra','venta','ajuste') DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `motivo` varchar(100) DEFAULT NULL,
  `fecha_movimiento` date DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id`, `producto_id`, `movimiento`, `cantidad`, `motivo`, `fecha_movimiento`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 'compra', 10, 'Reabastecimiento de stock', '2025-02-14', '2025-02-14 14:43:20', '2025-02-14 14:43:20'),
(2, 1, 'compra', 10, 'Reabastecimiento de stock', '2025-02-14', '2025-02-14 14:43:49', '2025-02-14 14:43:49'),
(3, 1, 'venta', 3, 'Venta a cliente', '2025-02-14', '2025-02-14 14:44:12', '2025-02-14 14:44:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_compra` decimal(10,2) NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `stock_minimo` int(11) NOT NULL,
  `unidad_medida` varchar(50) DEFAULT 'unidad',
  `conversion` int(11) DEFAULT 1,
  `categoria_id` int(11) DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio_compra`, `precio_venta`, `stock`, `stock_minimo`, `unidad_medida`, `conversion`, `categoria_id`, `fecha_vencimiento`, `creado_en`, `actualizado_en`) VALUES
(1, 'Ibuprofeno 200mg', 'Este es el producto A.', 12.50, 15.99, 41, 5, 'tableta', 10, 1, '2025-12-31', '2025-02-14 13:54:55', '2025-03-21 15:32:29'),
(3, 'Drogueria Intisssssasa', 'sdsdadsdasdasd', 15.60, 20.40, 3, 10, 'Cajas', 2, 1, '2025-02-25', '2025-02-21 15:07:30', '2025-03-14 16:14:52'),
(5, 'Paracetamol', 'para el dolor de cabeza', 3.00, 3.00, 12, 5, 'Tabletas', 1, 1, '2025-03-27', '2025-03-14 16:00:35', '2025-03-14 16:14:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `nombre`, `email`, `telefono`, `direccion`, `creado_en`, `actualizado_en`) VALUES
(1, 'Proveedor 245442', 'proveedor1@example.com', '963258742', 'Av. Principal 123, Ciudad', '2025-02-12 16:23:13', '2025-03-07 16:26:44'),
(24, 'test222', 'drogeriaintisss@gmail.com', '999999999', 'Av. Peru 785', '2025-03-07 13:23:45', '2025-03-07 13:28:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resumen_ventas`
--

CREATE TABLE `resumen_ventas` (
  `id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `total_dia` decimal(10,2) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resumen_ventas`
--

INSERT INTO `resumen_ventas` (`id`, `fecha`, `total_dia`, `creado_en`, `actualizado_en`) VALUES
(1, '2025-02-12', 301.50, '2025-02-14 15:20:01', '2025-02-14 15:21:49'),
(2, '2024-02-25', 330.00, '2025-02-25 16:09:55', '2025-02-26 14:17:33'),
(3, '2025-02-26', 188.86, '2025-02-26 15:09:41', '2025-02-26 15:27:51'),
(4, '2025-03-14', 355.49, '2025-03-14 13:34:00', '2025-03-14 16:14:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `rol` enum('admin','empleado') DEFAULT 'empleado',
  `estado` int(11) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombres`, `email`, `password`, `rol`, `estado`, `creado_en`, `actualizado_en`) VALUES
(1, 'Juan Pérez ', 'juan@example.com', 'password123', 'empleado', 1, '2025-02-12 15:11:42', '2025-03-07 16:02:50'),
(4, 'admin', 'admin@gmail.com', 'saul211102', 'admin', 1, '2025-02-19 12:42:18', '2025-02-19 12:42:18'),
(12, 'testsss', 'testeando@gmail.com', 'sssdddddd', 'empleado', 0, '2025-02-19 16:24:33', '2025-02-20 14:48:16'),
(22, 'Saul', 'saul@hotmail.com', '785s8ss7s7s', 'admin', 1, '2025-03-07 16:12:51', '2025-03-07 16:12:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `adicional` decimal(10,2) DEFAULT NULL,
  `metodo_pago` enum('efectivo','tarjeta','transferencia') DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `cliente_id`, `usuario_id`, `fecha`, `total`, `descuento`, `adicional`, `metodo_pago`, `creado_en`, `actualizado_en`) VALUES
(22, 1, 4, '2025-03-14', 94.77, 0.00, 0.00, 'efectivo', '2025-03-14 16:14:52', '2025-03-14 16:14:52');

--
-- Disparadores `ventas`
--
DELIMITER $$
CREATE TRIGGER `actualizar_resumen_ventas` AFTER INSERT ON `ventas` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proveedor_id` (`proveedor_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detalle_compras_ibfk_1` (`compra_id`),
  ADD KEY `detalle_compras_ibfk_2` (`producto_id`);

--
-- Indices de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detalle_ventas_ibfk_1` (`venta_id`),
  ADD KEY `detalle_ventas_ibfk_2` (`producto_id`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `resumen_ventas`
--
ALTER TABLE `resumen_ventas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ventas_ibfk_1` (`cliente_id`),
  ADD KEY `ventas_ibfk_2` (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `resumen_ventas`
--
ALTER TABLE `resumen_ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`),
  ADD CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD CONSTRAINT `detalle_compras_ibfk_1` FOREIGN KEY (`compra_id`) REFERENCES `compras` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalle_compras_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
