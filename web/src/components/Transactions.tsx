import { useEffect, useState } from "react";
import axios from "axios";

// Define the type for a single transaction
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  sentence: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// The API returns an array of transactions directly

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get<unknown>(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Log to verify the structure during development
        console.log("API Response:", response.data);

        // Check if the response is an array
        if (Array.isArray(response.data)) {
          setTransactions(response.data as Transaction[]);
        } else {
          console.error("Invalid API response format", response.data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-black text-white p-6 rounded-xl shadow-md border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-2">Date</th>
            <th className="pb-2">Amount Spent</th>
            <th className="pb-2">Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice().reverse().map((txn) => (
            <tr
              key={txn.id}
              className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
            >
              <td className="py-2">{formatDate(txn.createdAt)}</td>
              <td className="py-2">{txn.amount}</td>
              <td className="py-2">{txn.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
