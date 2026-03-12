"use client";

import { useMemo } from "react";
import { useActivities } from "@/hooks/useActivities";
import { formatCurrencyFull, formatDisplayDate } from "@/lib/utils";

export default function TaxableIncomeReportPage() {
  const { activities, loading } = useActivities();

  const dividends = useMemo(
    () => activities.filter((activity) => activity.type === "DIVIDEND"),
    [activities]
  );

  const dividendTotal = useMemo(
    () => dividends.reduce((sum, activity) => sum + Number(activity.total_amount || 0), 0),
    [dividends]
  );

  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Report
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Taxable income
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Dividend receipts are summarised here so income-producing events are easy to review and export.
        </p>
        <div className="mt-6 inline-flex rounded-2xl bg-primary/8 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-primary">Total dividend income</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
              {formatCurrencyFull(dividendTotal)}
            </p>
          </div>
        </div>
      </section>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/80 text-sm dark:divide-slate-700/70">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60">
              <tr className="text-left text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Broker</th>
                <th className="px-4 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-700/70">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                    Loading dividends...
                  </td>
                </tr>
              ) : dividends.length ? (
                dividends.map((activity) => (
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
                      {formatCurrencyFull(Number(activity.total_amount || 0), activity.currency || "AUD")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                    No dividend activities recorded.
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
