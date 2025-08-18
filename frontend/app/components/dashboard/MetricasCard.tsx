import React from "react";

import { LucideIcon } from "lucide-react";

interface MetricasCardProps {
  title: string;
  value: string | undefined;
  change: string;
  changeType?: "positive" | "negative" | "warning";
  icon: LucideIcon;
}

export const MetricasCard: React.FC<MetricasCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}) => {
  const changeColorClass = {
    positive: "text-green-600",
    negative: "text-red-600",
    warning: "text-orange-600",
  }[changeType || "warning"];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-gray-600">{title}</h5>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className={`text-xs ${changeColorClass} flex items-center mt-1`}>
          {change}
          <span className="text-gray-500 ml-1">desde el mes pasado</span>
        </p>
      </div>
    </div>
  );
};
