import type { JSX } from "react";

// components/StatCard.tsx
export default function StatCard({
    icon,
    label,
    value,
    bg,
  }: {
    icon: JSX.Element;
    label: string;
    value: string | number;
    bg: string;
  }) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center mb-2">
          <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center mr-2`}>
            {icon}
          </div>
          <span className="text-gray-400 text-sm">{label}</span>
        </div>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    );
  }
  