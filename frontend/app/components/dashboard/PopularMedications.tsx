import React from "react";

const medications = [
  { name: "Paracetamol 500mg", sales: 1250, change: "+12%" },
  { name: "Amoxicilina 250mg", sales: 980, change: "+8%" },
  { name: "Ibuprofeno 400mg", sales: 875, change: "+15%" },
  { name: "Omeprazol 20mg", sales: 720, change: "+5%" },
  { name: "Loratadina 10mg", sales: 650, change: "+18%" },
];

export const PopularMedications = () => {
  return (
    <div className="space-y-4">
      {medications.map((med, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium text-gray-900">{med.name}</p>
            <p className="text-sm text-gray-600">
              {med.sales} unidades vendidas
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-green-600">
              {med.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
