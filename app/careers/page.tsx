import { Metadata } from "next";
import Link from "next/link";
import { Briefcase, ArrowRight, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Careers & Vacancies",
  description: "Join the dedicated academic and administrative team at Al-Ihsan International Islamic School.",
};

export default async function CareersPage() {
  const supabase = await createClient();
  const { data: jobOpenings } = await supabase
    .from("job_openings")
    .select("id, title, slug, department, requirements, closing_date")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Join Our Faculty
        </span>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
          Career Opportunities
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          We are seeking dedicated educators, certified Huffaz, and passionate administrative staff committed to high academic standards and Islamic values.
        </p>
      </div>

      <div className="mt-12 space-y-4">
        {jobOpenings && jobOpenings.length > 0 ? (
          jobOpenings.map((job) => (
            <div
              key={job.id}
              className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-magenta">
                  {job.department || "Academic Faculty"}
                </span>
                <h2 className="mt-1 font-heading text-xl font-bold text-white">
                  {job.title}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-gold" />
                  <span>Maiduguri Campuses</span>
                </div>
              </div>

              <Link
                href={`/login`}
                className="inline-flex items-center gap-2 rounded-xl bg-magenta px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-90"
              >
                Apply via Portal <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))
        ) : (
          <div className="glass-panel p-12 text-center max-w-xl mx-auto">
            <Briefcase className="h-10 w-10 text-slate-500 mx-auto mb-4" />
            <h2 className="font-heading text-lg font-semibold text-white">
              No Open Vacancies Currently Listed
            </h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              We regularly review qualified candidate profiles for teaching and administrative roles. You can create an applicant account to be notified of upcoming openings.
            </p>
            <div className="mt-6">
              <Link
                href="/signup"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
              >
                Create Applicant Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}