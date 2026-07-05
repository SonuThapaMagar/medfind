"use client";

import { Loader } from "@mantine/core";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPharmacyPage() {
  const router = useRouter();
  //form state
  const [name, setName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

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

    router.push("/admin/medicines");
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/medicines"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to medicines
      </Link>

      <h1 className="text-lg font-medium text-bg-primary mb-6">Add medicine</h1>

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
          className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {adding ? "Adding..." : "Add medicine"}{" "}
          {adding && <Loader size={14} color="white" />}
        </button>
      </form>
    </div>
  );
}
