"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#6a1b9a", "#c62828", "#00838f"];

export default function SecurityChart({ holdings = [], loading }) {
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
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  if (!data.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Top Securities</h3>
        <div className="flex h-48 items-center justify-center text-slate-400 text-sm">No holdings</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Top Securities</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
          <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
          <Bar dataKey="value" fill="#1976d2" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
