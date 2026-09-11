import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Award, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Academic Tracks",
  description: "Detailed overview of the Conventional curriculum and Tahfeez Quran memorization program at Al-Ihsan.",
};

export default function AcademicsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Academic Structure
        </span>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
          Rigorous Academics & Comprehensive Quranic Education
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          Discover our dual tracks tailored to equip students with sound secular disciplines and timeless Islamic scholarship.
        </p>
      </div>

      {/* Conventional Section */}
      <section id="conventional" className="mt-16 scroll-mt-24">
        <div className="glass-panel p-8 lg:p-12 border-l-4 border-l-signal">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-signal/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-signal">
              National Curriculum
            </span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-bold text-white">
            Conventional Academic Track
          </h2>
          <p className="mt-3 text-slate-300 max-w-3xl">
            Our Conventional track delivers a comprehensive educational program from Early Years (Nursery) through Primary, Junior Secondary (JSS 1-3), and Senior Secondary (SSS 1-3).
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-heading text-lg font-semibold text-white">Early Childhood</h3>
              <p className="mt-2 text-xs text-slate-400">
                Focusing on cognitive discovery, phonics, numeracy, fine motor skills, and introductory Arabic letters.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-heading text-lg font-semibold text-white">Basic Primary (1 - 6)</h3>
              <p className="mt-2 text-xs text-slate-400">
                Mathematics, Basic Science & Technology, English, Social Studies, Islamic Religious Studies, and Computer Science.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-heading text-lg font-semibold text-white">Secondary (JSS & SSS)</h3>
              <p className="mt-2 text-xs text-slate-400">
                Science, Arts, and Commercial streams preparing students for outstanding results in WAEC, NECO, and UTME (JAMB).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tahfeez Section */}
      <section id="tahfeez" className="mt-12 scroll-mt-24">
        <div className="glass-panel p-8 lg:p-12 border-l-4 border-l-tahfeez">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-tahfeez/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-tahfeez">
              Quran Memorization
            </span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-bold text-white">
            Tahfeez al-Quran Track
          </h2>
          <p className="mt-3 text-slate-300 max-w-3xl">
            A dedicated curriculum focused on systematic memorization of the Holy Quran, theoretical and practical Tajweed rules, and foundational Islamic jurisprudence.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-heading text-lg font-semibold text-white">Hifz & Muraja&apos;ah</h3>
              <p className="mt-2 text-xs text-slate-400">
                Structured daily schedules balancing new memorization (Sabaq) with thorough revision of previous juz.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-heading text-lg font-semibold text-white">Tajweed Mastery</h3>
              <p className="mt-2 text-xs text-slate-400">
                Makharij (articulation points), Sifaat (characteristics of letters), and classical recitation rules under certified Huffaz.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-heading text-lg font-semibold text-white">Integrated Arabic & Hadith</h3>
              <p className="mt-2 text-xs text-slate-400">
                Functional Arabic comprehension, daily Du&apos;as, 40 Hadith an-Nawawi, and Islamic manners (Adaab).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}