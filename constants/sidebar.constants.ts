import {
  Hospital,
  LayoutDashboard,
  Package,
  Pill,
  Store,
  Users,
} from "lucide-react";

export const OWNER_NAV_LINKS = [
  { href: "/pharmacyOwner/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/pharmacyOwner/inventory", label: "Inventory", icon: Package },
  { href: "/pharmacyOwner/profile", label: "Pharmacy Profile", icon: Store },
];

export const ADMIN_NAV_LINKS = [
  { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { label: "Medicines", href: "/admin/medicines", icon: Pill },
  { label: "Pharmacies", href: "/admin/pharmacies", icon: Hospital },
  { label: "Users", href: "/admin/users", icon: Users },
];
