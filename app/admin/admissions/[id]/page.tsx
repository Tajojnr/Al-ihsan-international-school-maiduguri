import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, Lock } from "lucide-react";
import { updateAdmissionStatusAction, addAdmissionNoteAction } from "@/app/actions/admin";
import { AdminDocumentLink } from "@/components/admin-document-link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAdmissionReviewPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch full application
  const { data: app } = await supabase
    .from("admission_applications")
    .select(`
      *,
      admission_offerings (
        track,
        entry_class,
        campuses (name, address)
      )
    `)
    .eq("id", id)
    .single();

  if (!app) notFound();

  // Fetch documents
  const { data: documents } = await supabase
    .from("application_documents")
    .select("*")
    .eq("admission_application_id", id);

  // Fetch private notes
  const { data: notes } = await supabase
    .from("admission_application_notes")
    .select("id, note, created_at, profiles(full_name)")
    .eq("application_id", id)
    .order("created_at", { ascending: false });

  // Fetch public timeline
  const { data: events } = await supabase
    .from("admission_application_status_events")
    .select("*")
    .eq("application_id", id)
    .order("created_at", { ascending: false });

  const offering = app.admission_offerings;
  const campus = offering ? (Array.isArray(offering.campuses) ? offering.campuses[0] : offering.campuses) : null;

  return (
    <div className="max-w-6xl">
      <Link
        href="/admin/admissions"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Admissions
      </Link>

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Application Review
          </span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-white">
            {app.student_first_name} {app.student_middle_name} {app.student_last_name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ref: {app.reference_number || "Draft"} · {campus?.name} ({offering?.track?.toUpperCase()} - {offering?.entry_class})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              app.status === "accepted"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : app.status === "rejected"
                ? "bg-red-500/20 text-red-300 border border-red-500/40"
                : "bg-signal/20 text-signal border border-signal/40"
            }`}
          >
            {app.status.replace("_", " ")}
          </span>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Details & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student & Guardian Info */}
          <div className="glass-panel p-6 space-y-6">
            <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3">
              Applicant Particulars
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-slate-400 uppercase tracking-wider block">Date of Birth</span>
                <span className="font-semibold text-white mt-1 block">{app.date_of_birth || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider block">Gender</span>
                <span className="font-semibold text-white mt-1 block capitalize">{app.gender || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider block">Guardian Phone</span>
                <span className="font-semibold text-white mt-1 block">{app.guardian_phone || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider block">Relationship</span>
                <span className="font-semibold text-white mt-1 block">{app.guardian_relationship || "—"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 uppercase tracking-wider block">Residential Address</span>
                <span className="font-semibold text-white mt-1 block">{app.guardian_address || "—"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 uppercase tracking-wider block">Previous School</span>
                <span className="font-semibold text-white mt-1 block">{app.previous_school || "None stated"}</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="glass-panel p-6">
            <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3">
              Submitted Documents ({documents?.length || 0})
            </h2>

            <div className="mt-4 divide-y divide-white/10">
              {documents && documents.length > 0 ? (
                documents.map((doc) => (
                  <AdminDocumentLink
                    key={doc.id}
                    storagePath={doc.storage_path}
                    fileName={doc.original_file_name}
                    docType={doc.document_type}
                  />
                ))
              ) : (
                <p className="py-4 text-xs text-slate-500">No documents attached.</p>
              )}
            </div>
          </div>

          {/* Public Status Timeline */}
          <div className="glass-panel p-6">
            <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" /> Applicant Status Timeline
            </h2>

            <div className="mt-4 space-y-3">
              {events && events.length > 0 ? (
                events.map((e) => (
                  <div key={e.id} className="border-l-2 border-magenta pl-3 py-1 text-xs">
                    <p className="font-bold text-white capitalize">{e.to_status.replace("_", " ")}</p>
                    <p className="text-slate-300">{e.public_message}</p>
                    <p className="text-[10px] text-slate-500">{new Date(e.created_at).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No status events recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Admin Actions & Private Internal Notes */}
        <div className="space-y-6">
          {/* Status Decision Form */}
          <div className="glass-panel p-6">
            <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3">
              Make Decision
            </h2>

            <form
              action={async (formData: FormData) => {
                "use server";
                const newStatus = formData.get("status") as "under_review" | "accepted" | "rejected" | "waitlisted";
                const message = formData.get("message")?.toString() || "";
                await updateAdmissionStatusAction(app.id, newStatus, message);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  New Status
                </label>
                <select
                  name="status"
                  defaultValue={app.status}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-space px-4 py-2 text-xs text-white"
                >
                  <option value="under_review">Under Review</option>
                  <option value="accepted">Accepted / Offer Made</option>
                  <option value="waitlisted">Waitlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Message for Applicant
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="e.g. Congratulations! Please report to Campus 1 with original credentials on..."
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-magenta px-4 py-2.5 text-xs font-semibold text-white shadow-lg hover:opacity-90"
              >
                Update Status & Notify
              </button>
            </form>
          </div>

          {/* Confidential Internal Notes (Admin-only) */}
          <div className="glass-panel p-6 border-gold/30">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Lock className="h-4 w-4 text-gold" />
              <h2 className="font-heading text-base font-semibold text-white">
                Internal Staff Notes
              </h2>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">
              Confidential to administrators. Never visible to applicants.
            </p>

            <form
              action={async (formData: FormData) => {
                "use server";
                const note = formData.get("note")?.toString() || "";
                await addAdmissionNoteAction(app.id, note);
              }}
              className="mt-4 space-y-3"
            >
              <textarea
                name="note"
                required
                rows={2}
                placeholder="Add confidential assessment note..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
              <button
                type="submit"
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
              >
                Save Note
              </button>
            </form>

            <div className="mt-6 divide-y divide-white/10 space-y-3">
              {notes && notes.length > 0 ? (
                notes.map((n) => {
                  const author = Array.isArray(n.profiles) ? n.profiles[0] : n.profiles;
                  return (
                    <div key={n.id} className="pt-3 text-xs">
                      <p className="text-slate-200">{n.note}</p>
                      <p className="text-[10px] text-gold mt-1">
                        {author?.full_name || "Admin"} · {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="py-3 text-xs text-slate-500">No internal notes added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}