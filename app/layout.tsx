import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@/components/analytics";
import { WebVitals } from "./web-vitals";

export const metadata: Metadata = {
	title: "Plangrove - Plant Care with Friends",
	description:
		"Keep plants alive together. For roommates, offices, or whoever shares your plants.",
	keywords: [
		"plants",
		"plant care",
		"collaborative",
		"watering",
		"office plants",
		"plant tracker",
	],
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Plangrove",
	},
	openGraph: {
		title: "Plangrove - Plant Care with Friends",
		description: "Keep plants alive together.",
		type: "website",
	},
};

export const viewport: Viewport = {
	themeColor: "#c26849",
	width: "device-width",
	initialScale: 1,
	// Allow zooming for accessibility
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
				{/* Skip link for keyboard accessibility */}
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none"
				>
					Skip to main content
				</a>
				<Providers>{children}</Providers>
				<WebVitals />
				<Analytics />
			</body>
		</html>
	);
}
