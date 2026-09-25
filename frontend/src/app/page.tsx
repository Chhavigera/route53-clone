"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/AuthProvider";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";

import {
  getHostedZones,
  getDNSRecords,
  HostedZone,
} from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();

  const [hostedZones, setHostedZones] = useState<HostedZone[]>([]);
  const [dnsRecordCount, setDnsRecordCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");

        const zones = await getHostedZones();

        setHostedZones(zones);

        let totalRecords = 0;

        for (const zone of zones) {
          try {
            const records = await getDNSRecords(zone.id);
            totalRecords += records.length;
          } catch {
            // Continue if one zone cannot be loaded.
          }
        }

        setDnsRecordCount(totalRecords);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <AppHeader />

      <div className="flex">
        <Sidebar />

        <section className="flex-1 p-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-700">
              Welcome back, {user?.name || "User"}.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-6 py-4">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Summary cards */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Link
              href="/hosted-zones"
              className="rounded-lg border border-gray-300 bg-white p-6 transition hover:border-[#1464d2] hover:shadow-sm"
            >
              <p className="text-sm font-medium text-gray-600">
                Hosted zones
              </p>

              <p className="mt-3 text-3xl font-semibold text-gray-900">
                {loading ? "—" : hostedZones.length}
              </p>

              <p className="mt-3 text-sm font-medium text-[#1464d2]">
                View hosted zones →
              </p>
            </Link>

            <div className="rounded-lg border border-gray-300 bg-white p-6">
              <p className="text-sm font-medium text-gray-600">
                DNS records
              </p>

              <p className="mt-3 text-3xl font-semibold text-gray-900">
                {loading ? "—" : dnsRecordCount}
              </p>

              <p className="mt-3 text-sm text-gray-600">
                Records across all hosted zones
              </p>
            </div>
          </div>

          {/* Hosted zones */}
          <div className="mt-8 overflow-hidden rounded-lg border border-gray-300 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Hosted zones
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Your configured Route 53 hosted zones.
                </p>
              </div>

              <Link
                href="/hosted-zones"
                className="text-sm font-medium text-[#1464d2] hover:underline"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-gray-600">
                  Loading dashboard data...
                </p>
              </div>
            ) : hostedZones.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm font-medium text-gray-900">
                  No hosted zones yet
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Create your first hosted zone to get started.
                </p>

                <Link
                  href="/hosted-zones/new"
                  className="mt-5 inline-block rounded-md bg-[#1464d2] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f54b5]"
                >
                  Create hosted zone
                </Link>
              </div>
            ) : (
              <div>
                {hostedZones.slice(0, 5).map((zone) => (
                  <Link
                    key={zone.id}
                    href={`/hosted-zones/${zone.id}`}
                    className="flex items-center justify-between border-b border-gray-200 px-6 py-4 last:border-b-0 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1464d2]">
                        {zone.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {zone.description || "No description"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {zone.type}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        View details →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Coming soon */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Link
              href="/traffic-policies"
              className="rounded-lg border border-gray-300 bg-white p-6 transition hover:border-[#1464d2] hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Traffic policies
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Manage traffic policy configurations.
              </p>

              <p className="mt-5 text-sm font-medium text-gray-500">
                Coming soon →
              </p>
            </Link>

            <Link
              href="/health-checks"
              className="rounded-lg border border-gray-300 bg-white p-6 transition hover:border-[#1464d2] hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Health checks
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Monitor endpoint health and availability.
              </p>

              <p className="mt-5 text-sm font-medium text-gray-500">
                Coming soon →
              </p>
            </Link>

            <Link
              href="/profiles"
              className="rounded-lg border border-gray-300 bg-white p-6 transition hover:border-[#1464d2] hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Profiles
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Manage Route 53 profiles.
              </p>

              <p className="mt-5 text-sm font-medium text-gray-500">
                Coming soon →
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}