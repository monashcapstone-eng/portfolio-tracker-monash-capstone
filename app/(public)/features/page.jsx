import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  FileSpreadsheet,
  Layers3,
  LockKeyhole,
  Settings2,
  Wallet,
} from "lucide-react";

export const metadata = {
  title: "Features",
};

const sections = [
  {
    title: "Capture",
    description:
      "Everything starts with a cleaner ledger. Record trades, dividends, and broker imports in one shared model.",
    icon: Wallet,
    items: [
      "Manual buy, sell, and dividend activity forms",
      "Broker-aware transaction history with consistent fields",
      "CSV upload workflows for broker export files",
      "Snapshot generation based on activity history",
    ],
  },
  {
    title: "Understand",
    description:
      "Once the ledger is trustworthy, the dashboard and holdings surfaces become far more useful for routine review.",
    icon: BarChart3,
    items: [
      "KPI cards for value, gain, return, and dividend income",
      "Benchmark comparison against major index overlays",
      "Holdings views grouped by market, currency, and security",
      "Performance snapshots that support recurring review cycles",
    ],
  },
  {
    title: "Operate",
    description:
      "The app supports the practical tasks around a portfolio, not just the visual side of investing.",
    icon: Settings2,
    items: [
      "Broker management screens for account-level organisation",
      "Reports for all trades, sold holdings, performance, and income",
      "Settings for currency defaults and user preferences",
      "Protected admin routes for plans, roles, and system settings",
    ],
  },
];

const productMap = [
  {
    title: "Home dashboard",
    copy: "A single review surface for KPIs, benchmark charts, allocation, and recent activity.",
    icon: Layers3,
  },
  {
    title: "Activities ledger",
    copy: "Searchable trade and dividend history that acts as the backbone of the portfolio model.",
    icon: Wallet,
  },
  {
    title: "Broker workspaces",
    copy: "Separate broker accounts cleanly so imported and manual activity stay contextual.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Import workflow",
    copy: "Bring broker CSV exports into the app without manually rebuilding positions line by line.",
    icon: FileSpreadsheet,
  },
  {
    title: "Reports",
    copy: "Jump from high-level review into detailed trade, tax, and realised-gain reporting.",
    icon: BarChart3,
  },
  {
    title: "Access controls",
    copy: "Protected routes and admin tooling support managed rollouts and user oversight.",
    icon: LockKeyhole,
  },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Features
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
            Built for portfolio operations, not just isolated charts.
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
            NexaFlow connects trade capture, broker organisation, benchmark review, holdings
            analysis, reporting, and admin control in one workflow. The goal is clarity across the
            full operating loop of a personal portfolio.
          </p>
        </div>

        <div className="surface-card grid gap-4 p-6 md:grid-cols-3">
          {[
            { value: "3", label: "Workflow pillars" },
            { value: "6", label: "Primary product surfaces" },
            { value: "4", label: "Report categories" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">
              <p className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-4 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <article key={section.title} className="surface-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                {section.description}
              </p>
              <div className="mt-6 grid gap-3">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800/75 dark:text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Product map
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
            The core screens work together instead of feeling like separate tools.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Each surface has a distinct responsibility, which keeps the experience easier to scan
            and easier to trust when portfolio data changes over time.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {productMap.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="surface-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {item.copy}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-20">
        <div className="overflow-hidden rounded-[32px] bg-slate-950 px-6 py-10 text-white shadow-xl shadow-slate-950/20 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
                Ready to use it
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Start with the core workflow now, then grow into the rest of the reporting stack.
              </h2>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950"
            >
              Register
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
