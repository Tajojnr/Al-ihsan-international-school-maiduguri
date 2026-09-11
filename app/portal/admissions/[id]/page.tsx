import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck } from "lucide-react";
import { AdmissionWizard } from "@/components/AdmissionWizard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdmissionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: application } = await supabase
    .from("admission_applications")
    .select(`
      *,
      admission_offerings (
        track,
        entry_class,
        campuses (
          name
        )
      )
    `)
    .eq("id", id)
    .single();

  if (!application) {
    notFound();
  }

  // Fetch documents attached to this application
  const { data: documents } = await supabase
    .from("application_documents")
    .select("id, document_type, original_file_name, file_size_bytes, created_at")
    .eq("admission_application_id", id);

  // Fetch status history timeline
  const { data: statusEvents } = await supabase
    .from("admission_application_status_events")
    .select("id, to_status, public_message, created_at")
    .eq("application_id", id)
    .order("created_at", { ascending: true });

  const offering = application.admission_offerings;
  const campus = offering ? (Array.isArray(offering.campuses) ? offering.campuses[0] : offering.campuses) : null;
  const offeringTitle = `${campus?.name || "Al-Ihsan Campus"} — ${offering?.track?.toUpperCase()} (${offering?.entry_class})`;

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
            Admission Application
          </span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-white">
            {application.student_first_name
              ? `${application.student_first_name} ${application.student_last_name}`
              : "Draft Application"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{offeringTitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-panel px-4 py-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Status</p>
            <p className="font-heading text-sm font-bold capitalize text-signal">
              {application.status}
            </p>
          </div>
          {application.reference_number && (
            <div className="glass-panel px-4 py-2 border-gold/30">
              <p className="text-[10px] uppercase tracking-wider text-gold">Reference</p>
              <p className="font-heading text-sm font-bold text-white">
                {application.reference_number}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* If submitted, show Status Timeline */}
      {application.status !== "draft" && (
        <div className="mt-8 glass-panel p-6">
          <h2 className="font-heading text-base font-semibold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" /> Application Progress Timeline
          </h2>

          <div className="mt-6 space-y-4">
            {statusEvents && statusEvents.length > 0 ? (
              statusEvents.map((evt) => (
                <div key={evt.id} className="flex items-start gap-3 border-l-2 border-magenta pl-4 py-1">
                  <div>
                    <p className="text-xs font-bold text-white capitalize">
                      {evt.to_status.replace("_", " ")}
                    </p>
                    <p className="text-xs text-slate-300">{evt.public_message}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(evt.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Application received and pending review.</p>
            )}
          </div>
        </div>
      )}

      {/* Interactive Wizard */}
      <AdmissionWizard
        application={application}
        documents={documents || []}
        offeringTitle={offeringTitle}
      />
    </main>
  );
}