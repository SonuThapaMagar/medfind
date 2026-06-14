"use client";

import PharmacyProfile from "@/components/ui/PharmacyOwner/PharmacyProfile";
import { Pharmacy } from "@/types/index.type";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  return <PharmacyProfile pharmacy={pharmacy} onPharmacyChange={setPharmacy} />;
}
