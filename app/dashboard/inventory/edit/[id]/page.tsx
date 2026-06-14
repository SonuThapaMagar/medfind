"use client"
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditInventoryPage() {
  const router = useRouter();
  return (
    <div className="overflow-hidden text-black">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted hover:text-text-dark text-sm mb-6 transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to inventory
      </button>

      {/* Card */}
      <div className="bg-card-bg border border-light-gray rounded-xl p-6">
        <h1 className="text-lg font-semibold text-primary mb-1">
          Edit inventory
        </h1>
        <p className="text-sm text-muted mb-6">
          Update stock quantity and price
        </p>

        <div className="flex flex-col gap-4">
          {/* Medicine name — read only in edit mode */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-dark">
              Medicine
            </label>
            <div className="px-3 py-2 bg-bg border border-light-gray rounded-lg">
              <p className="text-sm text-text-dark font-medium">Panadol</p>
              <p className="text-xs text-muted">Paracetamol · tablet</p>
            </div>
            <p className="text-xs text-muted">
              Medicine cannot be changed. Delete and re-add if needed.
            </p>
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-dark">
              Quantity in stock <span className="text-soft-danger">*</span>
            </label>
            <input
              type="number"
              defaultValue={200}
              min="0"
              className="w-full px-3 py-2 text-sm border border-light-gray rounded-lg outline-none text-text-dark focus:border-secondary transition-colors"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-dark">
              Price (NPR) <span className="text-soft-danger">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                NPR
              </span>
              <input
                type="number"
                defaultValue={10}
                min="0"
                className="w-full pl-12 pr-3 py-2 text-sm border border-light-gray rounded-lg outline-none text-text-dark focus:border-secondary transition-colors"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-secondary transition-colors cursor-pointer">
              Save changes
            </button>
            <button className="px-4 py-2 text-sm border border-light-gray text-text-dark rounded-lg hover:border-secondary cursor-pointer transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
