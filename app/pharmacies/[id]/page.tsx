"use client"
import { InventoryItem, PharmacyDetail } from "@/types/index.type";
import { Badge, Loader, Paper, Table, Text, Title } from "@mantine/core";
import { Pharmacy } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PharmacyDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [pharmacy, setPharmacy] = useState<PharmacyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPharmacy() {
      const response = await fetch(`/api/pharmacies/${params.id}`);
      if (!response.ok) {
        setError("Pharmacy not found");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setPharmacy(data);
      setIsLoading(false);
    }
    fetchPharmacy();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader color="blue" size="sm" />
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <Text c="dimmed" mb="md">
            {error || "Pharmacy not found"}
          </Text>
          <Link href="/" className="text-secondary hover:underline text-sm">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted hover:text-text-dark text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to results
        </button>

        {/* Pharmacy header card */}
        <Paper
          p="lg"
          radius="md"
          withBorder
          mb="lg"
          style={{ borderColor: "var(--color-light-gray)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <Title
                order={2}
                style={{
                  color: "var(--color-primary)",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
                mb={4}
              >
                {pharmacy.name}
              </Title>

              <Text size="sm" c="dimmed" mb={4}>
                {pharmacy.address}
              </Text>

              {pharmacy.phone && (
                <Text size="sm" c="dimmed">
                  {pharmacy.phone}
                </Text>
              )}
            </div>

            {/* Open/closed badge */}
            <Badge
              size="md"
              radius="xl"
              color={pharmacy.isOpen ? "green" : "gray"}
            >
              {pharmacy.isOpen ? "Open now" : "Closed"}
            </Badge>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-light-gray">
            <div>
              <p className="text-[10px] text-muted">Medicines in stock</p>
              <p className="text-sm font-semibold text-text-dark">
                {pharmacy.inventory.length}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted">Location</p>
              <p className="text-sm font-semibold text-text-dark">
                {pharmacy.lat.toFixed(4)}°N, {pharmacy.lng.toFixed(4)}°E
              </p>
            </div>
          </div>
        </Paper>

        {/* Inventory table */}
        <Paper
          radius="md"
          withBorder
          style={{ borderColor: "var(--color-light-gray)" }}
        >
          <div className="px-4 py-3 border-b border-light-gray">
            <Text
              size="sm"
              fw={500}
              style={{ color: "var(--color-text-dark)" }}
            >
              Available medicines
            </Text>
          </div>

          {pharmacy.inventory.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Text size="sm" c="dimmed">
                No medicines currently in stock
              </Text>
            </div>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th
                    style={{ color: "var(--color-muted)", fontSize: "12px" }}
                  >
                    Medicine
                  </Table.Th>
                  <Table.Th
                    style={{ color: "var(--color-muted)", fontSize: "12px" }}
                  >
                    Category
                  </Table.Th>
                  <Table.Th
                    style={{ color: "var(--color-muted)", fontSize: "12px" }}
                  >
                    In stock
                  </Table.Th>
                  <Table.Th
                    style={{ color: "var(--color-muted)", fontSize: "12px" }}
                  >
                    Price (NPR)
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {pharmacy.inventory.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Text
                        size="sm"
                        fw={500}
                        style={{ color: "var(--color-text-dark)" }}
                      >
                        {item.medicine.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {item.medicine.genericName} · {item.medicine.unit}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" radius="xl" variant="light" color="blue">
                        {item.medicine.category}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        size="sm"
                        fw={500}
                        style={{
                          color:
                            item.quantity < 20
                              ? "var(--color-soft-danger)"
                              : "var(--color-text-dark)",
                        }}
                      >
                        {item.quantity} {item.medicine.unit}s
                        {item.quantity < 20 ? " · low" : ""}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        size="sm"
                        fw={600}
                        style={{ color: "var(--color-primary)" }}
                      >
                        NPR {item.price}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Paper>
      </div>
    </div>
  );
}
