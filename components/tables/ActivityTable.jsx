"use client";

import { useMemo, useState } from "react";
import { formatCurrencyFull, formatDisplayDate } from "@/lib/utils";

export default function ActivityTable({ activities = [], loading = false }) {
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [brokerFilter, setBrokerFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const brokerNames = useMemo(
    () =>
      Array.from(new Set(activities.map((activity) => activity.broker_name).filter(Boolean))),
    [activities]
  );

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (typeFilter !== "ALL" && activity.type !== typeFilter) return false;
      if (brokerFilter !== "ALL" && activity.broker_name !== brokerFilter) return false;
      if (startDate && activity.date < startDate) return false;
      if (endDate && activity.date > endDate) return false;
      return true;
    });
  }, [activities, brokerFilter, endDate, startDate, typeFilter]);

  if (loading) {
    return <div className="h-60 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="grid gap-3 border-b border-slate-200/80 px-6 py-4 md:grid-cols-4 dark:border-slate-700/70">
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        >
          <option value="ALL">All types</option>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
          <option value="DIVIDEND">DIVIDEND</option>
        </select>
        <select
          value={brokerFilter}
          onChange={(event) => setBrokerFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        >
          <option value="ALL">All brokers</option>
          {brokerNames.map((brokerName) => (
            <option key={brokerName} value={brokerName}>
              {brokerName}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/80 text-sm dark:divide-slate-700/70">
          <thead className="bg-slate-50/80 dark:bg-slate-900/60">
            <tr className="text-left text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Security</th>
              <th className="px-4 py-3 font-medium">Broker</th>
              <th className="px-4 py-3 font-medium">Market</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-700/70">
            {filteredActivities.length ? (
              filteredActivities.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {formatDisplayDate(activity.date)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {activity.type}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {activity.security_name || activity.code}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {activity.broker_name || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {activity.market || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {activity.quantity || 0}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {formatCurrencyFull(Number(activity.total_amount || 0), activity.currency || "AUD")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                  No activities match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
