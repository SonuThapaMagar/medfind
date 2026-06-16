export type Medicine = {
  id: string;
  name: string;
  genericName: string;
  category: string;
  unit: string;
  description?: string;
  _count: { inventory: number };
};

export type Pharmacy = {
  id: string;
  name: string;
  email: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  imageUrl: string | null;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  inventory: InventoryItem[];
  _count: { inventory: number };
  owner: {
    user: { name: string; email: string };
  } | null;
};

export type PharmacyDetail = Pharmacy & {
  inventory: InventoryItem[];
};

export type InventoryItem = {
  id: string;
  quantity: number;
  price: number;
  medicine: Medicine;
  pharmacy?: Pharmacy;
};

export type SearchResult = {
  id: string;
  price: number;
  quantity: number;
  medicine: Medicine;
  pharmacy: Pharmacy;
};

export type Role = "ADMIN" | "PHARMACY_OWNER" | "USER";
export type Users = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
