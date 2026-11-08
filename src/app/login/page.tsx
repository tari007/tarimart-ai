"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [customerName, setCustomerName] = useState("there");

  useEffect(() => {
    if (!showSuccessModal) return;

    if (countdown <= 0) {
      router.replace("/account");
      router.refresh();
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [showSuccessModal, countdown, router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) throw loginError;

      const name =
        data.user?.user_metadata?.full_name ||
        data.user?.email?.split("@")[0] ||
        "there";

      setCustomerName(name);
      setCountdown(3);
      setShowSuccessModal(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

      if (resetError) throw resetError;

      setSuccess(
        "If an account exists for this email, a password reset link will be sent."
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to request a password reset."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">

        <Link
          href="/"
          className="mb-8 inline-block text-2xl font-bold text-gray-900"
        >
          Tari<span className="text-green-600">Mart</span>
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Welcome back
        </h1>

        <p className="mb-7 text-sm text-gray-500">
          Sign in to continue your smarter shopping experience.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 outline-none focus:border-green-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 text-gray-900 outline-none focus:border-green-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="text-sm font-medium text-green-700 hover:underline disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">NEW TO TARIMART?</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <Link
          href="/register"
          className="block w-full rounded-lg border border-green-600 px-4 py-3 text-center font-semibold text-green-700 transition hover:bg-green-50"
        >
          Create an account
        </Link>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-green-700">
            ← Back to shopping
          </Link>
        </p>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-success-title"
            className="w-full max-w-sm animate-[modalPop_0.35s_ease-out] overflow-hidden rounded-3xl bg-white p-7 text-center shadow-2xl"
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2
                  size={38}
                  className="text-green-600"
                />
              </div>
            </div>

            <span className="mb-2 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700">
              Login successful
            </span>

            <h2
              id="login-success-title"
              className="mb-2 text-2xl font-bold text-gray-900"
            >
              Welcome back!
            </h2>

            <p className="mb-6 text-sm leading-6 text-gray-500">
              Hello, <span className="font-semibold text-gray-800">{customerName}</span>!
              You&apos;re signed in. Your TariMart shopping experience awaits.
            </p>

            <div className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-800">
              <ShoppingBag size={18} />
              <span>Great to have you back!</span>
            </div>

            <button
              type="button"
              onClick={() => router.replace("/account")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-semibold text-white transition hover:bg-green-700"
            >
              Continue to my account
              <ArrowRight size={18} />
            </button>

            <p className="mt-4 text-xs text-gray-400">
              Redirecting automatically in {countdown} seconds...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
