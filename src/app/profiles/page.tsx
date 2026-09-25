"use client";

import Link from "next/link";

export default function ProfilesPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6">
        <div className="text-xl font-semibold text-gray-900">
          Route 53
        </div>

        <div className="ml-auto text-sm text-gray-700">
          Admin User
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 min-h-[calc(100vh-4rem)] border-r border-gray-200 bg-white">
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
              Route 53
            </div>

            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/hosted-zones"
              className="block rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              Hosted zones
            </Link>

            <Link
              href="/traffic-policies"
              className="block rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              Traffic policies
            </Link>

            <Link
              href="/health-checks"
              className="block rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              Health checks
            </Link>

            <div className="pt-5 px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
              Resolver
            </div>

            <Link
              href="/resolver"
              className="block rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              Resolver
            </Link>

            <Link
              href="/profiles"
              className="block rounded-md bg-[#e7f0ff] px-3 py-2 text-sm font-medium text-[#1464d2]"
            >
              Profiles
            </Link>
          </nav>
        </aside>

        <section className="flex-1 p-8">
          <Link
            href="/"
            className="text-sm font-medium text-[#1464d2] hover:underline"
          >
            ← Dashboard
          </Link>

          <div className="mt-8 max-w-2xl rounded-lg border border-gray-300 bg-white px-8 py-10">
            <div className="text-3xl">🚧</div>

            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Profiles
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              Route 53 Profiles are not implemented in this clone yet.
              This section is reserved for future functionality.
            </p>

            <div className="mt-6 inline-flex rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
              Coming soon
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
