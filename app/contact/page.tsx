import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Al-Ihsan International Islamic School Maiduguri.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Get In Touch
        </span>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          Have questions regarding admissions, curriculum, or campus visits? Our administrative team is here to assist you.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Info Box */}
        <div className="glass-panel p-8 space-y-6">
          <h2 className="font-heading text-lg font-semibold text-white border-b border-white/10 pb-4">
            School Information
          </h2>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Main Office</p>
                <p className="text-xs text-slate-400">Maiduguri, Borno State, Nigeria</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Telephone</p>
                <p className="text-xs text-slate-400">+234 800 000 0000</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Email Address</p>
                <p className="text-xs text-slate-400">admissions@alihsan.sch.ng</p>
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
        </div>

        {/* Contact Form */}
        <div className="glass-panel p-8 lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-white">
            Send an Inquiry
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Fill out the form below and our admissions team will respond shortly.
          </p>

          <form className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+234..."
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Message / Question
              </label>
              <textarea
                rows={4}
                required
                placeholder="How can we assist you?"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="rounded-xl bg-magenta px-6 py-3 text-xs font-semibold text-white shadow-lg hover:opacity-90"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}