import { useTransactions } from "../hooks/useTransactions";
import SpendingPieChart from "../components/Analytics/SpendingPieChart";
import StatsGrid from "../components//Analytics/StatsGrid";
import MonthWiseChart from "./Analytics/MonthWiseChart";

const COLORS = [
  "#f59e0b", // amber-500
  "#3b82f6", // blue-500
  "#ec4899", // pink-500
  "#a855f7", // purple-500
  "#ef4444", // red-500
  "#10b981", // green-500
  "#6b7280", // gray-500
];

function getCategoryEmoji(category: string): string {
  const CATEGORY_EMOJIS: Record<string, string> = {
    food: "🍔",
    transportation: "🚗",
    shopping: "🛍️",
    entertainment: "🎬",
    bills: "📝",
    health: "💊",
    default: "💰",
  };

  const lower = category.toLowerCase();
  const matched = Object.keys(CATEGORY_EMOJIS).find((key) =>
    lower.includes(key)
  );
  return matched ? CATEGORY_EMOJIS[matched] : CATEGORY_EMOJIS.default;
}

const formatAmount = (amount: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

export default function Analytics() {
  const { transactions, loading } = useTransactions();

  const totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const averageSpent =
    transactions.length > 0 ? totalSpent / transactions.length : 0;

  const categorySummary = transactions.reduce<Record<string, number>>((acc, txn) => {
    const category = txn.category.toLowerCase();
    acc[category] = (acc[category] || 0) + txn.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categorySummary).map(([category, amount], index) => ({
    name: category,
    value: amount,
    color: COLORS[index % COLORS.length],
    emoji: getCategoryEmoji(category),
    formattedValue: formatAmount(amount),
  }));

  return (
    <div className="max-w-2xl mx-auto my-6 bg-black text-white rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-900 to-black p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Analytics
          </span>
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent ml-1">
            Dashboard
          </span>
        </h2>
      </div>

      <StatsGrid
        totalSpent={totalSpent}
        averageSpent={averageSpent}
        transactionCount={transactions.length}
        formatAmount={formatAmount}
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : transactions.length > 0 ? (
        <SpendingPieChart data={pieData} total={totalSpent} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          No transaction data available
        </div>
      )}
            {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : transactions.length > 0 ? (
        <MonthWiseChart transactions={transactions} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          No transaction data available
        </div>
      )}

      <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-800">
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}
