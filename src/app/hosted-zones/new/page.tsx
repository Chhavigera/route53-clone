"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";

import { createHostedZone } from "@/lib/api";

export default function CreateHostedZonePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState("Public");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Hosted zone name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createHostedZone({
        name: trimmedName,
        type,
        description: trimmedDescription || undefined,
      });

      router.push("/hosted-zones");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create hosted zone."
      );
    } finally {
      setLoading(false);
    }
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
              href="/hosted-zones"
              className="text-sm font-medium text-[#1464d2] hover:underline"
            >
              ← Hosted zones
            </Link>

            {/* Page heading */}
            <div className="mt-5">
              <h1 className="text-2xl font-semibold text-gray-900">
                Create hosted zone
              </h1>

              <p className="mt-2 text-sm text-gray-700">
                Create a hosted zone to manage DNS records for your domain.
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
                {/* Form header */}
                <div className="border-b border-gray-200 px-6 py-5">
                  <h2 className="text-base font-semibold text-gray-900">
                    Hosted zone details
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Enter the basic information for your hosted zone.
                  </p>
                </div>

                {/* Form fields */}
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
                      Enter the domain name for this hosted zone.
                    </p>

                    <input
                      id="zone-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="example.com"
                      disabled={loading}
                      className="mt-3 w-full max-w-2xl rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2] disabled:bg-gray-100"
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
                      disabled={loading}
                      className="mt-3 w-full max-w-2xl rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2] disabled:bg-gray-100"
                    >
                      <option value="Public">Public hosted zone</option>
                      <option value="Private">Private hosted zone</option>
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
                      placeholder="Enter a description"
                      rows={4}
                      disabled={loading}
                      className="mt-3 w-full max-w-2xl resize-none rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2] disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <Link
                    href="/hosted-zones"
                    className={`rounded-md border border-gray-400 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-100 ${
                      loading ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-[#1464d2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f54b5] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Creating..." : "Create hosted zone"}
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