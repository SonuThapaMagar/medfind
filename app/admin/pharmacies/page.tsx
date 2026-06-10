"use client";

import { useEffect, useState } from "react";

type Pharmacy = {
  id: string;
  name: string;
  address: string;
  isOpen: boolean;
  phone: string;
  _count: { inventory: number };
  owner: {
    user: { name: string; email: string };
  } | null;
};

export default function AdminPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPharmacies() {
      const response = await fetch("/api/admin/pharmacies");
      const data = await response.json();
      setPharmacies(data);
      setIsLoading(false);
    }
    fetchPharmacies();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );

  return (
    <div>
      <h1 className="text-lg font-medium text-gray-900 mb-6">
        Pharmacies ({pharmacies.length})
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
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
            </tr>
          </thead>
          <tbody>
            {pharmacies.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
