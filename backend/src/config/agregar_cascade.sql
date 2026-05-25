-- Script para agregar ON DELETE CASCADE a las relaciones que no lo tienen
-- Ejecutar en orden

-- 1. Inventario -> Productos
ALTER TABLE inventario DROP FOREIGN KEY inventario_ibfk_1;

ALTER TABLE inventario
ADD CONSTRAINT inventario_ibfk_1 FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE;

-- 2. Productos -> Categorias
ALTER TABLE productos DROP FOREIGN KEY productos_ibfk_1;

ALTER TABLE productos
ADD CONSTRAINT productos_ibfk_1 FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE CASCADE;

-- 3. Compras -> Proveedores
ALTER TABLE compras DROP FOREIGN KEY compras_ibfk_1;

ALTER TABLE compras
ADD CONSTRAINT compras_ibfk_1 FOREIGN KEY (proveedor_id) REFERENCES proveedores (id) ON DELETE CASCADE;

-- 4. Compras -> Usuarios
ALTER TABLE compras DROP FOREIGN KEY compras_ibfk_2;

ALTER TABLE compras
ADD CONSTRAINT compras_ibfk_2 FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE;

-- 5. Cajas -> Usuarios (si existe la tabla)
-- ALTER TABLE cajas DROP FOREIGN KEY IF EXISTS cajas_ibfk_1;
-- ALTER TABLE cajas ADD CONSTRAINT cajas_ibfk_1
--     FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;

-- Verificar las restricciones actuales
-- SHOW CREATE TABLE inventario;
-- SHOW CREATE TABLE productos;
-- SHOW CREATE TABLE compras;