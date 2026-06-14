"use client";

import DashboardMetrics from "@/components/ui/PharmacyOwner/DashboardMetrics";
import PharmacyHeader from "@/components/ui/PharmacyOwner/PharmacyHeader";
import StatsCard from "@/components/ui/PharmacyOwner/StatsCard";
import StockChart from "@/components/ui/PharmacyOwner/StockChart";
import { Pharmacy } from "@/types/index.type";
import { useEffect, useState } from "react";

export default function OverviewPage() {
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
      console.log("Pharmacy data", data);
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

  return (
    <>
      <div>
        {/* Pharmacy header */}
        <PharmacyHeader initialPharmacy={pharmacy} />

        {/*Stats */}
        <StatsCard />

        {/* Dashboard Metrics*/}
        <DashboardMetrics />

        {/* Stock Chart Metrics*/}
        <StockChart inventory={pharmacy.inventory} />
      </div>
    </>
  );
}
