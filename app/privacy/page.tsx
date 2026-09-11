import { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Data protection and privacy policy for Al-Ihsan International Islamic School.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-gold" />
        <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          Data Protection & Privacy Policy
        </h1>
      </div>
      <p className="mt-2 text-xs uppercase tracking-wider text-slate-400">
        In compliance with the Nigeria Data Protection Act (NDPA)
      </p>

      <div className="mt-8 glass-panel p-8 space-y-6 text-sm leading-relaxed text-slate-300">
        <section>
          <h2 className="font-heading text-lg font-semibold text-white mb-2">1. Overview</h2>
          <p>
            Al-Ihsan International Islamic School is committed to protecting the privacy, confidentiality, and security of personal data collected from students, parents, guardians, and job applicants across our six Maiduguri campuses.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-white mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Student Information:</strong> Full names, date of birth, gender, previous academic records, and emergency health disclosures.</li>
            <li><strong>Guardian Particulars:</strong> Contact telephone numbers, residential addresses in Maiduguri, and emergency contact details.</li>
            <li><strong>Employment Candidates:</strong> Résumés, educational qualifications, certifications, and previous teaching experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-white mb-2">3. How Your Data Is Protected</h2>
          <p className="text-xs">
            All verification documents and applications are stored in encrypted, access-controlled environments. Documents are accessible solely to authorized administrative staff for the strict purpose of evaluating admission eligibility and employment suitability.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-white mb-2">4. Your Rights</h2>
          <p className="text-xs">
            Guardians and applicants have the right to request access to, correction of, or deletion of their personal records by contacting the school administrative office at <span className="text-gold">admissions@alihsan.sch.ng</span>.
          </p>
        </section>
      </div>
    </main>
  );
}