import { createClient } from "@/lib/supabase/server";
import { saveSiteSettingsAction } from "@/app/actions/settings";
import { Settings, Save, Phone, Mail, MapPin, Share2 } from "lucide-react";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .single();

  const s = settings || {
    main_phone: "",
    alt_phone: "",
    main_email: "admissions@alihsan.sch.ng",
    main_address: "Maiduguri, Borno State, Nigeria",
    whatsapp: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    telegram: "",
  };

  return (
    <div>
      <header className="border-b border-white/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold flex items-center gap-1.5">
          <Settings className="h-3.5 w-3.5" /> Configuration
        </span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-white">
          Site Settings & Social Links
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Update contact details, phone numbers, and social media links displayed across the entire website.
        </p>
      </header>

      <form
        action={async (formData: FormData) => {
          "use server";
          await saveSiteSettingsAction(formData);
        }}
        className="mt-8 grid gap-8 lg:grid-cols-2"
      >
        <div className="glass-panel p-6 space-y-5">
          <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Phone className="h-4 w-4 text-gold" /> Contact Information
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Main Phone Number
            </label>
            <input
              name="mainPhone"
              defaultValue={s.main_phone || ""}
              placeholder="+234 800 000 0000"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Alternative Phone Number
            </label>
            <input
              name="altPhone"
              defaultValue={s.alt_phone || ""}
              placeholder="+234 800 000 0000"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Main Email Address
            </label>
            <input
              name="mainEmail"
              defaultValue={s.main_email || ""}
              placeholder="admissions@alihsan.sch.ng"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Main Address
            </label>
            <textarea
              name="mainAddress"
              defaultValue={s.main_address || ""}
              rows={2}
              placeholder="Head office address in Maiduguri"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="glass-panel p-6 space-y-5">
          <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Share2 className="h-4 w-4 text-gold" /> Social Media Links
          </h2>
          <p className="text-[10px] text-slate-400">
            Paste the full URL to your school&apos;s social profiles. Leave blank to hide an icon.
          </p>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              WhatsApp Link / Number
            </label>
            <input
              name="whatsapp"
              defaultValue={s.whatsapp || ""}
              placeholder="https://wa.me/2348000000000"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
              Facebook URL
            </label>
            <input
              name="facebook"
              defaultValue={s.facebook || ""}
              placeholder="https://facebook.com/alihsanschool"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-pink-400 mb-1">
              Instagram URL
            </label>
            <input
              name="instagram"
              defaultValue={s.instagram || ""}
              placeholder="https://instagram.com/alihsanschool"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1">
              Twitter / X URL
            </label>
            <input
              name="twitter"
              defaultValue={s.twitter || ""}
              placeholder="https://x.com/alihsanschool"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">
              YouTube URL
            </label>
            <input
              name="youtube"
              defaultValue={s.youtube || ""}
              placeholder="https://youtube.com/@alihsanschool"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              TikTok URL
            </label>
            <input
              name="tiktok"
              defaultValue={s.tiktok || ""}
              placeholder="https://tiktok.com/@alihsanschool"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sky-300 mb-1">
              Telegram URL
            </label>
            <input
              name="telegram"
              defaultValue={s.telegram || ""}
              placeholder="https://t.me/alihsanschool"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-magenta px-8 py-3 text-sm font-bold text-white shadow-xl shadow-magenta/25 hover:opacity-90"
          >
            <Save className="h-4 w-4" /> Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}