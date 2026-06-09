"use client";

import { prisma } from "@/lib/prisma";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);

      const response = await fetch(`/api/search?q=${searchTerm}`);
      const data = await response.json();

      setResults(data);
      setIsLoading(false);
    }, 400);

    // If the user types another character before 400ms,
    // React runs this cleanup to CANCEL the previous timer.
    // So only the last timer (after they stop) actually fires.
    return () => clearTimeout(timer);
  }, [searchTerm]); // [searchTerm] means: re-run this effect every time searchTerm changes

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-medium text-green-600 mb-2 tracking-wide">
            KATHMANDU
          </p>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            Find medicines near you
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Search across pharmacies in Kathmandu
          </p>

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400 shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medicine name e.g. Paracetamol..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results area */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Loading state */}
        {isLoading && <p className="text-sm text-gray-400">Searching...</p>}

        {/* Empty state */}
        {!searchTerm && !isLoading && (
          <p className="text-sm text-gray-400">
            Type a medicine name to search
          </p>
        )}

        {/* No results */}
        {searchTerm && !isLoading && results.length === 0 && (
          <p className="text-sm text-gray-400">
            No pharmacies found with "{searchTerm}" in stock
          </p>
        )}

        {/* Results count */}
        {results.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            {results.length}{" "}
            {results.length === 1 ? "pharmacy has" : "pharmacies have"}{" "}
            {results[0]?.medicine?.name} in stock
          </p>
        )}

        {/* Results list */}
        {results.map((item: any) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
          >
            {/* Top row — pharmacy name + open/closed badge */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {item.pharmacy.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.pharmacy.address}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  item.pharmacy.isOpen
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {item.pharmacy.isOpen ? "Open" : "Closed"}
              </span>
            </div>

            {/* Bottom row — price, stock, phone */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400">Price</p>
                <p className="text-sm font-medium text-green-600">
                  NPR {item.price}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">In stock</p>
                <p
                  className={`text-sm font-medium ${
                    item.quantity < 20 ? "text-amber-500" : "text-gray-700"
                  }`}
                >
                  {item.quantity} {item.medicine.unit}s
                  {item.quantity < 20 ? " · low" : ""}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm text-gray-700">{item.pharmacy.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
