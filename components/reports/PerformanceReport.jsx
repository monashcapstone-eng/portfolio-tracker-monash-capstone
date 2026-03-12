"use client";

import { formatCurrencyFull, formatPct } from "@/lib/utils";

export default function PerformanceReport({ metrics }) {
  const rows = [
    { label: "Total cost", value: formatCurrencyFull(metrics.totalCost || 0) },
    { label: "Portfolio value", value: formatCurrencyFull(metrics.portfolioValue || 0) },
    { label: "Capital gain", value: formatCurrencyFull(metrics.capitalGain || 0) },
    { label: "Dividend income", value: formatCurrencyFull(metrics.dividendIncome || 0) },
    { label: "Overall return", value: formatPct(metrics.overallReturnPct || 0) },
  ];

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-slate-200/80 px-6 py-4 dark:border-slate-700/70">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Performance Report
        </h3>
      </div>
      <div className="divide-y divide-slate-200/80 dark:divide-slate-700/70">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-6 py-4 text-sm"
          >
            <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
            <span className="font-medium text-slate-900 dark:text-white">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
