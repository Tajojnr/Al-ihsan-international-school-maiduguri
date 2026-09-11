import Link from "next/link";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";
import { WhatsAppIcon, FacebookIcon, InstagramIcon, TwitterXIcon, YoutubeIcon, TelegramIcon } from "@/components/social-icons";

interface SiteSettings {
  main_phone?: string | null;
  alt_phone?: string | null;
  main_email?: string | null;
  main_address?: string | null;
  whatsapp?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  telegram?: string | null;
}

export function Footer({
  logoUrl,
  logoAlt,
  settings,
}: {
  logoUrl: string | null;
  logoAlt: string;
  settings?: SiteSettings | null;
}) {
  const phone = settings?.main_phone || "";
  const email = settings?.main_email || "admissions@alihsan.sch.ng";
  const address = settings?.main_address || "Maiduguri, Borno State, Nigeria";

  const socials = [
    { key: "whatsapp", url: settings?.whatsapp, icon: WhatsAppIcon, label: "WhatsApp", color: "hover:text-emerald-400" },
    { key: "facebook", url: settings?.facebook, icon: FacebookIcon, label: "Facebook", color: "hover:text-blue-400" },
    { key: "instagram", url: settings?.instagram, icon: InstagramIcon, label: "Instagram", color: "hover:text-pink-400" },
    { key: "twitter", url: settings?.twitter, icon: TwitterXIcon, label: "Twitter / X", color: "hover:text-sky-400" },
    { key: "youtube", url: settings?.youtube, icon: YoutubeIcon, label: "YouTube", color: "hover:text-red-400" },
    { key: "telegram", url: settings?.telegram, icon: TelegramIcon, label: "Telegram", color: "hover:text-sky-300" },
  ].filter((s) => s.url && s.url.trim() !== "");

  return (
    <footer className="border-t border-white/10 bg-space text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={logoAlt} className="h-11 w-11 rounded-xl object-contain border border-white/10 bg-white/5 p-1" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-magenta/20 border border-magenta/40 text-magenta">
                  <GraduationCap className="h-6 w-6" />
                </div>
              )}
              <div>
                <span className="font-heading text-lg font-bold tracking-tight text-white block">Al-Ihsan</span>
                <span className="font-arabic text-xs text-gold block">مَدْرَسَةُ الإِحْسَانِ الإِسْلَامِيَّةِ</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Providing qualitative Conventional academics alongside comprehensive Tahfeez (Quran memorization) across six premier campuses in Maiduguri, Borno State.
            </p>

            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.key}
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors ${s.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
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
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              {phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-gold shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-gold transition-colors">{phone}</a>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-gold transition-colors">{email}</a>
              </li>
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