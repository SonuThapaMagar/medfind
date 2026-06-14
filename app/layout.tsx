import Providers from "@/components/providers";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "MedFind",
  description: "Find medicines near you in Kathmandu",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <MantineProvider>{children}</MantineProvider>
        </Providers>
      </body>
    </html>
  );
}
