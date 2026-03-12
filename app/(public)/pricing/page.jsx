import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Pricing",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "/ month",
    summary: "For investors who want the full core tracker without upfront friction.",
    cta: "Start free",
    href: "/signup",
    tone:
      "border-slate-200/80 bg-white/92 dark:border-slate-700/70 dark:bg-slate-900/82",
    points: [
      "Portfolio dashboard, holdings, brokers, and reports",
      "Manual activity capture plus CSV import workflows",
      "Benchmark comparison and Firebase-backed account access",
      "Ideal for getting your portfolio review process organised",
    ],
  },
  {
    name: "Premium",
    price: "$19",
    cadence: "/ month",
    summary: "For users who want premium plan status and priority access to the evolving product.",
    cta: "Choose premium",
    href: "/signup",
    featured: true,
    tone:
      "border-slate-950 bg-slate-950 text-white shadow-2xl shadow-slate-950/20 dark:border-white dark:bg-white dark:text-slate-950",
    points: [
      "Everything in Free plus premium plan designation",
      "Priority onboarding for managed or showcase deployments",
      "Reserved access path for upcoming advanced modules",
      "Stronger fit for polished client demos and pilot rollouts",
    ],
  },
];

const comparisonRows = [
  { label: "Portfolio dashboard", free: "Included", premium: "Included" },
  { label: "Broker management", free: "Included", premium: "Included" },
  { label: "CSV imports", free: "Included", premium: "Included" },
  { label: "Reports workspace", free: "Included", premium: "Included" },
  { label: "Premium plan status", free: "-", premium: "Included" },
  { label: "Priority rollout support", free: "-", premium: "Included" },
];

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-4 py-2 text-sm font-medium text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/50 dark:text-emerald-100">
            <ShieldCheck className="h-4 w-4" />
            Transparent pricing for the current product scope
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Pricing
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
            Start free, then upgrade when you want a more polished rollout.
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
            The core tracker is already substantial: dashboard, activities, brokers, holdings,
            reports, and imports. Premium is for users who want priority treatment and a more
            presentation-ready path as the product grows.
          </p>
        </div>

        <div className="surface-card grid gap-4 p-6 md:grid-cols-2">
          {[
            { value: "2", label: "Simple plan options" },
            { value: "0", label: "Setup fees on Free" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/75">
              <p className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-5 xl:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-[30px] border p-7 ${plan.tone}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-current/10 bg-current/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  {plan.featured ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Recommended
                    </>
                  ) : (
                    "Core access"
                  )}
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight">{plan.name}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-300">
                  {plan.summary}
                </p>
              </div>
            </div>

            <p className="mt-8 text-5xl font-semibold tracking-tight">
              {plan.price}
              <span className="text-base font-medium text-slate-500 dark:text-slate-300">
                {" "}
                {plan.cadence}
              </span>
            </p>

            <div className="mt-8 grid gap-3">
              {plan.points.map((point) => (
                <div
                  key={point}
                  className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ${
                    plan.featured
                      ? "bg-white/8 text-white dark:bg-slate-900/8 dark:text-slate-950"
                      : "bg-slate-50 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
                  }`}
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <Link
              href={plan.href}
              className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium ${
                plan.featured
                  ? "bg-white text-slate-950"
                  : "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
              }`}
            >
              {plan.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Compare plans
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
            A simple structure with the core product available from day one.
          </h2>
        </div>

        <div className="surface-card mt-10 overflow-hidden">
          <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] border-b border-slate-200/80 bg-slate-50/80 px-6 py-4 text-sm font-semibold text-slate-950 dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-white">
            <div>Capability</div>
            <div>Free</div>
            <div>Premium</div>
          </div>
          {comparisonRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1.4fr_0.8fr_0.8fr] items-center border-b border-slate-200/70 px-6 py-4 text-sm last:border-b-0 dark:border-slate-700/60"
            >
              <div className="text-slate-700 dark:text-slate-200">{row.label}</div>
              <div className="text-slate-500 dark:text-slate-400">{row.free}</div>
              <div className="text-slate-500 dark:text-slate-400">{row.premium}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-4 xl:grid-cols-3">
        {[
          {
            title: "When is Free enough?",
            copy:
              "If you want a clean personal workflow for trades, holdings, and review, Free already covers the essential product surfaces.",
          },
          {
            title: "Why upgrade to Premium?",
            copy:
              "Premium is best when you want priority treatment, a more presentation-ready setup, or a managed showcase environment.",
          },
          {
            title: "Can I start now and upgrade later?",
            copy:
              "Yes. Start in Free, organise your data, and move up only if the added rollout value matters to you.",
          },
        ].map((item) => (
          <article key={item.title} className="surface-card p-6">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              {item.copy}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
