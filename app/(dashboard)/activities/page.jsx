"use client";

import { useActivities } from "@/hooks/useActivities";
import ActivityTable from "@/components/tables/ActivityTable";
import ErrorBanner from "@/components/shared/ErrorBanner";

export default function ActivitiesPage() {
  const { activities, loading, error } = useActivities();

  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Activity log
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Filter and review every transaction
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Slice your activity history by broker, date range, and transaction type to audit what changed across the portfolio.
        </p>
      </section>

      <ErrorBanner message={error} />

      <ActivityTable activities={activities} loading={loading} />
    </div>
  );
}
