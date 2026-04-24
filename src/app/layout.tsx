import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/ToasterProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
  weight: ["700", "900"], // only bold + black — cuts font payload ~60%
});

export const metadata: Metadata = {
  title: "We Insure Everything",
  description:
    "Get comprehensive insurance coverage for every aspect of your life with We Insure Everything. From business and commercial, auto and home to health, life and travel, we've got you covered. Find the perfect policy for your needs today.",
  authors: [{ name: "Mikell Simmons" }],
  keywords:
    "Insurance, coverage, life insurance, business insurance, commercial insurance, personal insurance, auto insurance, home insurance, health insurance, travel insurance, comprehensive insurance, policy options",
  openGraph: {
    title: "We Insure Everything",
    description:
      "Get comprehensive insurance coverage for every aspect of your life with We Insure Everything. From business and commercial, auto and home to health, life and travel, we've got you covered. Find the perfect policy for your needs today.",
    url: "https://weinsureeverything.com",
    siteName: "We Insure Everything",
    type: "website",
    images: [
      {
        url: "https://assets.cdn.filesafe.space/ArGbGv9tKVCTyZiCUVci/media/6622bf9a8381f228c10a6adf.jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "We Insure Everything",
    description:
      "Get comprehensive insurance coverage for every aspect of your life with We Insure Everything.",
    images: [
      "https://assets.cdn.filesafe.space/ArGbGv9tKVCTyZiCUVci/media/6622bf9a8381f228c10a6adf.jpeg",
    ],
  },
  icons: {
    icon: "/logo.png",
  },
  robots: "index, follow",
  other: {
    "disability insurance": "/healthlifedisability",
    "business insurance": "/commercialinsurance",
    "commercial insurance": "/commercialinsurance",
    "restaurant insurance": "/commercialinsurance",
    "bop insurance": "/commercialinsurance",
    "general liability insurance": "/commercialinsurance",
    "property insurance": "/commercialinsurance",
    "commercial property insurance": "/commercialinsurance",
    "auto insurance": "/personalinsurance",
    "florida car insurance": "/personalinsurance",
    "florida home insurance": "/personalinsurance",
    "florida property insurance": "/personalinsurance",
    "florida health insurance": "/healthlifedisability",
    "florida life insurance": "/healthlifedisability",
    "executive life insurance": "/healthlifedisability",
    "group health insurance": "/groupbenefits-administration",
    "employee benefits florida": "/groupbenefits-administration",
    "international insurance": "/international",
    "travel insurance": "/international",
    "book a call": "/bookacall",
    "about us": "/aboutus",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased font-sans">
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
