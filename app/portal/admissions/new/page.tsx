import { createClient } from "@/lib/supabase/server";
import { createAdmissionDraft } from "@/app/actions/applications";
import Link from "next/link";
import { ArrowLeft, BookOpen, Award } from "lucide-react";

export default async function NewAdmissionPage() {
  const supabase = await createClient();

  // Fetch active cycle
  const { data: activeCycle } = await supabase
    .from("admission_cycles")
    .select("*")
    .eq("is_active", true)
    .single();

  // Fetch available offerings with campus relation
  const { data: offerings } = await supabase
    .from("admission_offerings")
    .select(`
      id,
      track,
      entry_class,
      campuses (
        id,
        name,
        address
      )
    `)
    .eq("is_accepting_applications", true);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/portal"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Portal
      </Link>

      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          New Admission Application
        </span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-white">
          Select Campus, Track & Entry Class
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Academic Session:{" "}
          <span className="text-white font-medium">
            {activeCycle?.academic_session || "2026/2027 (Active Intake)"}
          </span>
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {offerings && offerings.length > 0 ? (
          offerings.map((offering) => {
            // Support both single object and array relation returns from Supabase typing
            const campusData = Array.isArray(offering.campuses)
              ? offering.campuses[0]
              : offering.campuses;

            const isTahfeez = offering.track === "tahfeez";

            return (
              <div
                key={offering.id}
                className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 ${
                      isTahfeez
                        ? "bg-tahfeez/15 border border-tahfeez/30 text-tahfeez"
                        : "bg-signal/15 border border-signal/30 text-signal"
                    }`}
                  >
                    {isTahfeez ? <Award className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          isTahfeez
                            ? "bg-tahfeez/15 text-tahfeez border border-tahfeez/30"
                            : "bg-signal/15 text-signal border border-signal/30"
                        }`}
                      >
                        {offering.track} Track
                      </span>
                      <span className="text-xs text-slate-400">· {offering.entry_class}</span>
                    </div>

                    <h3 className="mt-1 font-heading text-lg font-bold text-white">
                      {campusData?.name || "Al-Ihsan Campus"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {campusData?.address || "Maiduguri, Borno State"}
                    </p>
                  </div>
                </div>

                <form
                  action={async () => {
                    "use server";
                    await createAdmissionDraft(offering.id);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-xl bg-magenta px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
                  >
                    Start Application →
                  </button>
                </form>
              </div>
            );
          })
        ) : (
          <div className="glass-panel p-12 text-center max-w-xl mx-auto">
            <h3 className="font-heading text-lg font-semibold text-white">
              No Open Admission Offerings Configured
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Admission offerings are currently being set up by school administrators for this intake session. Please check back shortly.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}