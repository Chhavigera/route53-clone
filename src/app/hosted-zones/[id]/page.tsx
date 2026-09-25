"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";

import {
  getHostedZone,
  getDNSRecords,
  deleteDNSRecord,
  HostedZone,
  DNSRecord,
} from "@/lib/api";

const ITEMS_PER_PAGE = 8;

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

export default function HostedZoneDetailsPage() {
  const params = useParams();
  const zoneId = Number(params.id);

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [records, setRecords] = useState<DNSRecord[]>([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] =
    useState<DNSRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!zoneId) return;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [zoneData, recordsData] = await Promise.all([
          getHostedZone(zoneId),
          getDNSRecords(zoneId),
        ]);

        setZone(zoneData);
        setRecords(recordsData);
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

    loadData();
  }, [zoneId]);

  const filteredRecords = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !searchValue ||
        record.name.toLowerCase().includes(searchValue) ||
        record.type.toLowerCase().includes(searchValue) ||
        record.value.toLowerCase().includes(searchValue) ||
        String(record.ttl).includes(searchValue);

      const matchesType =
        typeFilter === "All" || record.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [records, search, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / ITEMS_PER_PAGE)
  );

  const paginatedRecords = filteredRecords.slice(
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

  function openDeleteModal(record: DNSRecord) {
    setRecordToDelete(record);
    setDeleteModalOpen(true);
    setError("");
    setSuccess("");
  }

  function closeDeleteModal() {
    if (deleting) return;

    setDeleteModalOpen(false);
    setRecordToDelete(null);
  }

  async function confirmDeleteRecord() {
    if (!recordToDelete) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await deleteDNSRecord(recordToDelete.id);

      setRecords((currentRecords) =>
        currentRecords.filter(
          (record) => record.id !== recordToDelete.id
        )
      );

      setDeleteModalOpen(false);
      setRecordToDelete(null);

      setSuccess(
        `DNS record "${recordToDelete.name}" was deleted successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete DNS record."
      );
    } finally {
      setDeleting(false);
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

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <AppHeader />

      <div className="flex">
        <Sidebar />

        <section className="flex-1 p-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/hosted-zones"
                className="text-sm font-medium text-[#1464d2] hover:underline"
              >
                ← Hosted zones
              </Link>

              <h1 className="mt-3 text-2xl font-semibold text-gray-900">
                {zone?.name}
              </h1>

              <p className="mt-2 text-sm text-gray-700">
                {zone?.description ||
                  "DNS records for this hosted zone."}
              </p>
            </div>

            <Link
              href={`/hosted-zones/${zoneId}/records/new`}
              className="rounded-md bg-[#1464d2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f54b5]"
            >
              Create record
            </Link>
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

          {/* Search + Filter */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search DNS records"
              className="w-full max-w-md rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-600 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2]"
            />

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1464d2] focus:ring-1 focus:ring-[#1464d2]"
            >
              <option value="All">All record types</option>

              {RECORD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Records table */}
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
                    Value
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-800">
                    TTL
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-800">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {search.trim() || typeFilter !== "All"
                          ? "No matching DNS records found"
                          : "No DNS records found"}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {search.trim() || typeFilter !== "All"
                          ? "Try changing your search or filter."
                          : "Create a DNS record to get started."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {record.name}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {record.type}
                      </td>

                      <td className="max-w-md break-all px-6 py-4 text-sm text-gray-800">
                        {record.value}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-800">
                        {record.ttl}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/hosted-zones/${zoneId}/records/${record.id}/edit`}
                            className="font-medium text-[#1464d2] hover:underline"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(record)}
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
            {filteredRecords.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredRecords.length
                  )}{" "}
                  of {filteredRecords.length}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1)
                      )
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
        </section>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Delete DNS record
              </h2>
            </div>

            <div className="px-6 py-6">
              <p className="text-sm leading-6 text-gray-700">
                Are you sure you want to delete this{" "}
                <span className="font-semibold text-gray-900">
                  {recordToDelete.type}
                </span>{" "}
                record?
              </p>

              <div className="mt-4 rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-800">
                  <span className="font-medium">Name:</span>{" "}
                  {recordToDelete.name}
                </p>

                <p className="mt-2 break-all text-sm text-gray-800">
                  <span className="font-medium">Value:</span>{" "}
                  {recordToDelete.value}
                </p>
              </div>
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
                onClick={confirmDeleteRecord}
                disabled={deleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}