import React, { useState } from "react";
import dayjs from "@/app/lib/dayjsConfig";

interface CajaInfoProps {
  fechaApertura: string;
  montoApertura: number;
  fechaCierre?: string | null;
  montoCierre?: number | null;
  onAbrirCaja: (montoApertura: number) => void;
  onCerrarCaja: (montoCierre: number) => void;
  loadingAbrir: boolean;
  loadingCerrar: boolean;
}

export function CajaInfo({
  fechaApertura,
  montoApertura,
  fechaCierre,
  montoCierre,
  onAbrirCaja,
  onCerrarCaja,
  loadingAbrir,
  loadingCerrar,
}: CajaInfoProps) {
  const [montoInput, setMontoInput] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setMontoInput("");
      setError(null);
    } else {
      const num = Number(val);
      if (!isNaN(num)) {
        setMontoInput(num);
        if (num <= 0) {
          setError("Debe ser un monto mayor a 0.");
        } else {
          setError(null);
        }
      }
    }
  };

  const handleAction = () => {
    if (montoInput === "" || montoInput <= 0) {
      setError("Por favor ingresa un monto válido.");
      return;
    }
    setError(null);
    if (fechaCierre) {
      onAbrirCaja(montoInput);
    } else {
      onCerrarCaja(montoInput);
    }
  };

  const cajaCerrada = Boolean(fechaCierre);

  return (
    <div className="space-y-4 p-6 rounded-lg shadow-md bg-background-300 text-text-100">
      <div>
        <p className="text-sm text-text-200">
          <strong>Caja activa desde:</strong>{" "}
          {dayjs(fechaApertura).format("DD/MM/YYYY HH:mm:ss")}
        </p>
        <p className="text-sm text-text-200">
          <strong>Monto apertura:</strong> S/ {montoApertura}
        </p>

        {cajaCerrada && (
          <>
            <p className="text-sm text-text-200">
              <strong>Fecha cierre:</strong>{" "}
              {dayjs(fechaCierre!).format("DD/MM/YYYY HH:mm:ss")}
            </p>
            <p className="text-sm text-text-200">
              <strong>Monto cierre:</strong> S/ {montoCierre}
            </p>
          </>
        )}
      </div>

      <div>
        <label
          htmlFor="monto"
          className="block mb-1 text-sm font-medium text-text-200"
        >
          Monto {cajaCerrada ? "de apertura" : "de cierre"}
        </label>
        <input
          id="monto"
          type="number"
          min={0.01}
          step="0.01"
          value={montoInput}
          onChange={handleChange}
          disabled={loadingAbrir || loadingCerrar}
          placeholder={`Ingrese monto de ${
            cajaCerrada ? "apertura" : "cierre"
          }`}
          className={`w-full px-3 py-2 rounded bg-background-200 border ${
            error ? "border-accent-100" : "border-primary-200"
          } text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-100`}
          aria-invalid={!!error}
          aria-describedby="error-monto"
        />
        {error && (
          <p
            id="error-monto"
            className="mt-1 text-sm text-text-200"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      <button
        onClick={handleAction}
        disabled={loadingAbrir || loadingCerrar}
        className={`w-full py-2 px-4 rounded font-semibold text-text-100 transition ${
          loadingAbrir || loadingCerrar
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-primary-100 hover:bg-primary-200"
        }`}
      >
        {loadingAbrir || loadingCerrar ? (
          <span className="flex justify-center items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            {cajaCerrada ? "Abriendo..." : "Cerrando..."}
          </span>
        ) : cajaCerrada ? (
          "Abrir Caja"
        ) : (
          "Cerrar Caja"
        )}
      </button>

      {cajaCerrada && (
        <p className="text-center text-text-300 italic">Caja cerrada.</p>
      )}
    </div>
  );
}
