import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { name: "Ene", total: 15000 },
  { name: "Feb", total: 18000 },
  { name: "Mar", total: 22000 },
  { name: "Abr", total: 25000 },
  { name: "May", total: 28000 },
  { name: "Jun", total: 32000 },
  { name: "Jul", total: 35000 },
  { name: "Ago", total: 38000 },
  { name: "Sep", total: 42000 },
  { name: "Oct", total: 45000 },
  { name: "Nov", total: 41000 },
  { name: "Dic", total: 48000 },
];

export const SalesChart = () => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#666" fontSize={12} />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#colorTotal)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
