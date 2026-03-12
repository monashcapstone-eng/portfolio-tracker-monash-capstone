"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const TIME_RANGES = ["1M", "3M", "6M", "1Y", "ALL"];
const MARKET_COLORS = {
  ASX: "#1976d2",
  NASDAQ: "#2e7d32",
  NYSE: "#ed6c02",
  LSE: "#6a1b9a",
  TSX: "#c62828",
  OTHER: "#00838f",
};

export default function PortfolioAreaChart({ chartData = [], markets = [], loading }) {
  const [selectedRange, setSelectedRange] = useState("ALL");
  const [selectedMarkets, setSelectedMarkets] = useState(new Set(markets));

  const filteredData = useMemo(() => {
    if (!chartData.length) return [];
    let data = [...chartData];
    if (selectedRange !== "ALL") {
      const months = { "1M": 1, "3M": 3, "6M": 6, "1Y": 12 }[selectedRange] || 12;
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - months);
      data = data.filter((d) => new Date(d.date) >= cutoff);
    }
    return data;
  }, [chartData, selectedRange]);

  const toggleMarket = (market) => {
    setSelectedMarkets((prev) => {
      const next = new Set(prev);
      if (next.has(market)) next.delete(market);
      else next.add(market);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mb-4" />
        <div className="h-72 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Portfolio Value</h3>
        <div className="flex flex-wrap items-center gap-2">
          {markets.map((m) => (
            <button
              key={m}
              onClick={() => toggleMarket(m)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedMarkets.has(m)
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {m}
            </button>
          ))}
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-600">
            {TIME_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRange(r)}
                className={`px-2.5 py-1 text-xs font-medium ${
                  selectedRange === r ? "bg-primary text-white" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!filteredData.length ? (
        <div className="flex h-72 items-center justify-center text-slate-400">
          No data for selected period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={filteredData}>
            <defs>
              {markets.map((m) => (
                <linearGradient key={m} id={`grad-${m}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={MARKET_COLORS[m] || "#1976d2"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={MARKET_COLORS[m] || "#1976d2"} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend />
            {markets
              .filter((m) => selectedMarkets.has(m))
              .map((m) => (
                <Area
                  key={m}
                  type="monotone"
                  dataKey={m}
                  stackId="1"
                  stroke={MARKET_COLORS[m] || "#1976d2"}
                  fill={`url(#grad-${m})`}
                  strokeWidth={2}
                />
              ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
