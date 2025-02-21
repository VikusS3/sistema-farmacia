"use client";

import { Categoria } from "@/app/types";
interface ProductosFormProps {
  values: {
    nombre: string;
    descripcion: string;
    precio_compra: number;
    precio_venta: number;
    stock: number;
    stock_minimo: number;
    unidad_medida: string;
    fecha_vencimiento: string;
    conversion: number;
    categoria_id: number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  editingProductoId?: number | null;
  closeModal?: () => void;
  categorias: Categoria[];
}

export default function ProductosForm({
  values,
  handleChange,
  handleSubmit,
  loading,
  editingProductoId,
  closeModal,
  categorias,
}: ProductosFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-white mb-2">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={values.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el nombre"
            required
          />
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-white mb-2">
            Descripción:
          </label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={values.descripcion}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa la descripción"
            required
          />
        </div>
        <div>
          <label htmlFor="precio_compra" className="block text-white mb-2">
            Precio de Compra:
          </label>
          <input
            type="number"
            id="precio_compra"
            name="precio_compra"
            value={values.precio_compra}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el precio de compra"
            required
          />
        </div>
        <div>
          <label htmlFor="precio_venta" className="block text-white mb-2">
            Precio de Venta:
          </label>
          <input
            type="number"
            id="precio_venta"
            name="precio_venta"
            value={values.precio_venta}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el precio de venta"
            required
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-white mb-2">
            Stock:
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={values.stock}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el stock"
            required
          />
        </div>
        <div>
          <label htmlFor="stock_minimo" className="block text-white mb-2">
            Stock Mínimo:
          </label>
          <input
            type="number"
            id="stock_minimo"
            name="stock_minimo"
            value={values.stock_minimo}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el stock mínimo"
            required
          />
        </div>
        <div>
          <label htmlFor="unidad_medida" className="block text-white mb-2">
            Unidad de Medida:
          </label>
          <input
            type="text"
            id="unidad_medida"
            name="unidad_medida"
            value={values.unidad_medida}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa la unidad de medida"
            required
          />
        </div>
        <div>
          <label htmlFor="fecha_vencimiento" className="block text-white mb-2">
            Fecha de Vencimiento:
          </label>
          <input
            type="date"
            id="fecha_vencimiento"
            name="fecha_vencimiento"
            value={values.fecha_vencimiento}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa la fecha de vencimiento"
            required
          />
        </div>
        <div>
          <label htmlFor="conversion" className="block text-white mb-2">
            Conversion:
          </label>
          <input
            type="number"
            id="conversion"
            name="conversion"
            value={values.conversion}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa la conversion"
            required
          />
        </div>
        <div>
          <label htmlFor="categoria_id" className="block text-white mb-2">
            Categoria:
          </label>
          <select
            id="categoria_id"
            name="categoria_id"
            value={values.categoria_id}
            onChange={
              handleChange as unknown as React.ChangeEventHandler<HTMLSelectElement>
            }
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={closeModal}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        >
          {editingProductoId ? "Editar" : "Agregar"}
        </button>
      </div>
    </form>
  );
}
