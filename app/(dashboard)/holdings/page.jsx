"use client";

import { useActivities } from "@/hooks/useActivities";
import { usePortfolio } from "@/hooks/usePortfolio";
import { formatCurrencyFull } from "@/lib/utils";
import SecurityChart from "@/components/charts/SecurityChart";
import CurrencyChart from "@/components/charts/CurrencyChart";
import MarketChart from "@/components/charts/MarketChart";
import TypeChart from "@/components/charts/TypeChart";
import ErrorBanner from "@/components/shared/ErrorBanner";

export default function HoldingsPage() {
  const { activities, loading, error } = useActivities();
  const portfolio = usePortfolio(activities);

  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Holdings overview
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Current positions and exposure mix
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Review your portfolio distribution by security, currency, market, and asset type using the same activity-driven calculation engine as the dashboard.
        </p>

        <div className="mt-6 inline-flex rounded-2xl bg-slate-100/80 px-5 py-4 dark:bg-slate-800/80">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Total cash value
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
              {formatCurrencyFull(portfolio.portfolioValue || 0)}
            </p>
          </div>
        </div>
      </section>

      <ErrorBanner message={error} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SecurityChart holdings={portfolio.holdings} loading={loading} />
        <CurrencyChart holdings={portfolio.holdings} loading={loading} />
        <MarketChart holdings={portfolio.holdings} loading={loading} />
        <TypeChart holdings={portfolio.holdings} loading={loading} />
      </div>
    </div>
  );
}
