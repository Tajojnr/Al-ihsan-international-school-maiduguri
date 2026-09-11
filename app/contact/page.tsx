import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { WhatsAppIcon, FacebookIcon, InstagramIcon, TwitterXIcon, YoutubeIcon, TelegramIcon } from "@/components/social-icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Al-Ihsan International Islamic School Maiduguri.",
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .single();

  const phone = settings?.main_phone || "";
  const altPhone = settings?.alt_phone || "";
  const email = settings?.main_email || "admissions@alihsan.sch.ng";
  const address = settings?.main_address || "Maiduguri, Borno State, Nigeria";

  const socials = [
    { key: "whatsapp", url: settings?.whatsapp, icon: WhatsAppIcon, label: "WhatsApp", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20" },
    { key: "facebook", url: settings?.facebook, icon: FacebookIcon, label: "Facebook", color: "text-blue-400 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20" },
    { key: "instagram", url: settings?.instagram, icon: InstagramIcon, label: "Instagram", color: "text-pink-400 border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20" },
    { key: "twitter", url: settings?.twitter, icon: TwitterXIcon, label: "Twitter / X", color: "text-sky-400 border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20" },
    { key: "youtube", url: settings?.youtube, icon: YoutubeIcon, label: "YouTube", color: "text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20" },
    { key: "telegram", url: settings?.telegram, icon: TelegramIcon, label: "Telegram", color: "text-sky-300 border-sky-400/30 bg-sky-400/10 hover:bg-sky-400/20" },
  ].filter((s) => s.url && s.url.trim() !== "");

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">Get In Touch</span>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">Contact Us</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          Have questions regarding admissions, curriculum, or campus visits? Our administrative team is here to assist you.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Info Box */}
        <div className="glass-panel p-8 space-y-6">
          <h2 className="font-heading text-lg font-semibold text-white border-b border-white/10 pb-4">School Information</h2>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Main Office</p>
                <p className="text-xs text-slate-400">{address}</p>
              </div>
            </div>

            {phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Telephone</p>
                  <a href={`tel:${phone}`} className="text-xs text-slate-400 hover:text-gold">{phone}</a>
                </div>
              </div>
            )}

            {altPhone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Alternative Line</p>
                  <a href={`tel:${altPhone}`} className="text-xs text-slate-400 hover:text-gold">{altPhone}</a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Email Address</p>
                <a href={`mailto:${email}`} className="text-xs text-slate-400 hover:text-gold">{email}</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Office Hours</p>
                <p className="text-xs text-slate-400">Monday – Thursday: 7:30 AM – 3:30 PM</p>
                <p className="text-xs text-slate-400">Friday: 7:30 AM – 12:30 PM</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {socials.length > 0 && (
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Follow Us</p>
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.key}
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${s.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="glass-panel p-8 lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-white">Send an Inquiry</h2>
          <p className="mt-1 text-xs text-slate-400">Fill out the form below and our admissions team will respond shortly.</p>

          <form className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">Full Name</label>
                <input type="text" required placeholder="Your Name" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">Phone Number</label>
                <input type="tel" required placeholder="+234..." className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">Email Address</label>
              <input type="email" required placeholder="you@example.com" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">Message / Question</label>
              <textarea rows={4} required placeholder="How can we assist you?" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none" />
            </div>
            <button type="button" className="rounded-xl bg-magenta px-6 py-3 text-xs font-semibold text-white shadow-lg hover:opacity-90">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}