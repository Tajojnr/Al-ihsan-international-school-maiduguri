import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Briefcase, FileText, UploadCloud, Trash2 } from "lucide-react";
import {
  saveJobDraft,
  submitJobAction,
  uploadApplicationDocument,
  deleteApplicationDocument
} from "@/app/actions/applications";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: app } = await supabase
    .from("job_applications")
    .select(`
      *,
      job_openings (
        title,
        department,
        description,
        requirements
      )
    `)
    .eq("id", id)
    .single();

  if (!app) notFound();

  const { data: documents } = await supabase
    .from("application_documents")
    .select("*")
    .eq("job_application_id", id);

  const { data: statusEvents } = await supabase
    .from("job_application_status_events")
    .select("*")
    .eq("application_id", id)
    .order("created_at", { ascending: true });

  const job = app.job_openings;
  const isDraft = app.status === "draft";

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/portal"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Portal
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Career Application
          </span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-white">
            {job?.title || "Staff Position"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{job?.department || "Academic Faculty"}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-panel px-4 py-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Status</p>
            <p className="font-heading text-sm font-bold capitalize text-signal">
              {app.status}
            </p>
          </div>
          {app.reference_number && (
            <div className="glass-panel px-4 py-2 border-gold/30">
              <p className="text-[10px] uppercase tracking-wider text-gold">Reference</p>
              <p className="font-heading text-sm font-bold text-white">
                {app.reference_number}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Progress Timeline if Submitted */}
      {!isDraft && (
        <div className="mt-8 glass-panel p-6">
          <h2 className="font-heading text-base font-semibold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" /> Application Timeline
          </h2>
          <div className="mt-4 space-y-3">
            {statusEvents && statusEvents.length > 0 ? (
              statusEvents.map((evt) => (
                <div key={evt.id} className="border-l-2 border-magenta pl-3 py-1 text-xs">
                  <p className="font-bold text-white capitalize">{evt.to_status.replace("_", " ")}</p>
                  <p className="text-slate-300">{evt.public_message}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{new Date(evt.created_at).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Application submitted and awaiting review.</p>
            )}
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <form
            action={async (formData: FormData) => {
              "use server";
              await saveJobDraft(app.id, formData);
            }}
            className="glass-panel p-6 space-y-4"
          >
            <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3">
              Application Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Highest Academic Qualification
                </label>
                <input
                  name="highestQualification"
                  defaultValue={app.highest_qualification || ""}
                  disabled={!isDraft}
                  placeholder="e.g. B.Sc, B.Ed, Ijazah, NCE"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Years of Relevant Experience
                </label>
                <input
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  defaultValue={app.years_of_experience ?? ""}
                  disabled={!isDraft}
                  placeholder="e.g. 4"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Portfolio / LinkedIn URL (Optional)
              </label>
              <input
                name="portfolioUrl"
                type="url"
                defaultValue={app.linkedin_or_portfolio_url || ""}
                disabled={!isDraft}
                placeholder="https://..."
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Cover Letter / Statement of Purpose
              </label>
              <textarea
                name="coverLetter"
                rows={5}
                defaultValue={app.cover_letter || ""}
                disabled={!isDraft}
                placeholder="Describe your qualifications, teaching methodology, and Islamic pedagogy..."
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            {isDraft && (
              <button
                type="submit"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                Save Draft Information
              </button>
            )}
          </form>

          {/* CV / Documents Section */}
          <div className="glass-panel p-6 space-y-4">
            <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3">
              Attached CV & Credentials
            </h2>

            {isDraft && (
              <form
                action={async (formData: FormData) => {
                  "use server";
                  const docType = formData.get("docType") as "cv" | "certificate";
                  await uploadApplicationDocument(app.id, docType, "job", formData);
                }}
                className="rounded-xl border border-dashed border-white/20 bg-white/5 p-4 flex flex-wrap items-end gap-3"
              >
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    Type
                  </label>
                  <select name="docType" className="mt-1 rounded-xl border border-white/10 bg-space px-3 py-1.5 text-xs text-white">
                    <option value="cv">Curriculum Vitae (CV)</option>
                    <option value="certificate">Degree / Ijazah Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    Document File (PDF/Image)
                  </label>
                  <input
                    name="file"
                    type="file"
                    required
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="mt-1 text-xs text-slate-300 file:mr-2 file:rounded-lg file:border-0 file:bg-magenta file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-magenta px-4 py-2 text-xs font-semibold text-white shadow hover:opacity-90"
                >
                  Upload
                </button>
              </form>
            )}

            <div className="divide-y divide-white/10">
              {documents && documents.length > 0 ? (
                documents.map((doc) => (
                  <div key={doc.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-signal" />
                      <span className="font-semibold text-white">{doc.original_file_name}</span>
                      <span className="text-[10px] text-slate-400 uppercase">({doc.document_type})</span>
                    </div>

                    {isDraft && (
                      <form
                        action={async () => {
                          "use server";
                          await deleteApplicationDocument(doc.id, app.id);
                        }}
                      >
                        <button type="submit" className="text-slate-400 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    )}
                  </div>
                ))
              ) : (
                <p className="py-3 text-xs text-slate-500">No CV or credentials uploaded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Role Requirements & Submit */}
        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3">
              Role Details
            </h2>
            <div className="text-xs text-slate-300 space-y-2">
              <p><strong>Description:</strong> {job?.description}</p>
              {job?.requirements && (
                <p><strong>Requirements:</strong> {job.requirements}</p>
              )}
            </div>
          </div>

          {isDraft && (
            <div className="glass-panel p-6 border-magenta/40 text-center space-y-4">
              <h3 className="font-heading text-base font-semibold text-white">
                Ready to Submit?
              </h3>
              <p className="text-xs text-slate-400">
                Please ensure your CV is uploaded before submitting. Once submitted, your application cannot be modified.
              </p>

              <form
                action={async () => {
                  "use server";
                  await submitJobAction(app.id);
                }}
              >
                <button
                  type="submit"
                  className="w-full rounded-xl bg-magenta px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-magenta/30 hover:opacity-90"
                >
                  Submit Application
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}