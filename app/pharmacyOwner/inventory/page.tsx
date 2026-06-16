"use client";

import { Pharmacy } from "@/types/index.type";
import { Badge } from "@mantine/core";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InventoryPage() {
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPharmacy() {
      const response = await fetch("/api/inventory");
      if (!response.ok) {
        setError("Failed to load pharmacy data");
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      setPharmacy(data);
      setIsLoading(false);
    }
    fetchPharmacy();
  }, []);

  async function handleDelete(itemId: string) {
    if (!confirm("Remove this medicine from your inventory?")) return;
    setDeletingId(itemId);

    const response = await fetch(`/api/inventory/${itemId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setPharmacy((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          inventory: prev.inventory.filter((i) => i.id !== itemId),
        };
      });
    }
    setDeletingId(null);
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );

  if (!pharmacy) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden text-black">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-dark">Inventory</h1>
          <p className="text-sm text-muted mt-0.5">
            {pharmacy.inventory.length} medicines stocked
          </p>
        </div>
        <Link
          href="/dashboard/inventory/add"
          className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          + Add medicine
        </Link>
      </div>

      {/* Table */}
      <div className="bg-card-bg border border-light-gray rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs text-muted font-medium px-6 py-3">
                  Medicine
                </th>
                <th className="text-left text-xs text-muted font-medium px-6 py-3">
                  Category
                </th>
                <th className="text-left text-xs text-muted font-medium px-6 py-3">
                  Stock
                </th>
                <th className="text-left text-xs text-muted font-medium px-6 py-3">
                  Price (NPR)
                </th>
                <th className="text-left text-xs text-muted font-medium px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pharmacy.inventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-sm text-muted mb-3">
                      No medicines in inventory yet
                    </p>
                    <Link
                      href="/dashboard/inventory/add"
                      className="text-sm text-secondary hover:underline"
                    >
                      Add your first medicine →
                    </Link>
                  </td>
                </tr>
              ) : (
                pharmacy.inventory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-light-gray hover:bg-bg transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-text-dark">
                        {item.medicine.name}
                      </p>
                      <p className="text-xs text-muted">
                        {item.medicine.genericName} · {item.medicine.unit}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge size="sm" radius="xl" variant="light" color="blue">
                        {item.medicine.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          item.quantity === 0
                            ? "text-soft-danger"
                            : item.quantity < 20
                              ? "text-amber-500"
                              : "text-text-dark"
                        }`}
                      >
                        {item.quantity}
                        {item.quantity === 0 && " · out of stock"}
                        {item.quantity > 0 && item.quantity < 20 && " · low"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-dark">
                      NPR {item.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Edit → goes to edit page */}
                        <button
                          onClick={() =>
                            router.push(`/dashboard/inventory/edit/${item.id}`)
                          }
                          className="text-xs text-secondary hover:underline cursor-pointer"
                        >
                          <span className="flex text-xs gap-1">
                            <Pencil className="w-4 h-4" />
                            Edit
                          </span>
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-xs text-soft-danger hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          <span className="flex text-xs gap-1">
                            <Trash className="w-4 h-4" />{" "}
                            {deletingId === item.id ? "Removing..." : "Delete"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
