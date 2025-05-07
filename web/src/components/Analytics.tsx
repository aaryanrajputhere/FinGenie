import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Transaction {
  date: string;
  amount: number;
  category: string;
  createdAt: string;
}

interface CategorySummary {
  [category: string]: number;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bcd4", "#a4de6c"];

export default function Analytics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [averageSpent, setAverageSpent] = useState<number>(0);
  const [categorySummary, setCategorySummary] = useState<CategorySummary>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<Transaction[]>(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/transactions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;
        setTransactions(data);

        const total = data.reduce((sum, txn) => sum + txn.amount, 0);
        setTotalSpent(total);

        const avg = data.length > 0 ? total / data.length : 0;
        setAverageSpent(avg);

        const categoryMap: CategorySummary = {};
        data.forEach((txn) => {
          if (categoryMap[txn.category]) {
            categoryMap[txn.category] += txn.amount;
          } else {
            categoryMap[txn.category] = txn.amount;
          }
        });

        setCategorySummary(categoryMap);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  const pieData = Object.entries(categorySummary).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-black text-white p-6 rounded-xl shadow-md border border-gray-800">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>

      <div className="mb-6">
        <p><strong>Total Spent:</strong> ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        <p><strong>Average Transaction:</strong> ₹{averageSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        <p><strong>Total Transactions:</strong> {transactions.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Pie Chart */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                label
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
