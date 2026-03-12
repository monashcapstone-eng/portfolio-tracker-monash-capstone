"use client";

const FAQ_ITEMS = [
  {
    question: "How is portfolio value calculated?",
    answer:
      "The dashboard walks activities in chronological order, updates open positions, and uses remaining cost basis as the default live value when market prices are not available.",
  },
  {
    question: "What benchmark symbols are used?",
    answer:
      "S&P 500 uses SPY, ASX 200 uses IOZ.AX, and NASDAQ 100 uses QQQ through the Alpha Vantage proxy route.",
  },
  {
    question: "What happens when Alpha Vantage is rate limited?",
    answer:
      "The benchmark service switches to demo data so the comparison chart stays usable even without a live API response.",
  },
  {
    question: "Which CSV formats are supported?",
    answer:
      "HSBC Australia, 180 Markets, 708 Wealth, Alpine Capital, ASR Wealth, and Sharesight are supported in the uploader.",
  },
];

export default function FAQPage() {
  return (
    <div className="space-y-6">
      <section className="surface-card p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          FAQ
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Common setup and workflow questions
        </h1>
      </section>

      <div className="grid gap-4">
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} className="surface-card p-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {item.question}
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
