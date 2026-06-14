"use client";

import { Pharmacy } from "@/types/index.type";
import { useState } from "react";

interface PharmacyHeaderProps {
  initialPharmacy: Pharmacy;
}

export default function PharmacyHeader({
  initialPharmacy,
}: PharmacyHeaderProps) {
  const [pharmacy, setPharmacy] = useState<Pharmacy>(initialPharmacy);
  const [toggling, setToggling] = useState(false);

  async function handleToggle() {
    setToggling(true);

    const response = await fetch(`/api/pharmacies/${pharmacy.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOpen: !pharmacy.isOpen }),
    });

    if (response.ok) {
      const updated = await response.json();
      setPharmacy((prev) =>
        prev ? { ...prev, isOpen: updated.isOpen } : prev,
      );
    }
    setToggling(false);
  }
  if (!pharmacy) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 text-primary">
            {pharmacy.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{pharmacy.address}</p>
          <p className="text-sm text-gray-400 mt-0.5">{pharmacy.phone}</p>
        </div>

        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`w-11 h-6 rounded-full relative transition-colors ${
            toggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${pharmacy.isOpen ? "bg-primary" : "bg-gray-300"}`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
              pharmacy.isOpen ? "right-1" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
