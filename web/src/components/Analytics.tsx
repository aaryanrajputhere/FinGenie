import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calculator, DollarSign, ShoppingCart } from "lucide-react";

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  sentence: string;
  createdAt: string;
  updatedAt: string;
}

interface CategorySummary {
  [category: string]: number;
}

// Category-based colors matching the transaction component's style
const COLORS = [
  "#f59e0b", // amber-500 (food)
  "#3b82f6", // blue-500 (transportation)
  "#ec4899", // pink-500 (shopping)
  "#a855f7", // purple-500 (entertainment)
  "#ef4444", // red-500 (bills)
  "#10b981", // green-500 (health)
  "#6b7280", // gray-500 (default)
];

// Category emoji mapping similar to transaction component
const CATEGORY_EMOJIS: Record<string, string> = {
  food: "🍔",
  transportation: "🚗",
  shopping: "🛍️",
  entertainment: "🎬",
  bills: "📝",
  health: "💊",
  default: "💰"
};

export default function Analytics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [averageSpent, setAverageSpent] = useState<number>(0);
  const [categorySummary, setCategorySummary] = useState<CategorySummary>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Using axios as requested
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/transactions`,
          {
            headers: { 
              Authorization: `Bearer ${token}`
            },
          }
        );
        
        const data = response.data;
        
        if (Array.isArray(data)) {
          setTransactions(data);

          const total = data.reduce((sum, txn) => sum + txn.amount, 0);
          setTotalSpent(total);

          const avg = data.length > 0 ? total / data.length : 0;
          setAverageSpent(avg);

          const categoryMap: CategorySummary = {};
          data.forEach((txn) => {
            const category = txn.category.toLowerCase();
            if (categoryMap[category]) {
              categoryMap[category] += txn.amount;
            } else {
              categoryMap[category] = txn.amount;
            }
          });

          setCategorySummary(categoryMap);
        } else {
          console.error("Invalid API response format", data);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Prepare data for pie chart
  const pieData = Object.entries(categorySummary)
    .map(([category, amount], index) => ({
      name: category,
      value: amount,
      color: COLORS[index % COLORS.length],
      emoji: getCategoryEmoji(category)
    }));

  // Helper function to get the appropriate emoji for a category
  function getCategoryEmoji(category: string): string {
    const lowerCategory = category.toLowerCase();
    const matchedCategory = Object.keys(CATEGORY_EMOJIS).find(key => 
      lowerCategory.includes(key)
    );
    
    return matchedCategory ? CATEGORY_EMOJIS[matchedCategory] : CATEGORY_EMOJIS.default;
  }

  // Custom tooltip component for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-md">
          <p className="text-sm flex items-center gap-1">
            <span>{data.emoji}</span>
            <span className="capitalize">{data.name}</span>
          </p>
          <p className="text-emerald-400 font-medium">
            {formatAmount(data.value)}
          </p>
          <p className="text-xs text-gray-400">
            {((data.value / totalSpent) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto my-6 bg-black text-white rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
      {/* Header with stats */}
      <div className="bg-gradient-to-r from-gray-900 to-black p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Analytics</span>
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent ml-1">Dashboard</span>
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-900">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mr-2">
              <DollarSign size={16} />
            </div>
            <span className="text-gray-400 text-sm">Total Spent</span>
          </div>
          <p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            {formatAmount(totalSpent)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
              <Calculator size={16} />
            </div>
            <span className="text-gray-400 text-sm">Average Transaction</span>
          </div>
          <p className="text-xl font-bold text-white">
            {formatAmount(averageSpent)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-2">
              <ShoppingCart size={16} />
            </div>
            <span className="text-gray-400 text-sm">Total Transactions</span>
          </div>
          <p className="text-xl font-bold text-white">{transactions.length}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Category Legend */}
            <div className="grid grid-cols-2 gap-2 mt-6">
              {pieData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: entry.color }}>
                      <div className="text-xs">{entry.emoji}</div>
                    </div>
                    <span className="capitalize text-sm">{entry.name}</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {formatAmount(entry.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No transaction data available
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-800">
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}