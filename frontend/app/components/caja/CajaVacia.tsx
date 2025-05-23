import React, { useState } from "react";

interface CajaVaciaProps {
  onAbrirCaja: (montoApertura: number) => void;
  loadingAbrir: boolean;
}

export function CajaVacia({ onAbrirCaja, loadingAbrir }: CajaVaciaProps) {
  const [montoApertura, setMontoApertura] = useState<number | "">(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") setMontoApertura("");
    else {
      const num = Number(val);
      if (!isNaN(num)) setMontoApertura(num);
    }
  };

  const handleAbrir = () => {
    if (montoApertura === "" || montoApertura <= 0) {
      alert("Por favor ingresa un monto de apertura válido.");
      return;
    }
    onAbrirCaja(montoApertura);
  };

  return (
    <div className="space-y-4 p-6 bg-background-100 text-text-100 rounded-lg shadow-md">
      <p className="text-sm text-text-200">No tienes una caja activa.</p>

      <div>
        <label
          htmlFor="montoApertura"
          className="block mb-1 text-sm font-medium text-text-200"
        >
          Monto de apertura
        </label>
        <input
          id="montoApertura"
          type="number"
          min={0}
          step="0.01"
          value={montoApertura}
          onChange={handleChange}
          disabled={loadingAbrir}
          placeholder="Ingrese monto de apertura"
          className={`w-full px-3 py-2 rounded bg-background-200 border border-primary-200 text-white focus:outline-none focus:ring-2 focus:ring-primary-100`}
        />
      </div>

      <button
        onClick={handleAbrir}
        disabled={loadingAbrir}
        className={`w-full py-2 px-4 rounded font-semibold text-white transition ${
          loadingAbrir
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-primary-100 hover:bg-primary-200"
        }`}
      >
        {loadingAbrir ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
            Abriendo...
          </span>
        ) : (
          "Abrir caja"
        )}
      </button>
    </div>
  );
}
