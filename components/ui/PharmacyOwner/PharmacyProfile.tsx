"use client";

import { Pharmacy } from "@/types/index.type";
import { useState } from "react";

interface PharmacyProfileProps {
  pharmacy: Pharmacy;
  onPharmacyChange: (updated: Pharmacy) => void;
}

export default function PharmacyProfile({
  pharmacy,
  onPharmacyChange,
}: PharmacyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(pharmacy.name);
  const [email, setEmail] = useState(pharmacy.email);
  const [address, setAddress] = useState(pharmacy.address);
  const [phone, setPhone] = useState(pharmacy.phone ?? "");

  async function handleSave() {
    setSaving(true);
    setError("");
    const response = await fetch("/api/pharmacy/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, address, phone }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Failed to save");
      setSaving(false);
      return;
    }
    const updated = await response.json();
    onPharmacyChange({ ...pharmacy, ...updated });
    setIsEditing(false);
    setSaving(false);
  }

  function handleCancel() {
    setName(pharmacy.name);
    setEmail(pharmacy.email);
    setAddress(pharmacy.address);
    setPhone(pharmacy.phone ?? "");
    setIsEditing(false);
    setError("");
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden text-black">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between min-h-[60px]">
        <h2 className="text-lg font-bold text-gray-900">Pharmacy Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm bg-primary cursor-pointer text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-sm bg-success text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="px-6 py-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <div className="relative group w-24 h-24 rounded-full overflow-hidden border border-gray-200 cursor-pointer mb-2">
            {/* The Image */}
            <img
              src="../logo.png"
              alt="Pharmacy Logo"
              className="h-full w-full object-cover"
            />

            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  onChange={(e) => console.log(e.target.files?.[0])}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] z-10">
                  Change
                </div>
              </>
            )}
          </div>

          <label className="text-xs text-gray-500">Pharmacy Name</label>
          {isEditing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500"
            />
          ) : (
            <p className="text-sm text-gray-900">{pharmacy.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Email</label>
          {isEditing ? (
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500"
            />
          ) : (
            <p className="text-sm text-gray-900">{pharmacy.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Address</label>
          {isEditing ? (
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500"
            />
          ) : (
            <p className="text-sm text-gray-900">{pharmacy.address}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Phone</label>
          {isEditing ? (
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500"
            />
          ) : (
            <p className="text-sm text-gray-900">{pharmacy.phone ?? "—"}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Status</label>
          <span
            className={`text-sm font-medium ${pharmacy.isOpen ? "text-green-600" : "text-red-500"}`}
          >
            {pharmacy.isOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>

      {error && <p className="px-6 pb-4 text-xs text-red-500">{error}</p>}
    </div>
  );
}
