export type Medicine = {
  id: string;
  name: string;
  genericName: string;
  category: string;
  unit: string;
  description?: string;
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
