"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await login(email, password);

      localStorage.setItem("route53_token", result.token);
      localStorage.setItem(
        "route53_user",
        JSON.stringify(result.user)
      );

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo / Title */}
          <div className="mb-8 text-center">
            <div className="text-3xl font-semibold text-gray-900">
              Route 53
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Sign in to your Route 53 console
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-lg border border-gray-300 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-7 py-5">
              <h1 className="text-xl font-semibold text-gray-900">
                Sign in
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                Enter your credentials to continue.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-7 py-7"
            >
              {/* Error */}
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  autoComplete="email"
                  className="w-full rounded-md border border-gray-400 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2]"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  autoComplete="current-password"
                  className="w-full rounded-md border border-gray-400 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2]"
                  placeholder="Enter your password"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#1464d2] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0f54b5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          {/* Demo credentials */}
          <div className="mt-5 rounded-md border border-gray-200 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
              Demo credentials
            </p>

            <p className="mt-2 text-sm text-gray-700">
              Email:{" "}
              <span className="font-medium text-gray-900">
                admin@example.com
              </span>
            </p>

            <p className="mt-1 text-sm text-gray-700">
              Password:{" "}
              <span className="font-medium text-gray-900">
                password123
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}