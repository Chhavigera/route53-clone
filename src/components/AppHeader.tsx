"use client";

import AccountMenu from "@/components/AccountMenu";

export default function AppHeader() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6">
      <div className="text-xl font-semibold text-gray-900">
        Route 53
      </div>

      <div className="ml-auto flex items-center gap-6 text-sm text-gray-700">
        <button
          type="button"
          className="hover:text-gray-900"
        >
          Services
        </button>

        <button
          type="button"
          className="hover:text-gray-900"
        >
          Support
        </button>

        <button
          type="button"
          className="text-base hover:opacity-70"
          aria-label="Notifications"
        >
          🔔
        </button>

        <AccountMenu />
      </div>
    </header>
  );
}