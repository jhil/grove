import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@/components/analytics";

export const metadata: Metadata = {
  title: "Plangrove - Collaborative Plant Care",
  description: "Share and care for plants together. Perfect for offices, shared spaces, or any community that wants to nurture plants collectively.",
  keywords: ["plants", "plant care", "collaborative", "watering", "office plants", "plant tracker"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Plangrove",
  },
  openGraph: {
    title: "Plangrove - Collaborative Plant Care",
    description: "Share and care for plants together.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#778c62",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
