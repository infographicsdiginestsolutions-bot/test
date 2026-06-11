import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solaris Energy — Powering Tomorrow with Clean Solar Energy",
  description:
    "Reduce energy costs, achieve energy independence, and build a sustainable future with intelligent solar solutions. Residential, commercial, and industrial solar installations.",
  keywords: "solar energy, renewable energy, solar panels, residential solar, commercial solar, industrial solar, clean energy",
  openGraph: {
    title: "Solaris Energy — Powering Tomorrow with Clean Solar Energy",
    description: "Premium solar solutions for homes, businesses, and industry.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#050810] text-white">
        {children}
      </body>
    </html>
  );
}
