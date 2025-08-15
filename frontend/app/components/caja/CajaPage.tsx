// src/components/CajaControl.tsx
"use client";

import { useEffect, useState } from "react";
import { useCajaActiva, useCajaMutations } from "@/app/hooks/cajas/useCajas";
import Swal from "sweetalert2";

export default function CajaControl() {
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  // Obtener usuario_id del localStorage
  useEffect(() => {
    const id = localStorage.getItem("usuario_id");
    if (id) setUsuarioId(Number(id));
  }, []);

  const { data: cajaActiva, isLoading } = useCajaActiva(
    usuarioId !== null ? usuarioId : undefined
  );
  const { abrirCaja, cerrarCaja, isLoadingAbrir, isLoadingCerrar } =
    useCajaMutations(usuarioId !== null ? usuarioId : undefined);

  const handleAbrirCaja = async () => {
    const { value: monto } = await Swal.fire({
      title: "Apertura de Caja",
      input: "number",
      inputLabel: "Ingrese el monto inicial",
      inputPlaceholder: "0.00",
      showCancelButton: true,
    });

    if (monto !== undefined && monto !== null) {
      await abrirCaja({
        usuario_id: usuarioId!,
        monto_apertura: parseFloat(monto),
      });
    }
  };

  const handleCerrarCaja = async () => {
    const { value: montoFinal } = await Swal.fire({
      title: "Cerrar Caja",
      input: "number",
      inputLabel: "Ingrese el monto final en caja",
      inputPlaceholder: "Monto final",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "El monto final es requerido";
        }
        if (isNaN(Number(value)) || Number(value) <= 0) {
          return "Ingrese un monto válido mayor a 0";
        }
      },
    });

    if (montoFinal && cajaActiva?.id) {
      await cerrarCaja({
        caja_id: cajaActiva.id,
        monto_cierre: Number(montoFinal),
      });
    }
  };

  if (!usuarioId) {
    return (
      <p className="text-red-500 text-center font-medium mt-6">
        No se encontró el usuario en sesión
      </p>
    );
  }

  if (isLoading) {
    return (
      <p className="text-gray-500 text-center font-medium mt-6">
        Cargando estado de caja...
      </p>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-md mx-auto space-y-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Control de Caja
      </h2>

      {cajaActiva ? (
        <div className="text-center space-y-3">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            Caja abierta
          </span>
          <p className="text-gray-700 font-medium">
            💰 Monto apertura:{" "}
            <span className="font-bold text-green-600">
              S/ {cajaActiva.monto_apertura}
            </span>
          </p>
          <p className="text-gray-500 text-sm">
            📅 Apertura: {new Date(cajaActiva.fecha_apertura).toLocaleString()}
          </p>
          <button
            onClick={handleCerrarCaja}
            disabled={isLoadingCerrar}
            className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition disabled:opacity-50"
          >
            {isLoadingCerrar ? "Cerrando..." : "Cerrar Caja"}
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-gray-500">No hay una caja activa</p>
          <button
            onClick={handleAbrirCaja}
            disabled={isLoadingAbrir}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isLoadingAbrir ? "Abriendo..." : "Abrir Caja"}
          </button>
        </div>
      )}
    </div>
  );
}
