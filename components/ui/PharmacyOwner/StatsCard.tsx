"use client";

import { ArrowDown, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

export default function StatsCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div className="flex flex-col gap-2 bg-white p-4 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-shadow duration-200">
        <p className="font-bold text-black text-2xl text-primary">12</p>
        <p className="font-regular text-sm font-secondary">Medicines stock</p>
        <Link
          href="/medicines"
          className="flex items-center gap-1 text-primary font-regular text-sm font-secondary"
        >
          View all
          <span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-2 bg-white p-4 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-shadow duration-200">
        <p className="font-bold text-black text-2xl text-primary">3</p>
        <p className="font-regular text-sm font-secondary">Low stock</p>
        <Link
          href="/medicines"
          className="flex items-center gap-1 text-primary font-regular text-sm font-secondary"
        >
          Restock Soon
          <span>
            <ArrowDown className="w-4 h-4" />
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-2 bg-white p-4 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-shadow duration-200">
        <p className="font-bold text-black text-2xl text-primary">1</p>
        <p className="font-regular text-sm font-secondary">Out of stock</p>
        <Link
          href="/medicines"
          className="flex items-center gap-1 text-primary font-regular text-sm font-secondary"
        >
          Add Now
          <span>
            <Plus className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
