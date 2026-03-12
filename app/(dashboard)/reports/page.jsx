"use client";

import Link from "next/link";

const reportLinks = [
  {
    href: "/reports/all-trades",
    title: "All Trades",
    description: "Full transaction export with pagination-ready table view.",
  },
  {
    href: "/reports/sold-securities",
    title: "Sold Securities",
    description: "Review every realised exit and disposal activity.",
  },
  {
    href: "/reports/taxable-income",
    title: "Taxable Income",
    description: "Summarise dividend cash flow and income-producing events.",
  },
  {
    href: "/reports/performance-report",
    title: "Performance Report",
    description: "Portfolio totals, gains, dividends, and chart-based performance context.",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Reports
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Open the reporting view you need
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Jump into trade history, sold positions, taxable income, or a portfolio-wide performance summary.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {reportLinks.map((report) => (
          <Link key={report.href} href={report.href} className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-primary">Report</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
              {report.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {report.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
