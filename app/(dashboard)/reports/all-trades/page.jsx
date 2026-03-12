"use client";

import { useActivities } from "@/hooks/useActivities";
import TransactionTable from "@/components/tables/TransactionTable";

export default function AllTradesReportPage() {
  const { activities, loading, deleteActivity, fetchActivities } = useActivities();

  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Report
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          All trades
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          This report exposes the full transaction list with filters, paging, and delete controls.
        </p>
      </section>

      <TransactionTable
        transactions={activities}
        loading={loading}
        onDelete={async (id) => {
          await deleteActivity(id);
          await fetchActivities();
        }}
      />
    </div>
  );
}
