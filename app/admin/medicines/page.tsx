"use client";

import Pagination from "@/components/ui/Pagination";
import { Medicine } from "@/types/index.type";
import { useEffect, useState } from "react";

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  //form state
  const [name, setName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

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

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");

    if (!name || !genericName || !category || !unit) {
      setAddError("All fields except description are required");
      return;
    }

    setAdding(true);

    const response = await fetch("/api/admin/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, genericName, category, unit, description }),
    });

    const data = await response.json();

    if (!response.ok) {
      setAddError(data.error);
      setAdding(false);
      return;
    }
    // Add to list with _count defaulting to 0
    setMedicines((prev) => [...prev, { ...data, _count: { inventory: 0 } }]);

    // Reset form
    setName("");
    setGenericName("");
    setCategory("");
    setUnit("");
    setDescription("");
    setShowForm(false);
    setAdding(false);
  }

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
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add medicine"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-gray-200 rounded-xl p-6 mb-6"
        >
          <p className="text-sm font-medium text-gray-900 mb-4">New medicine</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Brand name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Panadol"
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Generic name</label>
              <input
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                placeholder="Paracetamol"
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white"
              >
                <option value="">Select category...</option>
                <option>Painkiller</option>
                <option>Antibiotic</option>
                <option>Antidiabetic</option>
                <option>Antifungal</option>
                <option>Antihistamine</option>
                <option>Vitamin</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white"
              >
                <option value="">Select unit...</option>
                <option>tablet</option>
                <option>capsule</option>
                <option>syrup</option>
                <option>injection</option>
                <option>cream</option>
                <option>drops</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs text-gray-500">
              Description (optional)
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
            />
          </div>

          {addError && <p className="text-xs text-red-500 mb-3">{addError}</p>}

          <button
            type="submit"
            disabled={adding}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {adding ? "Adding..." : "Add medicine"}
          </button>
        </form>
      )}

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
                      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
                    >
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
