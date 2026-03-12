"use client";

import { useMemo } from "react";
import { useActivities } from "@/hooks/useActivities";
import { formatCurrencyFull, formatDisplayDate } from "@/lib/utils";

export default function SoldSecuritiesReportPage() {
  const { activities, loading } = useActivities();

  const soldActivities = useMemo(
    () => activities.filter((activity) => activity.type === "SELL"),
    [activities]
  );

  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Report
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Sold securities
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Review every disposal event and the gross amount attached to each sell activity.
        </p>
      </section>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/80 text-sm dark:divide-slate-700/70">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60">
              <tr className="text-left text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Broker</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Gross proceeds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-700/70">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                    Loading sells...
                  </td>
                </tr>
              ) : soldActivities.length ? (
                soldActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {formatDisplayDate(activity.date)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-950 dark:text-white">
                      {activity.code}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {activity.broker_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {activity.quantity}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {formatCurrencyFull(Number(activity.price || 0), activity.currency || "AUD")}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {formatCurrencyFull(Number(activity.total_amount || 0), activity.currency || "AUD")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                    No sold securities recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
