import Link from "next/link";
import { BookOpen, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch CMS content blocks for the home page
  const { data: blocks } = await supabase
    .from("content_blocks")
    .select("section_key, content")
    .eq("page_key", "home");

  const getContent = (key: string): Record<string, string> => {
    const block = blocks?.find((b) => b.section_key === key);
    return (block?.content as Record<string, string>) || {};
  };

  const hero = getContent("hero");
  const stats = getContent("stats");

  const headline = hero.headline || "Nurturing Faith, Knowledge & Excellence";
  const subtext = hero.subtext || "Al-Ihsan International Islamic School combines rigorous Conventional education with comprehensive Tahfeez to cultivate well-rounded leaders of tomorrow.";
  const badge = hero.badge || "Maiduguri · Six Campuses";

  const tracks = [
    {
      name: "Conventional Track",
      description: "Complete national curriculum encompassing STEM disciplines, English language, humanities, and critical reasoning from Nursery through Senior Secondary School (SS3).",
      accent: "bg-signal",
      border: "hover:border-signal/50",
      icon: BookOpen,
      iconBg: "bg-signal/15 border-signal/30 text-signal",
      badgeBg: "bg-signal/10 text-signal",
      items: ["WAEC, NECO & BECE certified preparation", "Modern Science and Computer laboratories", "Integrated Islamic values and morals"],
      checkColor: "text-signal",
      link: "/academics#conventional",
      linkColor: "text-signal",
    },
    {
      name: "Tahfeez Track",
      description: "A structured, disciplined program focused on complete Quran memorization (Hifz), mastery of Tajweed rules, Arabic language fluency, and Islamic jurisprudence.",
      accent: "bg-tahfeez",
      border: "hover:border-tahfeez/50",
      icon: Award,
      iconBg: "bg-tahfeez/15 border-tahfeez/30 text-tahfeez",
      badgeBg: "bg-tahfeez/10 text-tahfeez",
      items: ["Qualified & certified Huffaz instructors", "Structured daily revision (Muraja'ah) schedules", "Arabic grammar, Hadith, and Islamic etiquette"],
      checkColor: "text-tahfeez",
      link: "/academics#tahfeez",
      linkColor: "text-tahfeez",
    },
  ];

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 py-20 lg:py-32">
        <div aria-hidden="true" className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-magenta/15 blur-[120px] pointer-events-none" />
        <div aria-hidden="true" className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-signal/15 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-gold mb-6">
              <span>{badge}</span>
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
              {headline}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl">
              {subtext}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/admissions" className="inline-flex items-center gap-2 rounded-xl bg-magenta px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-magenta/25 transition-transform hover:-translate-y-0.5">
                Apply for Admission <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/campuses" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Explore Campuses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <p className="font-heading text-3xl font-bold text-white sm:text-4xl">{stats.campuses || "6"}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">Campuses in Maiduguri</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-magenta sm:text-4xl">{stats.tracks || "2"}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">Distinct Learning Tracks</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-signal sm:text-4xl">{stats.faculty || "100%"}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">Dedicated Faculty</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-tahfeez sm:text-4xl">{stats.quran || "Tajweed"}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">Certified Quran Curricula</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Curricular Tracks</span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">Two Specialized Educational Pathways</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {tracks.map((track) => {
              const Icon = track.icon;
              return (
                <div key={track.name} className={`glass-panel p-8 relative overflow-hidden group ${track.border} transition-colors`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${track.iconBg} mb-6`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`inline-block rounded-full ${track.badgeBg} px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-3`}>
                    {track.name}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{track.description}</p>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    {track.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 ${track.checkColor} shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href={track.link} className={`mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${track.linkColor} hover:underline`}>
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="glass-panel p-10 lg:p-16 relative overflow-hidden bg-gradient-to-br from-magenta/20 via-white/5 to-signal/20 border-white/15">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">Enrolment Open</span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-5xl">
                Begin Your Child&apos;s Journey With Al-Ihsan
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Create an applicant account to submit admission applications, track progress in real-time, and manage required documents online.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/signup" className="rounded-xl bg-magenta px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-magenta/30 hover:opacity-90">
                  Create Applicant Account
                </Link>
                <Link href="/admissions" className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/15">
                  Read Admissions Process
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}