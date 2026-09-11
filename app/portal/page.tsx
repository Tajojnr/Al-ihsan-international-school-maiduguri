import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/actions/auth";
import Link from "next/link";
import { PlusCircle, ArrowRight, BookOpen, Briefcase } from "lucide-react";

interface AdmissionAppSummary {
  id: string;
  reference_number: string | null;
  status: string;
  student_first_name: string;
  student_last_name: string;
  created_at: string;
}

interface JobAppSummary {
  id: string;
  reference_number: string | null;
  status: string;
  created_at: string;
  job_openings: { title: string; department: string | null } | { title: string; department: string | null }[] | null;
}

export default async function PortalDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user?.id || "")
    .single();

  const { data: admissionAppsData } = await supabase
    .from("admission_applications")
    .select("id, reference_number, status, student_first_name, student_last_name, created_at")
    .order("created_at", { ascending: false });

  const { data: jobAppsData } = await supabase
    .from("job_applications")
    .select(`
      id,
      reference_number,
      status,
      created_at,
      job_openings (
        title,
        department
      )
    `)
    .order("created_at", { ascending: false });

  const admissionApps = (admissionAppsData || []) as unknown as AdmissionAppSummary[];
  const jobApps = (jobAppsData || []) as unknown as JobAppSummary[];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Applicant Portal
          </span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-white">
            Welcome, {profile?.full_name || "Applicant"}
          </h1>
          <p className="text-sm text-slate-400">{user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/admissions/new"
            className="inline-flex items-center gap-2 rounded-xl bg-magenta px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            <PlusCircle className="h-4 w-4" /> New Admission Application
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        {/* Admissions Card */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-signal" />
                <h2 className="font-heading text-lg font-semibold text-white">
                  Admission Applications
                </h2>
              </div>
              <Link
                href="/portal/admissions/new"
                className="text-xs font-semibold text-gold hover:underline"
              >
                + Start New
              </Link>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Student enrolments across our Conventional & Tahfeez campuses.
            </p>

            <div className="mt-6 divide-y divide-white/10">
              {admissionApps.length > 0 ? (
                admissionApps.map((app) => (
                  <Link
                    key={app.id}
                    href={`/portal/admissions/${app.id}`}
                    className="py-3.5 flex items-center justify-between group hover:bg-white/5 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm text-white group-hover:text-gold transition-colors">
                        {app.student_first_name || "Draft Application"} {app.student_last_name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {app.reference_number ? `Ref: ${app.reference_number}` : "Draft (In Progress)"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        app.status === "draft"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : app.status === "accepted"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-signal/15 text-signal border border-signal/30"
                      }`}
                    >
                      {app.status}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="py-6 text-xs text-slate-500 text-center">
                  No admission applications started yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Careers Card */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-magenta" />
                <h2 className="font-heading text-lg font-semibold text-white">
                  Job Applications
                </h2>
              </div>
              <Link
                href="/careers"
                className="text-xs font-semibold text-gold hover:underline"
              >
                + Browse Openings
              </Link>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Your submitted and draft employment applications.
            </p>

            <div className="mt-6 divide-y divide-white/10">
              {jobApps.length > 0 ? (
                jobApps.map((app) => {
                  const job = Array.isArray(app.job_openings) ? app.job_openings[0] : app.job_openings;
                  return (
                    <Link
                      key={app.id}
                      href={`/portal/careers/${app.id}`}
                      className="py-3.5 flex items-center justify-between group hover:bg-white/5 px-2 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm text-white group-hover:text-gold transition-colors">
                          {job?.title || "Employment Application"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {app.reference_number ? `Ref: ${app.reference_number}` : "Draft (Not submitted)"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          app.status === "draft"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : app.status === "shortlisted" || app.status === "hired"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : "bg-signal/15 text-signal border border-signal/30"
                        }`}
                      >
                        {app.status}
                      </span>
                    </Link>
                  );
                })
              ) : (
                <div className="py-6 text-center">
                  <p className="text-xs text-slate-500">No job applications submitted yet.</p>
                  <Link
                    href="/careers"
                    className="inline-block mt-3 text-xs font-semibold text-magenta hover:underline"
                  >
                    View Open Vacancies &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}