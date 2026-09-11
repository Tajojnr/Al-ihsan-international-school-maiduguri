import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Al-Ihsan International Islamic School — Maiduguri",
    template: "%s | Al-Ihsan International Islamic School",
  },
  description:
    "Excellence in Conventional academic disciplines and comprehensive Tahfeez Quranic memorization across six modern campuses in Maiduguri, Borno State.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();

  // Fetch school logo from media library
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