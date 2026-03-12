"use client";

import { useActivities } from "@/hooks/useActivities";
import { usePortfolio } from "@/hooks/usePortfolio";
import KPISummaryCards from "@/components/dashboard/KPISummaryCards";
import BenchmarkChart from "@/components/charts/BenchmarkChart";
import PerformanceChart from "@/components/charts/PerformanceChart";
import PerformanceReport from "@/components/reports/PerformanceReport";
import ErrorBanner from "@/components/shared/ErrorBanner";

export default function PerformancePage() {
  const { activities, loading, error } = useActivities();
  const portfolio = usePortfolio(activities);

  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Performance
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Portfolio growth versus market benchmarks
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Compare your portfolio trajectory against benchmark indices and inspect the return drivers behind your current result.
        </p>
      </section>

      <ErrorBanner message={error} />

      <KPISummaryCards
        activities={activities}
        loading={loading}
        currentValue={portfolio.portfolioValue}
      />

      <BenchmarkChart
        portfolioChartData={portfolio.chartData}
        loading={loading}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <PerformanceChart data={portfolio.chartData} loading={loading} />
        <PerformanceReport metrics={portfolio} />
      </div>
    </div>
  );
}
