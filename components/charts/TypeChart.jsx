"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#6a1b9a", "#c62828"];

export default function TypeChart({ holdings = {}, loading }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 h-5 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-48 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  const totals = {};
  Object.values(holdings).forEach((holding) => {
    if (holding.qty <= 0) {
      return;
    }

    const type = holding.type || "Equity";
    totals[type] = (totals[type] || 0) + holding.costBasis;
  });

  const data = Object.entries(totals).map(([name, value]) => ({ name, value }));

  if (!data.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">By Type</h3>
        <div className="flex h-48 items-center justify-center text-sm text-slate-400">No holdings</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">By Type</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={72}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
