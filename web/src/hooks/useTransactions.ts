import { useEffect, useState } from "react";
import axios from "axios";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  sentence: string;
  createdAt: string;
  updatedAt: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(response.data)) {
          setTransactions(response.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err: any) {
        console.error("Failed to fetch transactions:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return { transactions, loading, error };
}
