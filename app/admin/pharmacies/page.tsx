"use client";

import Pagination from "@/components/ui/Pagination";
import { Pharmacy } from "@/types/index.type";
import { Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    async function fetchPharmacies() {
      const response = await fetch("/api/admin/pharmacies");
      const data = await response.json();
      setPharmacies(data);
      setIsLoading(false);
    }
    fetchPharmacies();
  }, []);

  // --- PAGINATION LOGIC ---
  const indexOfLastPharmacy = currentPage * itemsPerPage;
  const indexOfFirstPharmacy = indexOfLastPharmacy - itemsPerPage;
  const currentPharmacy = pharmacies.slice(
    indexOfFirstPharmacy,
    indexOfLastPharmacy,
  );
  const totalPages = Math.ceil(pharmacies.length / itemsPerPage);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden text-black">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-dark">Pharmacies</h2>
        <Link
          href="/dashboard/inventory/add"
          className="text-sm bg-primary text-white px-2 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <span className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Create Pharmacy
          </span>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                S.N
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Pharmacy
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Owner
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Medicines
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Status
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Phone
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPharmacy.map((p, index) => {
              const serialNumber = indexOfFirstPharmacy + index + 1;
              return (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500">{serialNumber}</p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-400">{p.address}</p>
                  </td>
                  <td className="px-6 py-4">
                    {p.owner ? (
                      <div>
                        <p className="text-sm text-gray-700">
                          {p.owner.user.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {p.owner.user.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No owner</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {p._count.inventory}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.isOpen
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {p.isOpen ? "Open" : "Closed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="flex gap-4">
                      <button className="text-primary hover:text-primar/90 font-medium cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="text-danger hover:text-danger/90 font-medium cursor-pointer">
                        <Trash className="w-4 h-4" />
                      </button>
                    </span>
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
          totalItems={pharmacies.length}
          indexOfFirstItem={indexOfFirstPharmacy}
          indexOfLastItem={indexOfLastPharmacy}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
