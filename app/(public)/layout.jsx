import Link from "next/link";
import PublicNavbar from "@/components/marketing/PublicNavbar";

export default function PublicLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_24%)]" />
      <PublicNavbar />
      <main className="relative">{children}</main>
      <footer className="relative border-t border-slate-200/80 bg-white/55 py-10 backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/55">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))] md:px-6">
          <div className="max-w-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              NexaFlow
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Portfolio operations without the spreadsheet drag.
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Bring brokers, activities, holdings, benchmarks, and reports into one deliberate
              workflow.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Product</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
              <Link href="/">Overview</Link>
              <Link href="/features">Features</Link>
              <Link href="/pricing">Pricing</Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Access</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
              <Link href="/login">Log in</Link>
              <Link href="/signup">Register</Link>
              <Link href="/pricing">See pricing</Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Built for</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
              <p>Individual investors</p>
              <p>Broker-heavy portfolios</p>
              <p>Recurring performance reviews</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
