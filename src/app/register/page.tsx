"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Mail,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type SuccessType = "account" | "verification";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successType, setSuccessType] = useState<SuccessType | null>(null);

  useEffect(() => {
    if (!successType) return;

    const destination =
      successType === "account" ? "/account" : "/login";

    const delay = successType === "account" ? 3000 : 5000;

    const timer = window.setTimeout(() => {
      router.replace(destination);
      router.refresh();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [successType, router]);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccessType(null);

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      setPassword("");
      setConfirmPassword("");

      if (data.session) {
        setSuccessType("account");
      } else {
        setSuccessType("verification");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
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
          Create your account
        </h1>

        <p className="mb-7 text-sm text-gray-500">
          Join TariMart and enjoy a smarter shopping experience.
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full name
            </label>

            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter your password again"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || successType !== null}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-green-700 hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-5 text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-green-700">
            ← Back to shopping
          </Link>
        </p>
      </div>

      {successType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-success-title"
            className="w-full max-w-sm overflow-hidden rounded-3xl bg-white p-7 text-center shadow-2xl"
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={38} className="text-green-600" />
              </div>
            </div>

            <span className="mb-2 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700">
              {successType === "account"
                ? "Registration successful"
                : "Account created"}
            </span>

            <h2
              id="register-success-title"
              className="mb-2 text-2xl font-bold text-gray-900"
            >
              {successType === "account"
                ? "Welcome to TariMart!"
                : "One more step!"}
            </h2>

            <p className="mb-6 text-sm leading-6 text-gray-500">
              {successType === "account" ? (
                <>
                  Welcome,{" "}
                  <span className="font-semibold text-gray-800">
                    {name}
                  </span>
                  ! Your account is ready. Your smarter shopping experience
                  starts now.
                </>
              ) : (
                <>
                  Your TariMart account has been created. Please check{" "}
                  <span className="font-semibold text-gray-800">
                    {email}
                  </span>{" "}
                  and click the verification link before signing in.
                </>
              )}
            </p>

            <div className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-800">
              {successType === "account" ? (
                <>
                  <ShoppingBag size={18} />
                  <span>Happy shopping with TariMart!</span>
                </>
              ) : (
                <>
                  <Mail size={18} />
                  <span>Check your inbox for verification</span>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-700">
              <span>
                {successType === "account"
                  ? "Taking you to your account..."
                  : "Taking you to sign in..."}
              </span>
              <ArrowRight size={17} />
            </div>

            <p className="mt-3 text-xs text-gray-400">
              You will be redirected automatically.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
