import Link from "next/link";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";

export function Footer({ logoUrl, logoAlt }: { logoUrl: string | null; logoAlt: string }) {
  return (
    <footer className="border-t border-white/10 bg-space text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
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
                <span className="font-heading text-lg font-bold tracking-tight text-white block">
                  Al-Ihsan
                </span>
                <span className="font-arabic text-xs text-gold block">
                  مَدْرَسَةُ الإِحْسَانِ الإِسْلَامِيَّةِ
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Providing qualitative Conventional academics alongside comprehensive Tahfeez (Quran memorization) across six premier campuses in Maiduguri, Borno State.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link href="/academics" className="hover:text-gold transition-colors">Academic Tracks</Link></li>
              <li><Link href="/campuses" className="hover:text-gold transition-colors">Our 6 Campuses</Link></li>
              <li><Link href="/gallery" className="hover:text-gold transition-colors">Photo Gallery</Link></li>
              <li><Link href="/admissions" className="hover:text-gold transition-colors">Admissions</Link></li>
              <li><Link href="/careers" className="hover:text-gold transition-colors">Career Vacancies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-white">Academic Tracks</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/academics#conventional" className="hover:text-signal transition-colors">Conventional Nursery & Primary</Link></li>
              <li><Link href="/academics#conventional" className="hover:text-signal transition-colors">Junior & Senior Secondary</Link></li>
              <li><Link href="/academics#tahfeez" className="hover:text-tahfeez transition-colors">Full-Time Tahfeez</Link></li>
              <li><Link href="/academics#tahfeez" className="hover:text-tahfeez transition-colors">Integrated Tahfeez & Tajweed</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-white">Head Office</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5"><MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" /><span>Maiduguri, Borno State, Nigeria</span></li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-gold shrink-0" /><span>+234 800 000 0000</span></li>
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-gold shrink-0" /><span>admissions@alihsan.sch.ng</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Al-Ihsan International Islamic School. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/portal" className="hover:text-gold">Applicant Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}