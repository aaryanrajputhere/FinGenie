// components/StatsGrid.tsx
import { DollarSign, Calculator, ShoppingCart } from "lucide-react";
import StatCard from "./StatCard";

export default function StatsGrid({
  totalSpent,
  averageSpent,
  transactionCount,
  formatAmount,
}: {
  totalSpent: number;
  averageSpent: number;
  transactionCount: number;
  formatAmount: (amount: number) => string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-900">
      <StatCard
        icon={<DollarSign size={16} />}
        label="Total Spent"
        value={formatAmount(totalSpent)}
        bg="bg-emerald-500"
      />
      <StatCard
        icon={<Calculator size={16} />}
        label="Average Transaction"
        value={formatAmount(averageSpent)}
        bg="bg-blue-500"
      />
      <StatCard
        icon={<ShoppingCart size={16} />}
        label="Total Transactions"
        value={transactionCount}
        bg="bg-purple-500"
      />
    </div>
  );
}
