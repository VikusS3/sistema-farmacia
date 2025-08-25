"use client";

import { useEffect, useState } from "react";

interface ProductosFormProps {
  values: {
    nombre: string;
    descripcion: string;
    precio_compra: number;
    precio_venta: number;
    stock: number;
    unidad_venta: string;
    unidad_medida: string;
    factor_conversion: number;
    factor_caja: number;
    fecha_vencimiento: string;
    ganancia: number;
  };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  editingProductoId?: number | null;
  closeModal?: () => void;
}

export default function ProductosForm({
  values,
  handleChange,
  handleSubmit,
  loading,
  editingProductoId,
  closeModal,
}: ProductosFormProps) {
  const [disabledStock, setDisabledStock] = useState(false);

  useEffect(() => {
    if (editingProductoId) {
      setDisabledStock(true);
    } else {
      setDisabledStock(false);
    }
  }, [editingProductoId]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sección: Datos Generales */}
      <div className="bg-background-100 p-5 rounded-xl shadow border border-background-300 space-y-4">
        <h2 className="text-lg font-semibold text-text-100">Datos Generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-text-300 font-bold mb-1">
              Nombre del producto:
            </label>
            <input
              type="text"
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-background-200 text-text-200 border border-background-300 focus:border-primary-100 focus:ring-2 focus:ring-primary-200 transition"
              placeholder="Ej: Amoxicilina 500mg"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-text-300 font-bold mb-1">
              Descripción del producto:
            </label>
            <textarea
              name="descripcion"
              value={values.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-background-200 text-text-200 border border-background-300 focus:border-primary-100 focus:ring-2 focus:ring-primary-200 transition"
              placeholder="Ej: Caja con 10 blisters de 10 pastillas"
              required
            />
          </div>
        </div>
      </div>

      {/* Sección: Unidades y Conversión */}
      <div className="bg-background-100 p-5 rounded-xl shadow border border-background-300 space-y-4">
        <h2 className="text-lg font-semibold text-text-100">
          Unidades y Conversión
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Unidad mínima */}
          <div>
            <label className="block text-text-300 font-bold mb-1">
              Unidad básica:
            </label>
            <select
              name="unidad_medida"
              value={values.unidad_medida}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-background-200 text-text-200 border border-background-300 focus:border-primary-100 focus:ring-2 focus:ring-primary-200 transition"
            >
              <option value="unidad">Unidad</option>
              <option value="pastilla">Pastilla</option>
            </select>
          </div>

          {/* Unidad de venta */}
          <div>
            <label className="block text-text-300 font-bold mb-1">
              Presentación de venta:
            </label>
            <select
              name="unidad_venta"
              value={values.unidad_venta}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-background-200 text-text-200 border border-background-300 focus:border-primary-100 focus:ring-2 focus:ring-primary-200 transition"
            >
              <option value="unidad">Unidad</option>
              <option value="blister">Blister</option>
              <option value="caja">Caja</option>
            </select>
          </div>

          {/* Factor conversión */}
          <div>
            <label className="block text-text-300 font-bold mb-1">
              Cantidad por presentacion:
            </label>
            <input
              type="number"
              name="factor_conversion"
              value={values.factor_conversion}
              onChange={handleChange}
              min={1}
              className="w-full px-4 py-2 rounded-md bg-background-200 text-text-200 border border-background-300 focus:border-primary-100 focus:ring-2 focus:ring-primary-200 transition"
              placeholder="Ej: 10 si un blister tiene 10 pastillas"
            />
          </div>

          {/* Factor caja */}
          <div>
            <label className="block text-text-300 font-bold mb-1">
              Cantidad total por caja:
            </label>
            <input
              type="number"
              name="factor_caja"
              value={values.factor_caja}
              onChange={handleChange}
              min={1}
              className="w-full px-4 py-2 rounded-md bg-background-200 text-text-200 border border-background-300 focus:border-primary-100 focus:ring-2 focus:ring-primary-200 transition"
              placeholder="Ej: 100 si la caja tiene 10 blisters de 10 pastillas"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-text-300 font-bold mb-1">Stock:</label>
            <input
              type="number"
              name="stock"
              value={values.stock}
              onChange={handleChange}
              min={0}
              className={`w-full px-4 py-2 rounded-md bg-background-200 text-text-200 border border-background-300 focus:border-primary-100 focus:ring-2 focus:ring-primary-200 transition ${
                disabledStock ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Ej: 100"
              readOnly={disabledStock}
            />
          </div>
        </div>
      </div>

      {/* Sección: Precios */}
      <div className="bg-background-100 p-5 rounded-xl shadow border border-background-300 space-y-4">
        <h2 className="text-lg font-semibold text-text-100">Precios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Precio venta */}
          <div>
            <label className="block text-text-300 font-bold mb-1">
              Precio de venta al público:
            </label>
            <input
              type="number"
              name="precio_venta"
              value={values.precio_venta}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 rounded-md bg-background-200 text-text-200 border border-background-300 focus:border-primary-100 focus:ring-2 focus:ring-primary-200 transition"
              required
            />
          </div>

          {/* Precio compra solo lectura si edición */}
          {editingProductoId && (
            <div>
              <label className="block text-text-300 font-bold mb-1">
                Precio de Compra (auto):
              </label>
              <input
                type="number"
                value={values.precio_compra}
                readOnly
                className="w-full px-4 cursor-not-allowed py-2 rounded-md bg-background-300 text-text-400 border border-background-300"
              />
            </div>
          )}

          {/* Ganancia solo lectura si edición */}
          {editingProductoId && (
            <div>
              <label className="block text-text-300 font-bold mb-1">
                Ganancia (auto):
              </label>
              <input
                type="number"
                value={values.ganancia}
                readOnly
                className="w-full px-4 py-2 rounded-md bg-background-300 text-text-400 border border-background-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* Sección: Fecha de vencimiento */}
      <div className="bg-background-100 p-5 rounded-xl shadow border border-background-300 space-y-4">
        <h2 className="text-lg font-semibold text-text-100">
          Fecha de Caducidad:
        </h2>
        <input
          type="date"
          name="fecha_vencimiento"
          value={values.fecha_vencimiento}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-background-200 text-text-200 border border-background-300 focus:border-primary-100 focus:ring-2 focus:ring-primary-200 transition"
          required
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3">
        {closeModal && (
          <button
            type="button"
            onClick={closeModal}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          disabled={loading}
        >
          {editingProductoId ? "Editar" : "Agregar"}
        </button>
      </div>
    </form>
  );
}
