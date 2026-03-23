import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "We Insure Everything | Nationwide Insurance Marketplace",
  description:
    "A national insurance marketplace connecting you with licensed, vetted local agents. Find the right coverage based on your location and needs.",
  keywords:
    "insurance marketplace, nationwide insurance, local insurance agents, car insurance, health insurance, home insurance, medicare specialists",
  openGraph: {
    title: "We Insure Everything | Nationwide Insurance Marketplace",
    description:
      "Connect with licensed, vetted insurance agents based on your location and needs. Nationwide reach with local expertise.",
    url: "https://weinsureeverything.com",
    siteName: "We Insure Everything",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
