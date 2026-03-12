"use client";

import { useActivities } from "@/hooks/useActivities";
import { usePortfolio } from "@/hooks/usePortfolio";
import PerformanceChart from "@/components/charts/PerformanceChart";
import PerformanceReport from "@/components/reports/PerformanceReport";

export default function PerformanceReportPage() {
  const { activities, loading } = useActivities();
  const portfolio = usePortfolio(activities);

  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Report
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Performance report
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Combine a time-series performance chart with a concise summary of the portfolio return components.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <PerformanceChart data={portfolio.chartData} loading={loading} />
        <PerformanceReport metrics={portfolio} />
      </div>
    </div>
  );
}
