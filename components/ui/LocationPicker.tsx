"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button, Group, Text, Stack } from "@mantine/core";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  address: string;
  onChange: (lat: number, lng: number, address: string) => void;
}

// inner component to handle map click events
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({
  lat,
  lng,
  address,
  onChange,
}: LocationPickerProps) {
  const [locating, setLocating] = useState(false);

  // reverse geocode using OpenStreetMap Nominatim (free, no API key)
  async function reverseGeocode(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      );
      const data = await res.json();
      return data.display_name as string;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  }

  async function handleLocationSelect(lat: number, lng: number) {
    const addr = await reverseGeocode(lat, lng);
    onChange(lat, lng, addr);
  }

  function handleDetectLocation() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await handleLocationSelect(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert("Location access denied. Please pinpoint manually on the map.");
      },
    );
  }

  // default center — Kathmandu
  const center: [number, number] = lat && lng ? [lat, lng] : [27.7172, 85.324];

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Text size="sm" fw={500}>
          Pharmacy Location
        </Text>
        <Button
          size="xs"
          variant="light"
          radius="xl"
          loading={locating}
          onClick={handleDetectLocation}
        >
          Use my location
        </Button>
      </Group>

      <div
        style={{
          height: 280,
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--mantine-color-gray-3)",
        }}
      >
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          {lat && lng && <Marker position={[lat, lng]} />}
        </MapContainer>
      </div>

      {address && (
        <Text size="xs" c="dimmed" lineClamp={2}>
          📍 {address}
        </Text>
      )}
    </Stack>
  );
}
