import { Metadata } from "next";
import { ShieldCheck, Heart, Sparkles, Target, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the mission, vision, history, and educational leadership of Al-Ihsan International Islamic School.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          About Al-Ihsan
        </span>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
          A Tradition of Islamic Values & Academic Excellence
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          Founded in Maiduguri, Borno State, Al-Ihsan International Islamic School was established to provide sound, modern education rooted firmly in Islamic moral principles.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <div className="glass-panel p-8 border-l-4 border-l-magenta">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-magenta/15 text-magenta mb-6">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-white">Our Mission</h2>
          <p className="mt-4 leading-relaxed text-slate-300">
            To provide an inspiring, disciplined, and nurturing educational environment where students achieve outstanding academic competency while internalizing the teachings of the Quran and the Sunnah.
          </p>
        </div>

        <div className="glass-panel p-8 border-l-4 border-l-signal">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-signal/15 text-signal mb-6">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-white">Our Vision</h2>
          <p className="mt-4 leading-relaxed text-slate-300">
            To be the premier Islamic educational institution in Northern Nigeria, recognized nationally for producing morally upright scholars, innovators, and leaders equipped for contemporary challenges.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="mt-20">
        <h2 className="font-heading text-2xl font-bold text-white">
          Our Core Pillars
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-panel p-6">
            <div className="text-gold font-heading text-xl font-bold">01. Taqwa</div>
            <h3 className="mt-2 font-heading text-base font-semibold text-white">God Consciousness</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Instilling deep reverence for Allah and personal moral accountability in every action.
            </p>
          </div>

          <div className="glass-panel p-6">
            <div className="text-magenta font-heading text-xl font-bold">02. Ihsan</div>
            <h3 className="mt-2 font-heading text-base font-semibold text-white">Excellence & Sincerity</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Pursuing the highest caliber of work in academic, spiritual, and social endeavors.
            </p>
          </div>

          <div className="glass-panel p-6">
            <div className="text-signal font-heading text-xl font-bold">03. Ilm</div>
            <h3 className="mt-2 font-heading text-base font-semibold text-white">Beneficial Knowledge</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Embracing modern sciences, technology, and classical Islamic sciences equally.
            </p>
          </div>

          <div className="glass-panel p-6">
            <div className="text-tahfeez font-heading text-xl font-bold">04. Amanah</div>
            <h3 className="mt-2 font-heading text-base font-semibold text-white">Trust & Integrity</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Fostering responsibility, honesty, and leadership towards community and nation.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}