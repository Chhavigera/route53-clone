"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";

import {
  getHostedZone,
  updateHostedZone,
  HostedZone,
} from "@/lib/api";

export default function EditHostedZonePage() {
  const params = useParams();
  const router = useRouter();

  const zoneId = Number(params.id);

  const [zone, setZone] = useState<HostedZone | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("Public");
  const [description, setDescription] = useState("");

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
        setName(data.name);
        setType(data.type);
        setDescription(data.description || "");
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
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Hosted zone name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateHostedZone(zoneId, {
        name: trimmedName,
        type,
        description: trimmedDescription || undefined,
      });

      router.push(`/hosted-zones/${zoneId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update hosted zone."
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
              ← Hosted zone
            </Link>

            {/* Heading */}
            <div className="mt-5">
              <h1 className="text-2xl font-semibold text-gray-900">
                Edit hosted zone
              </h1>

              <p className="mt-2 text-sm text-gray-700">
                Update the configuration for this hosted zone.
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
                <div className="border-b border-gray-200 px-6 py-5">
                  <h2 className="text-base font-semibold text-gray-900">
                    Hosted zone details
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Modify the information below and save your changes.
                  </p>
                </div>

                <div className="space-y-6 px-6 py-6">
                  {/* Domain name */}
                  <div>
                    <label
                      htmlFor="zone-name"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Domain name
                    </label>

                    <p className="mt-1 text-xs text-gray-600">
                      The domain name associated with this hosted zone.
                    </p>

                    <input
                      id="zone-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      disabled={saving}
                      className="mt-3 w-full max-w-2xl rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2] disabled:bg-gray-100"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label
                      htmlFor="zone-type"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Hosted zone type
                    </label>

                    <p className="mt-1 text-xs text-gray-600">
                      Choose whether this is a public or private hosted zone.
                    </p>

                    <select
                      id="zone-type"
                      value={type}
                      onChange={(event) => setType(event.target.value)}
                      disabled={saving}
                      className="mt-3 w-full max-w-2xl rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2] disabled:bg-gray-100"
                    >
                      <option value="Public">
                        Public hosted zone
                      </option>

                      <option value="Private">
                        Private hosted zone
                      </option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="zone-description"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Description
                    </label>

                    <p className="mt-1 text-xs text-gray-600">
                      Optional description for this hosted zone.
                    </p>

                    <textarea
                      id="zone-description"
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      rows={4}
                      disabled={saving}
                      className="mt-3 w-full max-w-2xl resize-none rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2] disabled:bg-gray-100"
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
                    {saving ? "Saving..." : "Save changes"}
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