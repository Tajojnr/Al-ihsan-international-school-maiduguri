import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Search, Filter, Eye } from "lucide-react";

interface CampusRelation {
  name: string;
}

interface OfferingRelation {
  track: string;
  entry_class: string;
  campuses: CampusRelation | CampusRelation[] | null;
}

interface AdmissionApplicationItem {
  id: string;
  reference_number: string | null;
  status: string;
  student_first_name: string;
  student_last_name: string;
  created_at: string;
  submitted_at: string | null;
  admission_offerings: OfferingRelation | OfferingRelation[] | null;
}

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string; track?: string }>;
}

export default async function AdminAdmissionsListPage({ searchParams }: PageProps) {
  const { q, status, track } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("admission_applications")
    .select(`
      id,
      reference_number,
      status,
      student_first_name,
      student_last_name,
      created_at,
      submitted_at,
      admission_offerings (
        track,
        entry_class,
        campuses (name)
      )
    `)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (q) {
    query = query.or(
      `student_first_name.ilike.%${q}%,student_last_name.ilike.%${q}%,reference_number.ilike.%${q}%`
    );
  }

  const { data } = await query;
  const applications = (data || []) as unknown as AdmissionApplicationItem[];

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Admissions Directory
          </span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-white">
            Applicant Submissions
          </h1>
        </div>
      </header>

      {/* Filters & Search Form */}
      <form className="mt-6 glass-panel p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            name="q"
            defaultValue={q || ""}
            placeholder="Search student name or reference number..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <select
            name="status"
            defaultValue={status || ""}
            className="rounded-xl border border-white/10 bg-space px-4 py-2 text-xs text-white focus:border-gold focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="waitlisted">Waitlisted</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-magenta px-4 py-2 text-xs font-semibold text-white shadow-md hover:opacity-90"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <div className="mt-8 glass-panel overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="p-4">Reference</th>
              <th className="p-4">Student</th>
              <th className="p-4">Campus / Track</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {applications && applications.length > 0 ? (
              applications.map((app) => {
                const offeringRaw = app.admission_offerings;
                const offering = Array.isArray(offeringRaw) ? offeringRaw[0] : offeringRaw;
                const campusRaw = offering?.campuses;
                const campus = Array.isArray(campusRaw) ? campusRaw[0] : campusRaw;

                return (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-medium text-white">
                      {app.reference_number || "Draft"}
                    </td>
                    <td className="p-4 font-medium text-white">
                      {app.student_first_name || "—"} {app.student_last_name}
                    </td>
                    <td className="p-4 text-slate-300">
                      <p>{campus?.name || "Campus"}</p>
                      <p className="text-[10px] uppercase text-slate-400">
                        {offering?.track || "Conventional"} · {offering?.entry_class || "—"}
                      </p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          app.status === "accepted"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : app.status === "rejected"
                            ? "bg-red-500/15 text-red-300 border border-red-500/30"
                            : app.status === "draft"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : "bg-signal/15 text-signal border border-signal/30"
                        }`}
                      >
                        {app.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/admissions/${app.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-semibold text-white hover:bg-white/10"
                      >
                        <Eye className="h-3 w-3" /> View
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No admission applications matched your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}