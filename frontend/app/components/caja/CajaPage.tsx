"use client";

import React, { useEffect, useState } from "react";
import { useCajaActiva } from "@/app/hooks/cajas/useCajaActiva";
import { CajaInfo } from "./CajaInfo";
import { CajaVacia } from "./CajaVacia";
import dayjs from "@/app/lib/dayjsConfig"; // <- con tz configurado

export default function CajaPage() {
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  // ⚠️ SSR safe localStorage access
  useEffect(() => {
    const id = localStorage.getItem("usuario_id");
    if (id) setUsuarioId(Number(id));
  }, []);

  const {
    cajaActiva,
    isLoading,
    abrirCaja,
    cerrarCaja,
    abrirCajaLoading,
    cerrarCajaLoading,
  } = useCajaActiva(usuarioId ?? 0);

  const handleAbrirCaja = (montoApertura: number) => {
    if (!usuarioId) return;
    abrirCaja({
      usuario_id: usuarioId,
      monto_apertura: montoApertura,
      fecha_apertura: dayjs().tz("America/Lima").format("YYYY-MM-DD HH:mm:ss"),
    });
  };

  const handleCerrarCaja = (montoCierre: number) => {
    if (!cajaActiva) return;
    cerrarCaja({
      id: cajaActiva.id,
      monto_cierre: montoCierre,
      fecha_cierre: dayjs().tz("America/Lima").format("YYYY-MM-DD HH:mm:ss"),
    });
  };

  if (usuarioId === null || isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-text-200">
        <span className="animate-pulse text-lg">Cargando caja...</span>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-md mx-auto bg-background-100 text-text-100 rounded-lg shadow-lg mt-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-center text-primary-300">
          Gestión de Caja
        </h1>
        <p className="text-center text-sm text-text-200">
          {cajaActiva ? "Caja activa" : "Abre una nueva caja para comenzar"}
        </p>
      </header>

      {cajaActiva ? (
        <CajaInfo
          fechaApertura={cajaActiva.fecha_apertura}
          montoApertura={cajaActiva.monto_apertura}
          onCerrarCaja={handleCerrarCaja}
          loadingCerrar={cerrarCajaLoading}
        />
      ) : (
        <CajaVacia
          onAbrirCaja={handleAbrirCaja}
          loadingAbrir={abrirCajaLoading}
        />
      )}
    </main>
  );
}
