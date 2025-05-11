import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  sentence: string;
  createdAt: string; // ISO 8601 format: "YYYY-MM-DDT00:00:00Z"
  updatedAt: string;
}

interface MonthlyChartProps {
  transactions: Transaction[];
  lastUpdated?: string;
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-md">
        <p className="text-sm flex items-center gap-1">
          <span>📅</span>
          <span>{data.formattedMonth}</span>
        </p>
        <p className="text-emerald-400 font-medium">
          ${data.amount.toFixed(2)}
        </p>
        {data.previousMonth && (
          <p className="text-xs text-gray-400">
            {data.change > 0 ? "+" : ""}{data.change.toFixed(1)}% vs previous month
          </p>
        )}
      </div>
    );
  }
  return null;
}

export default function MonthlyChart({ transactions, lastUpdated }: MonthlyChartProps) {
  // States for chart type and selected month
  const [chartType, setChartType] = useState<"line" | "area">("area");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Colors for the chart
  const chartColors = {
    line: "#10B981", // emerald-500
    area: "#059669", // emerald-600
    areaFill: "rgba(16, 185, 129, 0.1)" // emerald with low opacity
  };
  
  // Grouping data by month and year with memoization
  const { chartData, months } = useMemo(() => {
    const groupedData: Record<string, number> = {};

    transactions.forEach((txn) => {
      const month = format(new Date(txn.createdAt), "yyyy-MM"); // Format as "yyyy-MM"
      groupedData[month] = (groupedData[month] || 0) + txn.amount;
    });

    // Sort by date
    const sortedMonths = Object.keys(groupedData).sort();
    
    // Create chart data with percentage change
    const data = sortedMonths.map((month, index) => {
      const date = new Date(month + "-01");
      const amount = groupedData[month];
      const previousMonth = index > 0 ? sortedMonths[index - 1] : null;
      const previousAmount = previousMonth ? groupedData[previousMonth] : null;
      const change = previousAmount ? ((amount - previousAmount) / previousAmount) * 100 : 0;
      
      return {
        key: month,
        name: format(date, "MMM"),
        formattedMonth: format(date, "MMMM yyyy"),
        amount: amount,
        previousMonth: previousMonth ? format(new Date(previousMonth + "-01"), "MMM") : null,
        change: change
      };
    });

    return { 
      chartData: data, 
      months: sortedMonths,
    };
  }, [transactions]);

  // Filter data based on selected month
  const filteredData = selectedMonth
    ? chartData.filter((data) => data.key === selectedMonth)
    : chartData;

  // Clear filter function
  const clearFilter = () => {
    setSelectedMonth("");
  };

  // Format date for last updated 
  const formattedDate = lastUpdated || format(new Date(), "MMM d, yyyy");

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Monthly Spending Trends</h3>
      
      {/* Chart Type Selector */}
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => setChartType("line")}
          className={`px-3 py-1 rounded-md text-sm ${
            chartType === "line" 
              ? "bg-emerald-600 text-white" 
              : "bg-gray-800 text-gray-300"
          }`}
        >
          Line
        </button>
        <button 
          onClick={() => setChartType("area")}
          className={`px-3 py-1 rounded-md text-sm ${
            chartType === "area" 
              ? "bg-emerald-600 text-white" 
              : "bg-gray-800 text-gray-300"
          }`}
        >
          Area
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-400 mr-2">Filter by:</span>
          <select
            className="bg-gray-800 border border-gray-700 rounded text-white text-sm py-1 px-2"
            onChange={(e) => setSelectedMonth(e.target.value)}
            value={selectedMonth}
          >
            <option value="">All Months</option>
            {months.map((month) => {
              const date = new Date(month + "-01");
              return (
                <option key={month} value={month}>
                  {format(date, "MMMM yyyy")}
                </option>
              );
            })}
          </select>
        </div>
        
        {selectedMonth && (
          <button 
            onClick={clearFilter}
            className="text-emerald-400 text-sm hover:text-emerald-300"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === "line" ? (
          <LineChart data={filteredData} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
            <CartesianGrid horizontal={true} vertical={false} stroke="#374151" strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              domain={[0, 'dataMax + 100']}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={chartColors.line}
              strokeWidth={2}
              dot={{ fill: chartColors.line, r: 4 }}
              activeDot={{ r: 6, fill: chartColors.line }}
            />
          </LineChart>
        ) : (
          <AreaChart data={filteredData} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
            <CartesianGrid horizontal={true} vertical={false} stroke="#374151" strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              domain={[0, 'dataMax + 100']}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke={chartColors.area}
              fill={chartColors.areaFill}
              strokeWidth={2}
              activeDot={{ r: 6, fill: chartColors.area }}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {chartData.length > 0 && (
          <>
            <div className="bg-gray-800 p-4 rounded-md">
              <div className="text-sm text-gray-400">Highest Month</div>
              <div className="text-lg font-semibold text-white mt-1">
                {format(new Date(chartData.reduce((prev, current) => 
                  (prev.amount > current.amount) ? prev : current
                ).key + "-01"), "MMMM yyyy")}
              </div>
              <div className="text-emerald-400">
                ${chartData.reduce((prev, current) => 
                  (prev.amount > current.amount) ? prev : current
                ).amount.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-md">
              <div className="text-sm text-gray-400">Average Monthly</div>
              <div className="text-lg font-semibold text-white mt-1">
                ${(chartData.reduce((sum, item) => sum + item.amount, 0) / Math.max(chartData.length, 1)).toFixed(2)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Based on {chartData.length} month{chartData.length !== 1 ? 's' : ''}
              </div>
            </div>
          </>
        )}
      </div>

  
    </div>
  );
}