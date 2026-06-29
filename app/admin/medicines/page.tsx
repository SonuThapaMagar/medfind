"use client";

import Pagination from "@/components/ui/Pagination";
import { Medicine } from "@/types/index.type";
import { Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchMedicines() {
      const response = await fetch("/api/admin/medicines");
      const data = await response.json();
      setMedicines(data);
      setIsLoading(false);
    }
    fetchMedicines();
  }, []);

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Delete this medicine? This also removes it from all inventories.",
      )
    )
      return;

    setDeleting(id);

    const response = await fetch(`/api/admin/medicines/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setMedicines((prev) => prev.filter((m) => m.id !== id));
    }
    setDeleting(null);
  }

  // --- PAGINATION LOGIC ---
  const indexOfLastMedicine = currentPage * itemsPerPage;
  const indexOfFirstMedicine = indexOfLastMedicine - itemsPerPage;
  const currentMedicine = medicines.slice(
    indexOfFirstMedicine,
    indexOfLastMedicine,
  );
  const totalPages = Math.ceil(medicines.length / itemsPerPage);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-medium text-gray-900">
          Medicines ({medicines.length})
        </h1>
        <Link
          href="/admin/medicines/new"
          className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add medicine
          </span>
        </Link>
      </div>

      {/* Medicines table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                S.N
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Medicine
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Category
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Unit
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Stocked by
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {currentMedicine.map((m, index) => {
              const serialNumber = indexOfFirstMedicine + index + 1;

              return (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500">{serialNumber}</p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {m.name}
                    </p>
                    <p className="text-xs text-gray-400">{m.genericName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {m.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{m.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {m._count.inventory} pharmacies
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(m.id)}
                      disabled={deleting === m.id}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />{" "}
                      {deleting === m.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* --- PAGINATION UI CONTROLS --- */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={medicines.length}
          indexOfFirstItem={indexOfFirstMedicine}
          indexOfLastItem={indexOfLastMedicine}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
