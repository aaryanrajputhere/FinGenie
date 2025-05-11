import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  const CATEGORY_EMOJIS: Record<string, string> = {
    food: "🍔",
    transportation: "🚗",
    shopping: "🛍️",
    entertainment: "🎬",
    bills: "📝",
    health: "💊",
    default: "💰",
  };
  
  function getCategoryEmoji(category: string): string {
    const matched = Object.keys(CATEGORY_EMOJIS).find((key) =>
      category.toLowerCase().includes(key)
    );
    return matched ? CATEGORY_EMOJIS[matched] : CATEGORY_EMOJIS.default;
  }
  
  function CustomTooltip({ active, payload, total }: any) {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-md">
          <p className="text-sm flex items-center gap-1">
            <span>{data.emoji}</span>
            <span className="capitalize">{data.name}</span>
          </p>
          <p className="text-emerald-400 font-medium">
            {data.formattedValue}
          </p>
          <p className="text-xs text-gray-400">
            {((data.value / total) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  }
  
  interface PieDataItem {
    name: string;
    value: number;
    color: string;
    emoji: string;
    formattedValue: string;
  }
  
  interface Props {
    data: PieDataItem[];
    total: number;
  }
  
  export default function SpendingPieChart({ data, total }: Props) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
  
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={total} />} />
          </PieChart>
        </ResponsiveContainer>
  
        <div className="grid grid-cols-2 gap-2 mt-6">
          {data.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                  style={{ backgroundColor: entry.color }}
                >
                  <div className="text-xs">{entry.emoji}</div>
                </div>
                <span className="capitalize text-sm">{entry.name}</span>
              </div>
              <div className="text-sm text-gray-300">
                {entry.formattedValue}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  