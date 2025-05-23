import React, { useState } from "react";
import dayjs from "@/app/lib/dayjsConfig";
interface CajaInfoProps {
  fechaApertura: string;
  montoApertura: number;
  onCerrarCaja: (montoCierre: number) => void;
  loadingCerrar: boolean;
}

export function CajaInfo({
  fechaApertura,
  montoApertura,
  onCerrarCaja,
  loadingCerrar,
}: CajaInfoProps) {
  const [montoCierre, setMontoCierre] = useState<number | "">(0);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setMontoCierre("");
      setError(null);
    } else {
      const num = Number(val);
      if (!isNaN(num)) {
        setMontoCierre(num);
        if (num <= 0) {
          setError("Debe ser un monto mayor a 0.");
        } else {
          setError(null);
        }
      }
    }
  };

  const handleCerrar = () => {
    if (montoCierre === "" || montoCierre <= 0) {
      setError("Por favor ingresa un monto de cierre válido.");
      return;
    }
    setError(null);
    onCerrarCaja(montoCierre);
  };

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
      </div>

      <div>
        <label
          htmlFor="montoCierre"
          className="block mb-1 text-sm font-medium text-text-200"
        >
          Monto de cierre
        </label>
        <input
          id="montoCierre"
          type="number"
          min={0}
          step="0.01"
          value={montoCierre}
          onChange={handleChange}
          disabled={loadingCerrar}
          placeholder="Ingrese monto de cierre"
          className={`w-full px-3 py-2 rounded bg-background-200 border ${
            error ? "border-accent-100" : "border-primary-200"
          } text-white focus:outline-none focus:ring-2 focus:ring-primary-100`}
        />
        {error && <p className="mt-1 text-sm text-accent-100">{error}</p>}
      </div>

      <button
        onClick={handleCerrar}
        disabled={loadingCerrar}
        className={`w-full py-2 px-4 rounded font-semibold text-white transition ${
          loadingCerrar
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-primary-100 hover:bg-primary-200"
        }`}
      >
        {loadingCerrar ? (
          <span className="flex justify-center items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" />
            Cerrando...
          </span>
        ) : (
          "Cerrar Caja"
        )}
      </button>
    </div>
  );
}
