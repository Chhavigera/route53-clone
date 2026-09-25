"use client";

import Link from "next/link";

export default function HealthChecksPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-lg border border-gray-300 bg-white p-8 text-center">
          <div className="text-3xl">🚧</div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            Health checks
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            Health check management is not implemented in this clone yet.
          </p>
          <div className="mt-6 inline-block rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
            Coming soon
          </div>
          <div className="mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-[#1464d2] hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
