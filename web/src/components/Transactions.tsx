import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { ArrowDown, ArrowUp, Search, Calendar } from "lucide-react";

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

// Category-based icon and color mapping
const categoryIcons: Record<string, { color: string; icon: JSX.Element }> = {
  food: { 
    color: "bg-amber-500", 
    icon: <div className="text-xs">🍔</div> 
  },
  transportation: { 
    color: "bg-blue-500", 
    icon: <div className="text-xs">🚗</div> 
  },
  shopping: { 
    color: "bg-pink-500", 
    icon: <div className="text-xs">🛍️</div> 
  },
  entertainment: { 
    color: "bg-purple-500", 
    icon: <div className="text-xs">🎬</div> 
  },
  bills: { 
    color: "bg-red-500", 
    icon: <div className="text-xs">📝</div> 
  },
  health: { 
    color: "bg-green-500", 
    icon: <div className="text-xs">💊</div> 
  },
  // Default fallback
  default: { 
    color: "bg-gray-500", 
    icon: <div className="text-xs">💰</div> 
  }
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get<unknown>(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the response is an array
        if (Array.isArray(response.data)) {
          setTransactions(response.data as Transaction[]);
        } else {
          console.error("Invalid API response format", response.data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getCategoryDisplay = (category: string) => {
    const lowerCategory = category.toLowerCase();
    const categoryInfo = Object.keys(categoryIcons).find(key => 
      lowerCategory.includes(key)
    ) 
      ? categoryIcons[Object.keys(categoryIcons).find(key => 
          lowerCategory.includes(key)
        ) as string]
      : categoryIcons.default;
    
    return (
      <div className="flex items-center">
        <div className={`w-6 h-6 rounded-full ${categoryInfo.color} flex items-center justify-center mr-2`}>
          {categoryInfo.icon}
        </div>
        <span className="capitalize">{category}</span>
      </div>
    );
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(txn => {
      const matchesSearch = 
        txn.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.sentence.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === "all") return matchesSearch;
      return matchesSearch && txn.category.toLowerCase().includes(filter);
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });

  // Calculate total amount spent
  const totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <div className="max-w-2xl mx-auto my-6 bg-black text-white rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
      {/* Header with stats */}
      <div className="bg-gradient-to-r from-gray-900 to-black p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Transaction</span>
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent ml-1">History</span>
        </h2>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Total Spent</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              {formatAmount(totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Transactions</p>
            <p className="text-2xl font-bold text-white">{transactions.length}</p>
          </div>
        </div>
      </div>
      
      {/* Search and filter controls */}
      <div className="p-4 bg-gray-900 border-b border-gray-800 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setSortDirection(sortDirection === "desc" ? "asc" : "desc")}
            className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 py-2 px-3 rounded-lg text-sm"
          >
            <Calendar size={16} />
            {sortDirection === "desc" ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
          </button>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 text-white py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
          >
            <option value="all">All Categories</option>
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="shopping">Shopping</option>
            <option value="entertainment">Entertainment</option>
            <option value="bills">Bills</option>
            <option value="health">Health</option>
          </select>
        </div>
      </div>

      {/* Transactions list with custom scrollbar */}
      <div className="overflow-y-auto max-h-96 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <ul>
            {filteredTransactions.map((txn) => (
              <li
                key={txn.id}
                className="border-b border-gray-800 hover:bg-gray-900 transition-colors p-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      {getCategoryDisplay(txn.category)}
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{txn.sentence}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-white">{formatAmount(txn.amount)}</span>
                    <span className="text-gray-500 text-xs mt-1 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(txn.createdAt)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || filter !== "all" 
              ? "No transactions match your search" 
              : "No transactions yet"}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-800">
        {transactions.length > 0 && 
          `Showing ${filteredTransactions.length} of ${transactions.length} transactions`
        }
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111827;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
      `}</style>
    </div>
  );
}