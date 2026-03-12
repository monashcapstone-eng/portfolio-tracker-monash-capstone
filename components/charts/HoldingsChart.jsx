"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#6a1b9a", "#c62828", "#00838f", "#4527a0", "#558b2f"];

export default function HoldingsChart({ holdings = [], loading }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mb-4" />
        <div className="h-48 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  const data = Object.entries(holdings)
    .filter(([, h]) => h.qty > 0)
    .map(([symbol, h]) => ({
      name: symbol,
      value: Math.round(h.costBasis * 100) / 100,
    }))
    .sort((a, b) => b.value - a.value);

  if (!data.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">By Security</h3>
        <div className="flex h-48 items-center justify-center text-slate-400 text-sm">No holdings</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">By Security</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
