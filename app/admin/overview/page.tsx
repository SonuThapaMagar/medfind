"use client";

import AdminStatsCard from "@/components/ui/admin/AdminStats";
import { useEffect, useState } from "react";

interface AdminStats {
  totalPharmacies: number;
  totalMedicines: number;
  totalUsers: number;
}

export default function AdminOverviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    async function fetchAdmin() {
      const response = await fetch("/api/admin");

      if (!response.ok) {
        setError("Failed to load admin data");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setStats(data);
      setIsLoading(false);
    }
    fetchAdmin();
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

    if (!stats) return null;

  return (
    <>
      <div>
        {/*Stats */}
        <AdminStatsCard
          totalPharmacies={stats.totalPharmacies}
          totalMedicines={stats.totalMedicines}
          totalUsers={stats.totalUsers}
        />
      </div>
    </>
  );
}
