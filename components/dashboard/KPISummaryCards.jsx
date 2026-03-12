"use client";

import { useMemo } from "react";
import { Wallet, TrendingUp, TrendingDown, Banknote, Percent, Info } from "lucide-react";
import { formatCurrency, formatPct } from "@/lib/utils";
import { calculatePortfolioMetrics } from "@/lib/portfolio";

export default function KPISummaryCards({ activities = [], loading, currentValue = null }) {
  const metrics = useMemo(
    () => calculatePortfolioMetrics(activities, { currentValue }),
    [activities, currentValue]
  );

  const cards = [
    {
      title: "Portfolio Value",
      value: formatCurrency(metrics.portfolioValue),
      sub: `Cost basis: ${formatCurrency(metrics.remainingCost)}`,
      icon: Wallet,
      color: "border-t-primary",
      textColor: "text-primary",
      bgColor: "bg-primary/10",
      tooltip: "Total current value of all your holdings",
    },
    {
      title: "Capital Gain",
      value: formatCurrency(metrics.capitalGain),
      sub:
        metrics.totalCost > 0
          ? formatPct((metrics.capitalGain / metrics.totalCost) * 100)
          : "0.00%",
      icon: metrics.capitalGain >= 0 ? TrendingUp : TrendingDown,
      color: metrics.capitalGain >= 0 ? "border-t-success" : "border-t-danger",
      textColor: metrics.capitalGain >= 0 ? "text-success" : "text-danger",
      bgColor: metrics.capitalGain >= 0 ? "bg-success/10" : "bg-danger/10",
      tooltip: "Unrealised + realised gains across all positions",
    },
    {
      title: "Dividend Income",
      value: formatCurrency(metrics.dividendIncome),
      sub: "All time received",
      icon: Banknote,
      color: "border-t-purple",
      textColor: "text-purple",
      bgColor: "bg-purple/10",
      tooltip: "Sum of all dividend payments received",
    },
    {
      title: "Overall Return",
      value: formatPct(metrics.overallReturnPct),
      sub: formatCurrency(metrics.capitalGain + metrics.dividendIncome),
      icon: Percent,
      color: metrics.overallReturnPct >= 0 ? "border-t-success" : "border-t-danger",
      textColor: metrics.overallReturnPct >= 0 ? "text-success" : "text-danger",
      bgColor: metrics.overallReturnPct >= 0 ? "bg-success/10" : "bg-danger/10",
      tooltip: "(Capital Gain + Dividends) / Total Cost",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mb-3" />
            <div className="h-7 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mb-2" />
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`rounded-xl border border-slate-200 bg-white p-4 ${card.color} border-t-[3px] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className="group relative">
                <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                <div className="absolute right-0 top-full z-10 mt-1 hidden w-48 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-600 shadow-lg group-hover:block dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {card.tooltip}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg p-1.5 ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.textColor}`} />
              </div>
              <span className={`text-xl font-bold ${card.textColor}`}>
                {card.value}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {card.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
