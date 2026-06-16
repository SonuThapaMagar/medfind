"use client";

import {
  ArrowDown,
  ChevronRight,
  Hospital,
  Pill,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";

interface AdminStatsCardProps {
  totalPharmacies: number;
  totalMedicines: number;
  totalUsers: number;
}

export default function AdminStatsCard({
  totalPharmacies,
  totalMedicines,
  totalUsers,
}: AdminStatsCardProps) {
  const cards = [
    {
      value: totalPharmacies,
      label: "Total Pharmacies",
      href: "/admin/pharmacies",
      icon: Hospital,
    },
    {
      value: totalMedicines,
      label: "Total Medicines",
      href: "/admin/medicines",
      icon: Pill,
    },
    {
      value: totalUsers,
      label: "Total Users",
      href: "/admin/users",
      icon: Users,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {cards.map(({ value, label, href, icon: Icon }) => (
        <div
          key={label}
          className="flex flex-col gap-2 bg-white p-4 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-shadow duration-200"
        >
          <p className="font-bold text-black text-2xl text-primary">{value}</p>
          <p className="font-regular text-sm font-secondary">{label}</p>
          <Link
            href="/medicines"
            className="flex items-center gap-1 text-primary font-regular text-sm font-secondary"
          >
            View all
            <span>
              <Hospital className="w-4 h-4" />
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
