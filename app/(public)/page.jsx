import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileSpreadsheet,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

export const metadata = {
  title: "NexaFlow Portfolio Tracker",
};

const trustPoints = [
  "Multi-broker tracking with activity history in one workspace",
  "Benchmark overlays for S&P 500, ASX 200, and NASDAQ 100",
  "CSV imports for broker exports and ongoing activity logging",
];

const highlightStats = [
  { value: "9", label: "Core workspace views" },
  { value: "3", label: "Benchmark overlays" },
  { value: "1", label: "Unified portfolio ledger" },
  { value: "0", label: "Spreadsheet tabs required" },
];

const capabilityCards = [
  {
    title: "Clean activity capture",
    copy:
      "Log buys, sells, and dividends with consistent fields so holdings and performance stay coherent.",
    icon: Wallet,
  },
  {
    title: "Broker-aware workflows",
    copy:
      "Separate brokers clearly, import CSV files, and review accounts without rebuilding context every month.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Performance visibility",
    copy:
      "See portfolio value, gain, return percentage, income, and benchmark context in a single operating screen.",
    icon: Gauge,
  },
  {
    title: "Reporting surfaces",
    copy:
      "Move from dashboard review to all trades, sold securities, taxable income, and performance reports without export churn.",
    icon: BarChart3,
  },
  {
    title: "Import and reconcile",
    copy:
      "Standardise CSV input into one activity model and keep portfolio snapshots aligned with the underlying ledger.",
    icon: FileSpreadsheet,
  },
  {
    title: "Protected admin controls",
    copy:
      "Manage premium tagging, user access, and system defaults through a dedicated admin surface when needed.",
    icon: ShieldCheck,
  },
];

const workflowSteps = [
  {
    title: "Capture the ledger",
    copy:
      "Start with manual entries or broker imports so every position change begins with one source of truth.",
  },
  {
    title: "Review portfolio health",
    copy:
      "Use the dashboard to scan current value, gain, allocation, and benchmark comparisons before making decisions.",
  },
  {
    title: "Move into reporting",
    copy:
      "Open holdings, activity history, and report views when you need detail for monthly or quarterly review cycles.",
  },
];

export default function LandingPage() {
  return (
    <div className="pb-20">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 md:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50/80 px-4 py-2 text-sm font-medium text-sky-900 shadow-sm dark:border-sky-900/70 dark:bg-sky-950/50 dark:text-sky-100">
            <Sparkles className="h-4 w-4" />
            Built for investors who want cleaner operating rhythm
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 dark:text-white md:text-6xl">
            One polished workspace for trades, holdings, benchmarks, and review-ready reporting.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            NexaFlow replaces scattered portfolio spreadsheets with a structured workflow. Track
            multiple brokers, log activity, import CSVs, inspect holdings, and review performance
            through one coherent dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 hover:translate-y-[-1px]"
            >
              Create account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              View pricing
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {trustPoints.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-300"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card relative overflow-hidden p-5 md:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_34%)]" />
          <div className="relative space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Portfolio value",
                  value: "$184.6K",
                  tone: "text-slate-950 dark:text-slate-100",
                  panelTone:
                    "dark:border-slate-700/60 dark:bg-slate-950/88",
                },
                {
                  label: "Return",
                  value: "+14.8%",
                  tone: "text-emerald-600 dark:text-emerald-200",
                  panelTone:
                    "dark:border-emerald-900/45 dark:bg-emerald-950/28",
                },
                {
                  label: "Dividend income",
                  value: "$4.9K",
                  tone: "text-amber-600 dark:text-amber-200",
                  panelTone:
                    "dark:border-amber-900/40 dark:bg-amber-950/24",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border border-white/60 bg-white/85 p-4 shadow-sm ${item.panelTone}`}
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    {item.label}
                  </p>
                  <p className={`mt-3 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[28px] border border-white/60 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/15 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Performance overview
                    </p>
                    <p className="mt-2 text-2xl font-semibold">$184,640</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/12 px-3 py-1 text-sm font-medium text-emerald-300">
                    +11.2% YTD
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
                  <svg viewBox="0 0 460 220" className="h-48 w-full">
                    <defs>
                      <linearGradient id="portfolio-fill" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(56,189,248,0.42)" />
                        <stop offset="100%" stopColor="rgba(56,189,248,0)" />
                      </linearGradient>
                    </defs>
                    {[40, 90, 140, 190].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="460"
                        y2={y}
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="4 8"
                      />
                    ))}
                    <path
                      d="M0 190 C40 180, 70 150, 110 156 S180 122, 220 128 S300 78, 340 84 S410 44, 460 28 L460 220 L0 220 Z"
                      fill="url(#portfolio-fill)"
                    />
                    <path
                      d="M0 190 C40 180, 70 150, 110 156 S180 122, 220 128 S300 78, 340 84 S410 44, 460 28"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 182 C45 178, 75 168, 115 166 S190 154, 220 150 S304 130, 340 136 S412 108, 460 98"
                      fill="none"
                      stroke="rgba(251,191,36,0.9)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="8 8"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/82">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <Layers3 className="h-4 w-4" />
                    Allocation by market
                  </div>
                  <div className="mt-5 grid gap-4">
                    {[
                      { label: "ASX", value: "54%", width: "w-[54%]", tone: "bg-sky-500" },
                      { label: "NASDAQ", value: "31%", width: "w-[31%]", tone: "bg-amber-400" },
                      { label: "ETF sleeve", value: "15%", width: "w-[15%]", tone: "bg-emerald-500" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                          <span>{item.label}</span>
                          <span>{item.value}</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className={`h-3 rounded-full ${item.width} ${item.tone}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/82">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <Sparkles className="h-4 w-4" />
                    Recent activity
                  </div>
                  <div className="mt-4 grid gap-3">
                    {[
                      { title: "Bought BHP", meta: "8 units at AUD 44.20", tone: "bg-sky-500" },
                      { title: "Dividend received", meta: "CBA payout recorded", tone: "bg-emerald-500" },
                      { title: "Portfolio rebalance", meta: "IVV trim captured", tone: "bg-amber-400" },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/80"
                      >
                        <div className={`h-9 w-2 rounded-full ${item.tone}`} />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="surface-card grid gap-4 p-6 md:grid-cols-4 md:p-8">
          {highlightStats.map((item) => (
            <article key={item.label} className="rounded-3xl bg-slate-50/80 p-5 dark:bg-slate-800/70">
              <p className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            What you can do
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
            A portfolio workflow that feels structured from first import to monthly review.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Every screen is aimed at reducing manual reconciliation. The product stays grounded in
            the same core objects: activities, brokers, holdings, snapshots, and reports.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {capabilityCards.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="surface-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {item.copy}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Clear enough for regular investors, structured enough for disciplined review cycles.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
              NexaFlow is designed for repeatable portfolio operations rather than one-off chart
              checking. The experience stays anchored to the same logic every time you return.
            </p>
            <Link
              href="/features"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              Explore feature breakdown
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4">
            {workflowSteps.map((step, index) => (
              <article key={step.title} className="surface-card flex gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-base font-semibold text-white dark:bg-white dark:text-slate-950">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    {step.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 md:px-6">
        <div className="overflow-hidden rounded-[32px] bg-slate-950 px-6 py-10 text-white shadow-xl shadow-slate-950/20 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
                Get started
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
                Move your portfolio review out of disconnected tabs and into one sharper workflow.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950"
              >
                Register now
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
