"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";

import {
  getHostedZones,
  deleteHostedZone,
  HostedZone,
} from "@/lib/api";

const ITEMS_PER_PAGE = 5;

export default function HostedZonesPage() {
  const [hostedZones, setHostedZones] = useState<HostedZone[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState<HostedZone | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadHostedZones() {
      try {
        setLoading(true);
        setError("");

        const data = await getHostedZones();
        setHostedZones(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load hosted zones."
        );
      } finally {
        setLoading(false);
      }
    }

    loadHostedZones();
  }, []);

  const filteredHostedZones = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return hostedZones.filter((zone) => {
      const matchesSearch =
        !searchValue ||
        zone.name.toLowerCase().includes(searchValue) ||
        zone.type.toLowerCase().includes(searchValue) ||
        (zone.description || "").toLowerCase().includes(searchValue);

      const matchesType =
        typeFilter === "All" || zone.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [hostedZones, search, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredHostedZones.length / ITEMS_PER_PAGE)
  );

  const paginatedHostedZones = filteredHostedZones.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function openDeleteModal(zone: HostedZone) {
    setZoneToDelete(zone);
    setDeleteModalOpen(true);
    setError("");
    setSuccess("");
  }

  function closeDeleteModal() {
    if (deleting) return;

    setDeleteModalOpen(false);
    setZoneToDelete(null);
  }

  async function confirmDeleteZone() {
    if (!zoneToDelete) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await deleteHostedZone(zoneToDelete.id);

      setHostedZones((currentZones) =>
        currentZones.filter((zone) => zone.id !== zoneToDelete.id)
      );

      setDeleteModalOpen(false);
      setZoneToDelete(null);

      setSuccess(
        `Hosted zone "${zoneToDelete.name}" was deleted successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete hosted zone."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <AppHeader />

      <div className="flex">
        <Sidebar />

        <section className="flex-1 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Hosted zones
              </h1>

              <p className="mt-2 text-sm text-gray-700">
                Manage your hosted zones and DNS configuration.
              </p>
            </div>

            <Link
              href="/hosted-zones/new"
              className="rounded-md bg-[#1464d2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f54b5]"
            >
              Create hosted zone
            </Link>
          </div>

          {/* Search + Filter */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search hosted zones"
              className="w-full max-w-md rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-600 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2]"
            />

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2]"
            >
              <option value="All">All types</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-6 py-4">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-6 py-4">
              <p className="text-sm font-medium text-green-700">
                {success}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="mt-6 rounded-lg border border-gray-300 bg-white px-6 py-16 text-center">
              <p className="text-sm text-gray-600">
                Loading hosted zones...
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && (
            <div className="mt-6 overflow-hidden rounded-lg border border-gray-300 bg-white">
              <table className="w-full text-left">
                <thead className="border-b border-gray-300 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-800">
                      Name
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-800">
                      Type
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-800">
                      Description
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-800">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedHostedZones.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-16 text-center"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {search.trim() || typeFilter !== "All"
                            ? "No matching hosted zones found"
                            : "No hosted zones found"}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {search.trim() || typeFilter !== "All"
                            ? "Try changing your search or filter."
                            : "Create a hosted zone to get started."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedHostedZones.map((zone) => (
                      <tr
                        key={zone.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm">
                          <Link
                            href={`/hosted-zones/${zone.id}`}
                            className="font-medium text-[#1464d2] hover:underline"
                          >
                            {zone.name}
                          </Link>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-800">
                          {zone.type}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-800">
                          {zone.description || "—"}
                        </td>

                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-4">
                            <Link
                              href={`/hosted-zones/${zone.id}/edit`}
                              className="font-medium text-[#1464d2] hover:underline"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() => openDeleteModal(zone)}
                              className="font-medium text-red-600 hover:text-red-700 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {filteredHostedZones.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredHostedZones.length
                    )}{" "}
                    of {filteredHostedZones.length}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      disabled={currentPage === 1}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="px-2 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && zoneToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Delete hosted zone
              </h2>
            </div>

            <div className="px-6 py-6">
              <p className="text-sm leading-6 text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {zoneToDelete.name}
                </span>
                ?
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                All DNS records associated with this hosted zone
                will also be deleted.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteZone}
                disabled={deleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete hosted zone"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}