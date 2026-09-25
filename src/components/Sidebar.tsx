"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(path: string) {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  }

  const linkClass = (path: string) =>
    `block rounded-md px-3 py-2 text-sm ${
      isActive(path)
        ? "bg-[#e7f0ff] font-medium text-[#1464d2]"
        : "text-gray-800 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] border-r border-gray-200 bg-white">
      <nav className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
          Route 53
        </div>

        <Link href="/" className={linkClass("/")}>
          Dashboard
        </Link>

        <Link
          href="/hosted-zones"
          className={linkClass("/hosted-zones")}
        >
          Hosted zones
        </Link>

        <Link
          href="/traffic-policies"
          className={linkClass("/traffic-policies")}
        >
          Traffic policies
        </Link>

        <Link
          href="/health-checks"
          className={linkClass("/health-checks")}
        >
          Health checks
        </Link>

        <div className="pt-5 px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
          Resolver
        </div>

        <Link
          href="/resolver"
          className={linkClass("/resolver")}
        >
          Resolver
        </Link>

        <Link
          href="/profiles"
          className={linkClass("/profiles")}
        >
          Profiles
        </Link>
      </nav>
    </aside>
  );
}