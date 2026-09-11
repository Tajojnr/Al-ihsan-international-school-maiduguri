import type { Metadata, Viewport } from "next";
import { Inter, Noto_Naskh_Arabic, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SchoolSchema } from "@/components/schema-org";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-naskh",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alihsan.sch.ng";

export const viewport: Viewport = {
  themeColor: "#0A0E14",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Al-Ihsan International Islamic School — Maiduguri",
    template: "%s | Al-Ihsan International Islamic School",
  },
  description:
    "Excellence in Conventional academic disciplines and comprehensive Tahfeez (Quran memorization) across six modern campuses in Maiduguri, Borno State, Nigeria.",
  keywords: [
    "Al-Ihsan Islamic School Maiduguri",
    "Islamic schools in Maiduguri",
    "Tahfeez school Borno State",
    "Best Islamic school Maiduguri",
    "Quran memorization Maiduguri",
    "Conventional Islamic school Nigeria",
    "Borno State private schools",
    "Al-Ihsan campuses Maiduguri",
    "WAEC NECO Islamic school Maiduguri"
  ],
  authors: [{ name: "Al-Ihsan International Islamic School" }],
  creator: "Al-Ihsan International Islamic School",
  publisher: "Al-Ihsan International Islamic School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "Al-Ihsan International Islamic School",
    title: "Al-Ihsan International Islamic School — Maiduguri",
    description:
      "Nurturing Faith, Knowledge & Excellence across six campuses in Maiduguri. Explore Conventional and Tahfeez academic tracks.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Al-Ihsan International Islamic School Maiduguri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Ihsan International Islamic School — Maiduguri",
    description:
      "Qualitative Conventional education and comprehensive Tahfeez across six campuses in Maiduguri.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "NG-BO",
    "geo.placename": "Maiduguri",
    "geo.position": "11.8333;13.1500",
    "ICBM": "11.8333, 13.1500"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();

  const { data: logoMedia } = await supabase
    .from("media")
    .select("public_url, alt_text")
    .eq("category", "logo")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const logoUrl = logoMedia?.public_url || null;
  const logoAlt = logoMedia?.alt_text || "Al-Ihsan International Islamic School Logo";

  return (
    <html lang="en">
      <head>
        <SchoolSchema />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${naskh.variable} font-sans antialiased bg-space text-slate-100 min-h-screen flex flex-col`}
      >
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-white px-4 py-3 text-space focus:not-sr-only"
        >
          Skip to content
        </a>

        <Navbar logoUrl={logoUrl} logoAlt={logoAlt} />
        <div className="flex-1">{children}</div>
        <Footer logoUrl={logoUrl} logoAlt={logoAlt} />
      </body>
    </html>
  );
}