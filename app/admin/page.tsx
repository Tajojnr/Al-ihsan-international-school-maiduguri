import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { GraduationCap, Building2, Briefcase, Calendar, ArrowRight } from "lucide-react";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const { count: admissionCount } = await supabase
    .from("admission_applications")
    .select("*", { count: "exact", head: true });

  const { count: submittedCount } = await supabase
    .from("admission_applications")
    .select("*", { count: "exact", head: true })
    .neq("status", "draft");

  const { count: campusCount } = await supabase
    .from("campuses")
    .select("*", { count: "exact", head: true });

  const { count: jobCount } = await supabase
    .from("job_openings")
    .select("*", { count: "exact", head: true });

  // Recent 5 applications
  const { data: recentApps } = await supabase
    .from("admission_applications")
    .select(`
      id,
      reference_number,
      status,
      student_first_name,
      student_last_name,
      created_at,
      admission_offerings (
        track,
        entry_class,
        campuses (name)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <header className="border-b border-white/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Executive Dashboard
        </span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-white">
          System Overview
        </h1>
      </header>

      {/* Stats Row */}
      <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400">Total Enrolments</span>
            <GraduationCap className="h-5 w-5 text-magenta" />
          </div>
          <p className="mt-3 font-heading text-3xl font-bold text-white">{admissionCount ?? 0}</p>
          <p className="mt-1 text-[11px] text-slate-400">{submittedCount ?? 0} submitted for review</p>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400">Active Campuses</span>
            <Building2 className="h-5 w-5 text-signal" />
          </div>
          <p className="mt-3 font-heading text-3xl font-bold text-white">{campusCount ?? 0}</p>
          <p className="mt-1 text-[11px] text-slate-400">Maiduguri locations</p>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400">Career Openings</span>
            <Briefcase className="h-5 w-5 text-gold" />
          </div>
          <p className="mt-3 font-heading text-3xl font-bold text-white">{jobCount ?? 0}</p>
          <p className="mt-1 text-[11px] text-slate-400">Published vacancies</p>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400">Quick Action</span>
            <Calendar className="h-5 w-5 text-tahfeez" />
          </div>
          <Link
            href="/admin/admissions"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
          >
            Review Applications <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* Recent Applications Feed */}
      <section className="mt-10 glass-panel p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-heading text-lg font-semibold text-white">
            Recent Admission Submissions
          </h2>
          <Link href="/admin/admissions" className="text-xs font-semibold text-gold hover:underline">
            View All →
          </Link>
        </div>

        <div className="mt-4 divide-y divide-white/10">
          {recentApps && recentApps.length > 0 ? (
            recentApps.map((app) => (
              <div key={app.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm text-white">
                    {app.student_first_name || "Draft"} {app.student_last_name}
                  </p>
                  <p className="text-xs text-slate-400">
                    Ref: {app.reference_number || "Draft"} · Date:{" "}
                    {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      app.status === "draft"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-signal/15 text-signal border border-signal/30"
                    }`}
                  >
                    {app.status}
                  </span>
                  <Link
                    href={`/admin/admissions/${app.id}`}
                    className="text-xs font-semibold text-gold hover:underline"
                  >
                    Review →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-xs text-slate-500 text-center">No applications recorded yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}