"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import { getBenchmarkGrowth, BENCHMARK_OPTIONS } from "@/services/benchmarkService";
import { formatPct } from "@/lib/utils";

const TIME_RANGES = [
  { label: "1M", months: 1 },
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
  { label: "2Y", months: 24 },
  { label: "ALL", months: null },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const portfolio = payload.find((p) => p.dataKey === "portfolioGrowth");
  const benchmark = payload.find((p) => p.dataKey === "benchmarkGrowth");
  const delta = (portfolio?.value || 0) - (benchmark?.value || 0);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs text-slate-500 mb-2">{label}</p>
      <p className="text-sm" style={{ color: "#1976d2" }}>
        Portfolio: {formatPct(portfolio?.value || 0)}
      </p>
      <p className="text-sm" style={{ color: "#ed6c02" }}>
        Benchmark: {formatPct(benchmark?.value || 0)}
      </p>
      <p className={`text-sm font-medium ${delta >= 0 ? "text-green-600" : "text-red-600"}`}>
        Delta: {formatPct(delta)}
      </p>
    </div>
  );
}

export default function BenchmarkChart({ portfolioChartData = [], loading }) {
  const [selectedIndex, setSelectedIndex] = useState("SPY");
  const [selectedRange, setSelectedRange] = useState("1Y");
  const [benchmarkData, setBenchmarkData] = useState([]);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);

  const dateRange = useMemo(() => {
    const range = TIME_RANGES.find((r) => r.label === selectedRange);
    const endDate = new Date();
    const startDate = new Date();
    if (range?.months) {
      startDate.setMonth(startDate.getMonth() - range.months);
    } else if (portfolioChartData.length > 0) {
      return {
        start: portfolioChartData[0].date,
        end: endDate.toISOString().split("T")[0],
      };
    } else {
      startDate.setFullYear(startDate.getFullYear() - 3);
    }
    return {
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
    };
  }, [selectedRange, portfolioChartData]);

  useEffect(() => {
    const fetchBenchmark = async () => {
      setBenchmarkLoading(true);
      try {
        const data = await getBenchmarkGrowth(
          selectedIndex,
          dateRange.start,
          dateRange.end
        );
        setBenchmarkData(data);
      } catch (err) {
        console.error("Benchmark fetch error:", err);
      } finally {
        setBenchmarkLoading(false);
      }
    };
    fetchBenchmark();
  }, [selectedIndex, dateRange]);

  const chartData = useMemo(() => {
    if (!portfolioChartData.length && !benchmarkData.length) return [];

    const filteredPortfolio = portfolioChartData.filter((p) => {
      const d = new Date(p.date);
      return d >= new Date(dateRange.start) && d <= new Date(dateRange.end);
    });

    const baseValue = filteredPortfolio.length > 0 ? filteredPortfolio[0].totalValue : 1;
    const portfolioMap = {};
    filteredPortfolio.forEach((p) => {
      portfolioMap[p.date] = ((p.totalValue - baseValue) / (baseValue || 1)) * 100;
    });

    const benchmarkMap = {};
    benchmarkData.forEach((b) => {
      benchmarkMap[b.date] = b.growthPct;
    });

    const allDates = [...new Set([
      ...Object.keys(portfolioMap),
      ...Object.keys(benchmarkMap),
    ])].sort();

    let lastPortfolio = 0;
    let lastBenchmark = 0;
    return allDates.map((date) => {
      if (portfolioMap[date] !== undefined) lastPortfolio = portfolioMap[date];
      if (benchmarkMap[date] !== undefined) lastBenchmark = benchmarkMap[date];
      return {
        date,
        portfolioGrowth: Math.round(lastPortfolio * 100) / 100,
        benchmarkGrowth: Math.round(lastBenchmark * 100) / 100,
      };
    });
  }, [portfolioChartData, benchmarkData, dateRange]);

  const latestPortfolio = chartData.length > 0 ? chartData[chartData.length - 1].portfolioGrowth : 0;
  const latestBenchmark = chartData.length > 0 ? chartData[chartData.length - 1].benchmarkGrowth : 0;
  const delta = latestPortfolio - latestBenchmark;

  if (loading || benchmarkLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mb-4" />
        <div className="h-64 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (!portfolioChartData.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Benchmark Comparison
        </h3>
        <div className="flex h-64 items-center justify-center text-slate-400">
          Add transactions to see benchmark comparison
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Benchmark Comparison
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            {BENCHMARK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-600">
            {TIME_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => setSelectedRange(range.label)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedRange === range.label
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          Portfolio: {formatPct(latestPortfolio)}
        </span>
        <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
          {BENCHMARK_OPTIONS.find((o) => o.value === selectedIndex)?.label}: {formatPct(latestBenchmark)}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            delta >= 0
              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {delta >= 0 ? "\u25B2" : "\u25BC"} {formatPct(Math.abs(delta))}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(d) => {
              const date = new Date(d);
              return `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear().toString().slice(2)}`;
            }}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="portfolioGrowth"
            stroke="#1976d2"
            strokeWidth={2}
            dot={false}
            name="Portfolio"
          />
          <Line
            type="monotone"
            dataKey="benchmarkGrowth"
            stroke="#ed6c02"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            name="Benchmark"
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
