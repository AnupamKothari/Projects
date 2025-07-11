import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xcavate - Intelligent Excavator Fleet Management",
  description: "Advanced excavator rental, monitoring, and fleet analytics platform with real-time IoT integration",
  keywords: "excavator, fleet management, IoT, construction, equipment rental",
  authors: [{ name: "Xcavate Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ff7f00" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div id="app" className="min-h-screen bg-gray-50">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
