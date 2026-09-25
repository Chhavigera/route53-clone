"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";

import {
  getHostedZone,
  createDNSRecord,
  HostedZone,
} from "@/lib/api";

const RECORD_TYPES = [
  "A",
  "AAAA",
  "CNAME",
  "TXT",
  "MX",
  "NS",
  "PTR",
  "SRV",
  "CAA",
];

export default function CreateDNSRecordPage() {
  const params = useParams();
  const router = useRouter();

  const zoneId = Number(params.id);

  const [zone, setZone] = useState<HostedZone | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("A");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState("300");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!zoneId) return;

    async function loadHostedZone() {
      try {
        setLoading(true);
        setError("");

        const data = await getHostedZone(zoneId);
        setZone(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load hosted zone."
        );
      } finally {
        setLoading(false);
      }
    }

    loadHostedZone();
  }, [zoneId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedValue = value.trim();
    const parsedTtl = Number(ttl);

    if (!trimmedName) {
      setError("Record name is required.");
      return;
    }

    if (!trimmedValue) {
      setError("Record value is required.");
      return;
    }

    if (!Number.isInteger(parsedTtl) || parsedTtl <= 0) {
      setError("TTL must be a positive whole number.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createDNSRecord({
        hosted_zone_id: zoneId,
        name: trimmedName,
        type,
        value: trimmedValue,
        ttl: parsedTtl,
      });

      router.push(`/hosted-zones/${zoneId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create DNS record."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fa]">
        <AppHeader />

        <div className="flex">
          <Sidebar />

          <section className="flex flex-1 items-center justify-center p-8">
            <div className="rounded-lg border border-gray-300 bg-white px-8 py-6">
              <p className="text-sm text-gray-700">
                Loading hosted zone...
              </p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (!zone) {
    return (
      <main className="min-h-screen bg-[#f7f8fa]">
        <AppHeader />

        <div className="flex">
          <Sidebar />

          <section className="flex-1 p-8">
            <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-8">
              <p className="text-sm font-medium text-red-700">
                {error || "Hosted zone not found."}
              </p>

              <Link
                href="/hosted-zones"
                className="mt-4 inline-block text-sm font-medium text-[#1464d2] hover:underline"
              >
                Return to hosted zones
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <AppHeader />

      <div className="flex">
        <Sidebar />

        <section className="flex-1 p-8">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <Link
              href={`/hosted-zones/${zoneId}`}
              className="text-sm font-medium text-[#1464d2] hover:underline"
            >
              ← {zone.name}
            </Link>

            {/* Heading */}
            <div className="mt-5">
              <h1 className="text-2xl font-semibold text-gray-900">
                Create record
              </h1>

              <p className="mt-2 text-sm text-gray-700">
                Create a DNS record in the {zone.name} hosted zone.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4">
                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="rounded-lg border border-gray-300 bg-white">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-5">
                  <h2 className="text-base font-semibold text-gray-900">
                    Record details
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Enter the DNS record information below.
                  </p>
                </div>

                <div className="space-y-6 px-6 py-6">
                  {/* Record name */}
                  <div>
                    <label
                      htmlFor="record-name"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Record name
                    </label>

                    <p className="mt-1 text-xs text-gray-600">
                      Enter the domain or subdomain for this record.
                    </p>

                    <input
                      id="record-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={`www.${zone.name}`}
                      disabled={saving}
                      className="mt-3 w-full max-w-2xl rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2] disabled:bg-gray-100"
                    />
                  </div>

                  {/* Record type */}
                  <div>
                    <label
                      htmlFor="record-type"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Record type
                    </label>

                    <p className="mt-1 text-xs text-gray-600">
                      Select the type of DNS record you want to create.
                    </p>

                    <select
                      id="record-type"
                      value={type}
                      onChange={(event) => setType(event.target.value)}
                      disabled={saving}
                      className="mt-3 w-full max-w-2xl rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2] disabled:bg-gray-100"
                    >
                      {RECORD_TYPES.map((recordType) => (
                        <option key={recordType} value={recordType}>
                          {recordType}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Value */}
                  <div>
                    <label
                      htmlFor="record-value"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Value
                    </label>

                    <p className="mt-1 text-xs text-gray-600">
                      Enter the value for this DNS record.
                    </p>

                    <textarea
                      id="record-value"
                      value={value}
                      onChange={(event) => setValue(event.target.value)}
                      placeholder="Enter record value"
                      rows={4}
                      disabled={saving}
                      className="mt-3 w-full max-w-2xl resize-none rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2] disabled:bg-gray-100"
                    />
                  </div>

                  {/* TTL */}
                  <div>
                    <label
                      htmlFor="record-ttl"
                      className="block text-sm font-medium text-gray-900"
                    >
                      TTL
                    </label>

                    <p className="mt-1 text-xs text-gray-600">
                      Time to live in seconds. The default is 300 seconds.
                    </p>

                    <input
                      id="record-ttl"
                      type="number"
                      min="1"
                      step="1"
                      value={ttl}
                      onChange={(event) => setTtl(event.target.value)}
                      disabled={saving}
                      className="mt-3 w-full max-w-2xl rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2] disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <Link
                    href={`/hosted-zones/${zoneId}`}
                    className={`rounded-md border border-gray-400 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-100 ${
                      saving
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-[#1464d2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f54b5] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Creating..." : "Create record"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}