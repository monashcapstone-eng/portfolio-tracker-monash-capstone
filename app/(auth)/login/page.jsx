"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, isAuthenticated, loading, configError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [redirectTarget, setRedirectTarget] = useState("/home");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirectTarget(params.get("next") || "/home");
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, loading, redirectTarget, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await signIn(form.email, form.password);
      router.replace(redirectTarget);
    } catch (signInError) {
      console.error("Login error:", signInError);
      setError(signInError?.message || "Unable to sign in with those credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSubmitting(true);
      setError("");
      await signInWithGoogle();
      router.replace(redirectTarget);
    } catch (googleError) {
      console.error("Google login error:", googleError);
      setError(googleError?.message || "Google sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-2xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/85 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
              NexaFlow
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              One dashboard for every broker, market, and benchmark.
            </h1>
            <p className="mt-4 max-w-md text-sm text-slate-300">
              Track portfolio value, capital gains, dividends, and index outperformance without juggling spreadsheets.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-slate-300">
            <p>Portfolio KPI cards and benchmark overlays out of the box.</p>
            <p>CSV imports for major Australian broker formats.</p>
            <p>Firebase auth and Firestore-backed activity history.</p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <Link href="/" className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              NexaFlow
            </Link>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Access your dashboard, holdings, and import workflows.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Enter your password"
              />
            </div>

            {configError ? <p className="text-sm text-danger">{configError}</p> : null}
            {error ? <p className="text-sm text-danger">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting || !!configError}
              className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting || !!configError}
            className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Sign in with Google
          </button>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Need an account?{" "}
            <Link href="/signup" className="font-medium text-primary">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
