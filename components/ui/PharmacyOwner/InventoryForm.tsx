"use client";

import { InventoryItem, Medicine, Pharmacy } from "@/types/index.type";
import { Alert, Button, NumberInput, Paper, Select, Stack, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type InventoryProps = {
  mode: "add" | "edit";
  inventoryId?: string;
  defaultMedicineId?: string;
  defaultQuantity?: number;
  defaultPrice?: number;
  defaultMedicineName?: string;
};

export default function InventoryForm({
  mode,
  inventoryId,
  defaultMedicineId,
  defaultQuantity,
  defaultPrice,
  defaultMedicineName,
}: InventoryProps) {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    initialValues: {
      medicineId: defaultMedicineId ?? "",
      quantity: defaultQuantity ?? 0,
      price: defaultPrice ?? 0,
    },
    validate: {
      medicineId: (val) =>
        mode === "add" && !val ? "Please select a medicine" : null,
      quantity: (val) => (val < 0 ? "Quantity cannot be negative" : null),
      price: (val) => (val < 0 ? "Price cannot be negative" : null),
    },
  });

  // Fetch all medicines for the dropdown (add mode only)
  useEffect(() => {
    if (mode !== "add") return;

    async function fetchMedicine() {
      const response = await fetch("/api/medicines");
      const data = await response.json();
      setMedicines(data);
    }
    fetchMedicine();
  }, [mode]);

  async function handleSubmit(values: typeof form.values) {
    setLoading(true);
    setError("");

    const url =
      mode === "add" ? "/api/inventory" : `/api/inventory/${inventoryId}`;
    const method = mode === "add" ? "POST" : "PUT";

    const body =
      mode === "add"
        ? {
            medicineId: values.medicineId,
            quantity: values.quantity,
            price: values.price,
          }
        : { quantity: values.quantity, price: values.price };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }
    // Go back to inventory table after save
    router.push("/dashboard/inventory");
    router.refresh();
  }

  // Medicine options for Select dropdown
  const medicineOptions = medicines.map((m) => ({
    value: m.id,
    label: `${m.name} (${m.genericName})`,
  }));

  return (
    <div className="overflow-hidden text-black">
      {/* Back button — static for now */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted hover:text-text-dark text-sm mb-6 transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to inventory
      </button>

      <Paper
        p="xl"
        radius="md"
        withBorder
        style={{ borderColor: "var(--color-light-gray)" }}
      >
        <Title
          order={3}
          mb={4}
          style={{ color: "var(--color-primary)", fontSize: "18px" }}
        >
          {mode === "add" ? "Add medicine" : "Edit inventory"}
        </Title>
        <Text size="sm" c="dimmed" mb="xl">
          {mode === "add"
            ? "Add a new medicine to your pharmacy inventory"
            : `Editing: ${defaultMedicineName}`}
        </Text>

        {error && (
          <Alert color="red" mb="md" radius="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {/* Medicine select — only in add mode */}
            {mode === "add" ? (
              <Select
                label="Medicine"
                placeholder="Search and select medicine..."
                data={medicineOptions}
                searchable
                required
                radius="md"
                {...form.getInputProps("medicineId")}
              />
            ) : (
              <div>
                <Text
                  size="sm"
                  fw={500}
                  mb={4}
                  style={{ color: "var(--color-text-dark)" }}
                >
                  Medicine
                </Text>
                <div className="px-3 py-2 bg-bg border border-light-gray rounded-lg">
                  <Text size="sm" style={{ color: "var(--color-muted)" }}>
                    {defaultMedicineName}
                  </Text>
                </div>
                <Text size="xs" c="dimmed" mt={4}>
                  Medicine cannot be changed. Delete and re-add if needed.
                </Text>
              </div>
            )}

            <NumberInput
              label="Quantity in stock"
              placeholder="0"
              min={0}
              required
              radius="md"
              {...form.getInputProps("quantity")}
            />

            <NumberInput
              label="Price (NPR)"
              placeholder="0"
              min={0}
              required
              radius="md"
              prefix="NPR "
              {...form.getInputProps("price")}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                loading={loading}
                loaderProps={{ type: "dots" }}
                radius="md"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {mode === "add" ? "Add to inventory" : "Save changes"}
              </Button>
              <Button
                variant="default"
                radius="md"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </Stack>
        </form>
      
      </Paper>
    </div>
  );
}
