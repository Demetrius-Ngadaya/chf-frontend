import type { Metadata } from "next";
import { Fraunces, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thechf.or.tz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Caring Heart Foundation",
    template: "%s | Caring Heart Foundation",
  },
  description:
    "Promoting quality health, social welfare, and sustainable community development across Tanzania.",
  openGraph: {
    type: "website",
    siteName: "Caring Heart Foundation",
    title: "Caring Heart Foundation",
    description:
      "Promoting quality health, social welfare, and sustainable community development across Tanzania.",
    url: siteUrl,
    locale: "en_US",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Caring Heart Foundation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caring Heart Foundation",
    description:
      "Promoting quality health, social welfare, and sustainable community development across Tanzania.",
    images: ["/images/og-default.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Caring Heart Foundation",
    alternateName: "CHF",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.jpg`,
    description:
      "A Tanzanian non-profit working in health, social welfare, and community development.",
    areaServed: {
      "@type": "Country",
      name: "Tanzania",
    },
    sameAs: [],
  };

  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${spaceMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
