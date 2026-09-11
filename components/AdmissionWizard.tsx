"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveAdmissionDraft,
  submitAdmissionAction,
  uploadApplicationDocument,
  deleteApplicationDocument
} from "@/app/actions/applications";
import {
  CheckCircle2,
  FileText,
  User,
  HeartHandshake,
  UploadCloud,
  Trash2,
  AlertCircle
} from "lucide-react";

interface DocumentRecord {
  id: string;
  document_type: string;
  original_file_name: string;
  file_size_bytes: number | null;
  created_at: string;
}

interface ApplicationData {
  id: string;
  reference_number: string | null;
  status: string;
  student_first_name: string;
  student_middle_name: string | null;
  student_last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  guardian_relationship: string | null;
  guardian_phone: string | null;
  guardian_alt_phone: string | null;
  guardian_address: string | null;
  previous_school: string | null;
  medical_conditions: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
}

export function AdmissionWizard({
  application,
  documents,
  offeringTitle,
}: {
  application: ApplicationData;
  documents: DocumentRecord[];
  offeringTitle: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const isDraft = application.status === "draft";

  async function handleSave(formData: FormData) {
    setIsSaving(true);
    setMessage(null);
    const res = await saveAdmissionDraft(application.id, formData);
    setIsSaving(false);

    if (res.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      setMessage({ text: "Draft progress saved.", type: "success" });
    }
  }

  async function handleSubmit() {
    if (!confirm("Are you sure you want to submit your application? Once submitted, it cannot be modified.")) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    const res = await submitAdmissionAction(application.id);
    setIsSubmitting(false);

    if (res.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      router.refresh();
    }
  }

  return (
    <div className="mt-8">
      {/* Wizard Step Navigation */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { num: 1, label: "Student", icon: User },
          { num: 2, label: "Guardian", icon: HeartHandshake },
          { num: 3, label: "Documents", icon: UploadCloud },
          { num: 4, label: "Review", icon: CheckCircle2 },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? "bg-magenta text-white shadow-lg"
                  : "glass-panel text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl border p-4 text-sm flex items-center gap-3 ${
            message.type === "error"
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {message.type === "error" ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Step 1: Student Details */}
      {step === 1 && (
        <form action={handleSave} className="glass-panel p-8 space-y-6">
          <h2 className="font-heading text-xl font-bold text-white border-b border-white/10 pb-4">
            Student Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                First Name *
              </label>
              <input
                name="studentFirstName"
                defaultValue={application.student_first_name}
                required
                disabled={!isDraft}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Middle Name
              </label>
              <input
                name="studentMiddleName"
                defaultValue={application.student_middle_name || ""}
                disabled={!isDraft}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Last / Surname *
              </label>
              <input
                name="studentLastName"
                defaultValue={application.student_last_name}
                required
                disabled={!isDraft}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                defaultValue={application.date_of_birth || ""}
                disabled={!isDraft}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Gender
              </label>
              <select
                name="gender"
                defaultValue={application.gender || ""}
                disabled={!isDraft}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-space px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Previous School Attended (If applicable)
            </label>
            <input
              name="previousSchool"
              defaultValue={application.previous_school || ""}
              disabled={!isDraft}
              placeholder="e.g. Al-Furqan Academy, Maiduguri"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
            />
          </div>

          {isDraft && (
            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl bg-magenta px-6 py-2.5 text-xs font-semibold text-white"
              >
                Next: Guardian Details →
              </button>
            </div>
          )}
        </form>
      )}

      {/* Step 2: Guardian Details */}
      {step === 2 && (
        <form action={handleSave} className="glass-panel p-8 space-y-6">
          <h2 className="font-heading text-xl font-bold text-white border-b border-white/10 pb-4">
            Guardian & Emergency Contact
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Relationship to Student
              </label>
              <input
                name="guardianRelationship"
                defaultValue={application.guardian_relationship || ""}
                disabled={!isDraft}
                placeholder="e.g. Father, Mother, Uncle"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Primary Phone Number *
              </label>
              <input
                name="guardianPhone"
                defaultValue={application.guardian_phone || ""}
                required
                disabled={!isDraft}
                placeholder="+234 800 000 0000"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Residential Address in Maiduguri
            </label>
            <textarea
              name="guardianAddress"
              rows={2}
              defaultValue={application.guardian_address || ""}
              disabled={!isDraft}
              placeholder="Full home address"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 border-t border-white/10 pt-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Emergency Contact Person
              </label>
              <input
                name="emergencyContactName"
                defaultValue={application.emergency_contact_name || ""}
                disabled={!isDraft}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Emergency Contact Phone
              </label>
              <input
                name="emergencyContactPhone"
                defaultValue={application.emergency_contact_phone || ""}
                disabled={!isDraft}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          {isDraft && (
            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-xl bg-magenta px-6 py-2.5 text-xs font-semibold text-white"
              >
                Next: Document Uploads →
              </button>
            </div>
          )}
        </form>
      )}

      {/* Step 3: Document Uploads */}
      {step === 3 && (
        <div className="glass-panel p-8 space-y-6">
          <h2 className="font-heading text-xl font-bold text-white border-b border-white/10 pb-4">
            Upload Verification Documents
          </h2>

          <p className="text-xs text-slate-400">
            Please attach a passport photograph, birth certificate, and previous academic results if available (PDF, JPEG, or PNG, max 10MB each).
          </p>

          {isDraft && (
            <form
              action={async (formData: FormData) => {
                const docType = formData.get("docType") as "birth_certificate" | "passport_photo" | "previous_result";
                await uploadApplicationDocument(application.id, docType, "admission", formData);
              }}
              className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 flex flex-wrap items-end gap-4"
            >
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Document Type
                </label>
                <select
                  name="docType"
                  required
                  className="mt-1.5 rounded-xl border border-white/10 bg-space px-4 py-2 text-xs text-white"
                >
                  <option value="passport_photo">Passport Photograph</option>
                  <option value="birth_certificate">Birth Certificate</option>
                  <option value="previous_result">Previous School Result / Report</option>
                  <option value="medical_report">Medical Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Select File
                </label>
                <input
                  name="file"
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="mt-1.5 text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-magenta file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-magenta px-4 py-2 text-xs font-semibold text-white shadow-md hover:opacity-90"
              >
                Upload File
              </button>
            </form>
          )}

          {/* List Uploaded Documents */}
          <div className="divide-y divide-white/10 pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">
              Attached Documents ({documents.length})
            </h3>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-signal" />
                    <div>
                      <p className="text-xs font-semibold text-white">{doc.original_file_name}</p>
                      <p className="text-[10px] uppercase text-slate-400">
                        {doc.document_type.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  {isDraft && (
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteApplicationDocument(doc.id, application.id);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="py-4 text-xs text-slate-500">No documents uploaded yet.</p>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="rounded-xl bg-magenta px-6 py-2.5 text-xs font-semibold text-white"
            >
              Next: Review & Submit →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Final Review & Submission */}
      {step === 4 && (
        <div className="glass-panel p-8 space-y-6">
          <h2 className="font-heading text-xl font-bold text-white border-b border-white/10 pb-4">
            Review Application Details
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 text-xs">
            <div className="space-y-3">
              <h3 className="font-semibold uppercase tracking-wider text-gold">Student Details</h3>
              <p className="text-slate-300">
                <strong className="text-white">Full Name:</strong> {application.student_first_name} {application.student_middle_name} {application.student_last_name}
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Date of Birth:</strong> {application.date_of_birth || "Not provided"}
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Gender:</strong> {application.gender || "Not provided"}
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Program:</strong> {offeringTitle}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold uppercase tracking-wider text-gold">Guardian & Address</h3>
              <p className="text-slate-300">
                <strong className="text-white">Guardian Phone:</strong> {application.guardian_phone || "Not provided"}
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Relationship:</strong> {application.guardian_relationship || "Not provided"}
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Address:</strong> {application.guardian_address || "Not provided"}
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Uploaded Documents:</strong> {documents.length} file(s)
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
            >
              ← Back
            </button>

            {isDraft ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="rounded-xl bg-magenta px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-magenta/30 hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Confirm & Submit Application"}
              </button>
            ) : (
              <span className="text-xs font-semibold text-signal uppercase tracking-wider">
                Application Submitted ({application.reference_number})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}