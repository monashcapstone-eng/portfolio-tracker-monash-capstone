"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, isAuthenticated, loading, configError } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGoogleSignUp = async () => {
    try {
      setSubmitting(true);
      setError("");
      await signInWithGoogle();
      router.replace("/home");
    } catch (googleError) {
      console.error("Google sign-up error:", googleError);
      setError(googleError?.message || "Google sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await signUp(form.email, form.password, {
        first_name: form.first_name,
        last_name: form.last_name,
      });
      setSuccess("Account created. Check your email settings if verification is enabled, then sign in.");
      router.replace("/home");
    } catch (signupError) {
      console.error("Signup error:", signupError);
      setError(signupError?.message || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-[28px] border border-slate-200/80 bg-white/90 p-8 shadow-2xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/85 sm:p-10">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          NexaFlow
        </Link>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Set up a portfolio workspace with benchmark comparison, CSV imports, and broker-level tracking.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              value={form.first_name}
              onChange={(event) => setForm((current) => ({ ...current, first_name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="First name"
            />
            <input
              required
              value={form.last_name}
              onChange={(event) => setForm((current) => ({ ...current, last_name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="Last name"
            />
          </div>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            placeholder="name@example.com"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="Password"
            />
            <input
              type="password"
              required
              value={form.confirm_password}
              onChange={(event) => setForm((current) => ({ ...current, confirm_password: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="Confirm password"
            />
          </div>

          {configError ? <p className="text-sm text-danger">{configError}</p> : null}
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {success ? <p className="text-sm text-success">{success}</p> : null}

          <button
            type="submit"
            disabled={submitting || !!configError}
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={submitting || !!configError}
          className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sign up with Google
        </button>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
