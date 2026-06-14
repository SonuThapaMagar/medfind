"use client";

import { InventoryItem, Medicine, Pharmacy } from "@/types/index.type";
import { useEffect, useState } from "react";

interface AddMedicineProps {
  pharmacy: Pharmacy;
  onInventoryChange: (updated: Pharmacy) => void;
}

export default function AddMedicine({
  pharmacy,
  onInventoryChange,
}: AddMedicineProps) {
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);
  const [editQuantity, setEditQuantity] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [addMedicineId, setAddMedicineId] = useState("");
  const [addQuantity, setAddQuantity] = useState("");
  const [addPrice, setAddPrice] = useState("");

  function handleEdit(item: InventoryItem) {
    setEditingId(item.id);
    setEditQuantity(String(item.quantity));
    setEditPrice(String(item.price));
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditQuantity("");
    setEditPrice("");
  }

  async function handleSaveEdit(itemId: string) {
    setSaving(true);
    const response = await fetch(`/api/inventory/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantity: Number(editQuantity),
        price: Number(editPrice),
      }),
    });
    if (response.ok) {
      const updated = await response.json();
      onInventoryChange({
        ...pharmacy,
        inventory: pharmacy.inventory.map((item) =>
          item.id === itemId ? { ...item, ...updated } : item,
        ),
      });
      handleCancelEdit();
    }
    setSaving(false);
  }

  async function handleAddMedicine(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");

    if (!addMedicineId) {
      setAddError("Please select a medicine");
      return;
    }
    if (!addQuantity || Number(addQuantity) < 0) {
      setAddError("Enter a valid quantity");
      return;
    }
    if (!addPrice || Number(addPrice) < 0) {
      setAddError("Enter a valid price");
      return;
    }

    setAdding(true);
    const response = await fetch(`/api/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        medicineId: addMedicineId,
        quantity: Number(addQuantity),
        price: Number(addPrice),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setAddError(data.error);
      setAdding(false);
      return;
    }

    onInventoryChange({
      ...pharmacy,
      inventory: [...pharmacy.inventory, data],
    });

    setAddMedicineId("");
    setAddQuantity("");
    setAddPrice("");
    setAddError("");
    setShowAddForm(false);
    setAdding(false);
  }

  useEffect(() => {
    async function fetchMedicines() {
      const response = await fetch(`/api/medicines`);
      const data = await response.json();
      setAllMedicines(data);
    }
    fetchMedicines();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden text-black">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">
          Inventory ({pharmacy.inventory.length} medicines)
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 cursor-pointer transition-colors"
        >
          {showAddForm ? "Cancel" : "+ Add medicine"}
        </button>
      </div>

      {/* Add medicine form */}
      {showAddForm && (
        <form
          onSubmit={handleAddMedicine}
          className="px-6 py-4 border-b border-gray-100 bg-gray-50"
        >
          <p className="text-xs font-medium text-gray-500 mb-3">
            Add medicine to inventory
          </p>
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Medicine</label>
              <select
                value={addMedicineId}
                onChange={(e) => setAddMedicineId(e.target.value)}
                className="px-3 py-2 text-sm border text-black border-gray-200 rounded-lg outline-none focus:border-green-500 bg-white min-w-48"
              >
                <option value="">Select medicine...</option>
                {allMedicines
                  .filter(
                    (m) =>
                      !pharmacy.inventory.some((i) => i.medicine.id === m.id),
                  )
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.genericName})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Quantity</label>
              <input
                type="number"
                value={addQuantity}
                onChange={(e) => setAddQuantity(e.target.value)}
                placeholder="0"
                min="0"
                className="w-24 text-black px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Price (NPR)</label>
              <input
                type="number"
                value={addPrice}
                onChange={(e) => setAddPrice(e.target.value)}
                placeholder="0"
                min="0"
                className="text-black w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
          {addError && <p className="text-xs text-red-500 mt-2">{addError}</p>}
        </form>
      )}

      {/* Table */}
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
              Medicine
            </th>
            <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
              Category
            </th>
            <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
              Stock
            </th>
            <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
              Price (NPR)
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {pharmacy.inventory.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-10 text-center text-sm text-gray-400"
              >
                No medicines in inventory yet. Click "+ Add medicine" to get
                started.
              </td>
            </tr>
          ) : (
            pharmacy.inventory.map((item) => (
              <tr key={item.id} className="border-t border-gray-100">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {item.medicine.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.medicine.genericName} · {item.medicine.unit}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                    {item.medicine.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500"
                      min="0"
                    />
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        item.quantity === 0
                          ? "text-red-500"
                          : item.quantity < 20
                            ? "text-amber-500"
                            : "text-gray-700"
                      }`}
                    >
                      {item.quantity}
                      {item.quantity === 0 && " · out"}
                      {item.quantity > 0 && item.quantity < 20 && " · low"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500"
                      min="0"
                    />
                  ) : (
                    <span className="text-sm text-gray-700">{item.price}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        disabled={saving}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
