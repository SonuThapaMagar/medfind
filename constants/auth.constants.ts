import { RegisterOwnerInput } from "@/lib/validations/auth";

export const STEP_FIELDS: Record<number, (keyof RegisterOwnerInput)[]> = {
  0: ["name", "email", "password"],
  1: ["pharmacyName", "pharmacyEmail", "pharmacyPhone", "pharmacyAddress"],
  2: ["terms"],
};
