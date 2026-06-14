"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { InventoryItem } from "@/types/index.type";

interface StockChartProps {
  inventory: InventoryItem[];
}

export default function StockChart({ inventory }: StockChartProps) {
  // 1. Transform your nested inventory data into the flat format Recharts prefers
  const chartData = inventory.map((item) => ({
    name: item.medicine.name,
    quantity: item.quantity,
    // Add a status so we can color-code the bars
    status: item.quantity === 0 ? "out" : item.quantity < 20 ? "low" : "good",
  }));

  // Custom tooltip for a cleaner look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Stock: <span className="font-semibold">{payload[0].value}</span>{" "}
            units
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-xl mb-6">
      <h2 className="text-black font-semibold text-lg">
        Stock Levels Overview
      </h2>
      <ResponsiveContainer width="100%" height={288}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F3F4F6" }} />
          <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
            {/* Dynamically color bars based on stock levels */}
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.status === "out"
                    ? "#EF4444" // Red for out of stock
                    : entry.status === "low"
                      ? "#F59E0B" // Amber for low stock
                      : "#10B981" // Green for good stock
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
