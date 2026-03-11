import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "CropGuard.ai - AI-Powered Crop Disease Detection",
  description: "Detect crop diseases 3 weeks earlier with AI. Snap a photo, get instant diagnosis and treatment advice. Built for farmers of Andhra Pradesh.",
  keywords: ["CropGuard", "AI", "Crop Disease", "Farmers", "Agriculture", "Disease Detection", "India", "Andhra Pradesh"],
  authors: [{ name: "CropGuard.ai Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "CropGuard.ai - AI-Powered Crop Disease Detection",
    description: "Detect crop diseases 3 weeks earlier with AI",
    url: "https://cropguard.app",
    siteName: "CropGuard.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CropGuard.ai",
    description: "AI-Powered Crop Disease Detection for Farmers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
