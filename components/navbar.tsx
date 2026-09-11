"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Academics", href: "/academics" },
  { name: "Campuses", href: "/campuses" },
  { name: "Gallery", href: "/gallery" },
  { name: "Admissions", href: "/admissions" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export function Navbar({ logoUrl, logoAlt }: { logoUrl: string | null; logoAlt: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/portal") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-space/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={logoAlt}
              className="h-11 w-11 rounded-xl object-contain border border-white/10 bg-white/5 p-1"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-magenta/20 border border-magenta/40 text-magenta">
              <GraduationCap className="h-6 w-6" />
            </div>
          )}
          <div>
            <span className="font-heading text-lg font-bold tracking-tight text-white block leading-tight">
              Al-Ihsan
            </span>
            <span className="font-arabic text-xs text-gold block leading-tight">
              مَدْرَسَةُ الإِحْسَانِ الإِسْلَامِيَّةِ
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-magenta text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            Portal Login
          </Link>
          <Link
            href="/admissions"
            className="rounded-xl bg-magenta px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-magenta/25 transition-opacity hover:opacity-90"
          >
            Apply Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          className="flex lg:hidden rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-space/95 px-6 py-6 backdrop-blur-2xl">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-magenta text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-white/10">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              >
                Applicant Portal
              </Link>
              <Link
                href="/admissions"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center rounded-xl bg-magenta px-4 py-3 text-sm font-semibold text-white"
              >
                Apply for Admission
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}