"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// The type for each result item coming from /api/search
type SearchResult = {
  id: string;
  price: number;
  quantity: number;
  medicine: { name: string; unit: string };
  pharmacy: {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    isOpen: boolean;
    phone: string;
  };
};

type Props = {
  results: SearchResult[];
};

export default function PharmacyMap({ results }: Props) {
  const center: [number, number] = [27.7172, 85.324];

  return (
    <div
      style={{ height: "400px" }}
      className="w-full rounded-xl border border-gray-200 overflow-hidden"
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        // scrollWheelZoom: false — prevents page scroll hijacking on the map
      >
        {/* TileLayer is the map background — OpenStreetMap is free */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* One marker per pharmacy result */}
        {results.map((item) => (
          <Marker
            key={item.id}
            position={[item.pharmacy.lat, item.pharmacy.lng]}
            icon={defaultIcon}
          >
            {/* Popup appears when marker is clicked */}
            <Popup>
              <div className="text-sm">
                <p className="font-medium">{item.pharmacy.name}</p>
                <p className="text-gray-500 text-xs">{item.pharmacy.address}</p>
                <p className="text-green-600 font-medium mt-1">
                  NPR {item.price}
                </p>
                <p className="text-xs text-gray-500">
                  {item.quantity} {item.medicine.unit}s in stock
                </p>
                <p className="text-xs mt-1">
                  {item.pharmacy.isOpen ? "🟢 Open" : "🔴 Closed"}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
