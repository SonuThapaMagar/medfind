import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MedFind Nepal",
  description: "Find medicines near you in Kathmandu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
