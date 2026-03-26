"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword, configError } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      if (err?.code === "auth/user-not-found") {
        setError("No account found with that email address.");
      } else {
        setError(err?.message || "Failed to send reset email. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/90 p-8 shadow-2xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/85 sm:p-10">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          NexaFlow
        </Link>

        {sent ? (
          <div className="mt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">Check your email</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              We sent a password reset link to{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>.
              Click the link in that email to set a new password.
            </p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                onClick={() => setSent(false)}
                className="font-medium text-primary hover:underline"
              >
                try again
              </button>
              .
            </p>
            <Link
              href="/login"
              className="mt-6 block w-full rounded-2xl bg-primary px-4 py-3 text-center text-sm font-medium text-white"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter your account email and we&apos;ll send you a link to reset your password.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                  placeholder="name@example.com"
                />
              </div>

              {configError ? <p className="text-sm text-danger">{configError}</p> : null}
              {error ? <p className="text-sm text-danger">{error}</p> : null}

              <button
                type="submit"
                disabled={submitting || !!configError}
                className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send reset link"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-primary">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
