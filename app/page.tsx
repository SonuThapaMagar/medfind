"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Container, Text, Title } from "@mantine/core";

const PharmacyMap = dynamic(() => import("@/components/PharmacyMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: "400px" }}
      className="w-full rounded-xl border border-light-gray bg-bg animate-pulse"
    />
  ),
});

type Medicine = {
  id: string;
  name: string;
  genericName: string;
  unit: string;
};

type Pharmacy = {
  id: string;
  name: string;
  address: string;
  phone: string;
  isOpen: boolean;
  lat: number;
  lng: number;
};

type SearchResult = {
  id: string;
  price: number;
  quantity: number;
  medicine: Medicine;
  pharmacy: Pharmacy;
};

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("All");

  // Fetch categories once on mount — separate from search effect
  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(["All", ...data]);
    }
    fetchCategories();
  }, []);

  // Search effect — runs when searchTerm or category changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const categoryParam =
        category !== "All" ? `&category=${encodeURIComponent(category)}` : "";
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchTerm)}${categoryParam}`,
      );
      const data = await response.json();
      setResults(data);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, category]);

  return (
    <Container size="md" mt="xl">
      <Title order={1}>Welcome to Mantine!</Title>
      <Text c="dimmed" mb="md">
        If you can see this styled nicely, the installation worked.
      </Text>

      <Button variant="filled" color="blue">
        Click Me
      </Button>

      <main className="min-h-screen bg-bg">
        {/* Hero + Search */}
        <div className="bg-card-bg border-b border-light-gray px-4 py-10">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-secondary mb-2 tracking-widest uppercase">
              Kathmandu
            </p>
            <h1 className="text-2xl font-bold text-primary mb-1">
              Find medicines near you
            </h1>
            <p className="text-sm text-muted mb-6">
              Search across pharmacies in Kathmandu
            </p>

            {/* Search input */}
            <div className="flex items-center gap-2 bg-bg border border-light-gray rounded-lg px-3 py-2 focus-within:border-secondary transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search medicine name e.g. Paracetamol..."
                className="flex-1 bg-transparent outline-none text-sm text-text-dark placeholder:text-muted"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="text-muted hover:text-text-dark transition-colors cursor-pointer"
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

            {/* Category chips */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {categories.length === 0
                ? [1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-7 w-20 bg-card-label rounded-full animate-pulse"
                    />
                  ))
                : categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                        category === cat
                          ? "bg-primary text-white border-primary"
                          : "bg-card-bg text-muted border-light-gray hover:border-secondary hover:text-secondary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
            </div>
          </div>
        </div>

        {/* Results area */}
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Skeleton loaders */}
          {isLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card-bg border border-light-gray rounded-xl p-4"
                >
                  <div className="flex justify-between mb-3">
                    <div className="flex flex-col gap-2">
                      <div className="h-3.5 w-36 bg-card-label rounded animate-pulse" />
                      <div className="h-3 w-24 bg-card-label rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-12 bg-card-label rounded-full animate-pulse" />
                  </div>
                  <div className="flex gap-4 pt-3 border-t border-light-gray">
                    <div className="h-3 w-16 bg-card-label rounded animate-pulse" />
                    <div className="h-3 w-16 bg-card-label rounded animate-pulse" />
                    <div className="h-3 w-20 bg-card-label rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!searchTerm && !isLoading && (
            <div className="text-center py-16">
              <p className="text-muted text-sm">
                Type a medicine name to search
              </p>
            </div>
          )}

          {/* No results */}
          {searchTerm && !isLoading && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted text-sm">
                No pharmacies found with "{searchTerm}" in stock
              </p>
            </div>
          )}

          {/* Results count */}
          {results.length > 0 && (
            <p className="text-sm text-muted mb-4">
              {results.length}{" "}
              {results.length === 1 ? "pharmacy has" : "pharmacies have"}{" "}
              <span className="font-medium text-text-dark">
                {results[0]?.medicine?.name}
              </span>{" "}
              in stock
            </p>
          )}

          {/* Map */}
          {results.length > 0 && (
            <div className="mb-6">
              <PharmacyMap results={results} />
            </div>
          )}

          {/* Result cards */}
          {results.map((item) => (
            <Link
              key={item.id}
              href={`/pharmacies/${item.pharmacy.id}`}
              className="block bg-card-bg border border-light-gray rounded-xl p-4 mb-3 hover:border-secondary hover:shadow-sm transition-all cursor-pointer"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-text-dark text-sm">
                    {item.pharmacy.name}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {item.pharmacy.address}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.pharmacy.isOpen
                      ? "bg-green-50 text-success"
                      : "bg-card-label text-muted"
                  }`}
                >
                  {item.pharmacy.isOpen ? "Open" : "Closed"}
                </span>
              </div>

              {/* Bottom row */}
              <div className="flex items-center gap-6 pt-3 border-t border-light-gray">
                <div>
                  <p className="text-[10px] text-muted">Price</p>
                  <p className="text-sm font-semibold text-primary">
                    NPR {item.price}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted">In stock</p>
                  <p
                    className={`text-sm font-medium ${
                      item.quantity < 20 ? "text-soft-danger" : "text-text-dark"
                    }`}
                  >
                    {item.quantity} {item.medicine.unit}s
                    {item.quantity < 20 ? " · low" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted">Phone</p>
                  <p className="text-sm text-text-dark">
                    {item.pharmacy.phone}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </Container>
  );
}
