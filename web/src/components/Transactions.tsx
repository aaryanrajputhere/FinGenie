import { useEffect, useState } from "react";
import axios from "axios";

// Define the type for a single transaction
interface Transaction {
  date: string;
  amount: number;
  category: string;
  createdAt: string; // assuming it's a date string from the API
}

export default function Transactions() {
  // Type the state with the Transaction type
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Get token from local storage
        const token = localStorage.getItem("token");

        // Make the GET request with the token in the headers
        const response = await axios.get(`${import.meta.env.BACKEND_URL}/api/v1/expense/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setTransactions(response.data); // Assuming response.data contains the transaction data
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  // Helper function to format the date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the format as needed
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-black text-white p-6 rounded-xl shadow-md border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-700">
            {/* Renamed "Created At" to "Date" */}
            <th className="pb-2">Date</th>
            <th className="pb-2">Amount Spent</th>
            <th className="pb-2">Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr
              key={index}
              className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
            >
              <td className="py-2">{formatDate(txn.createdAt)}</td> {/* Use createdAt for "Date" */}
              <td className="py-2">{txn.amount}</td>
              <td className="py-2">{txn.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
}
