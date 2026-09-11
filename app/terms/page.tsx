import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions of Al-Ihsan International Islamic School admissions and portals.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-xs uppercase tracking-wider text-slate-400">
        Al-Ihsan International Islamic School Maiduguri
      </p>

      <div className="mt-8 glass-panel p-8 space-y-6 text-sm leading-relaxed text-slate-300">
        <section>
          <h2 className="font-heading text-lg font-semibold text-white mb-2">1. Accuracy of Information</h2>
          <p className="text-xs">
            Applicants and guardians confirm that all details, birth dates, and academic certificates submitted via the portal are truthful and accurate. Submission of fraudulent records results in immediate disqualification or revocation of admission.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-white mb-2">2. Submission & Admission Decisions</h2>
          <p className="text-xs">
            Submission of an admission form does not guarantee automatic acceptance. Placements are subject to classroom capacity across our six campuses, entrance assessments, and interview evaluations.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-white mb-2">3. Portal Security</h2>
          <p className="text-xs">
            Users are responsible for maintaining the confidentiality of their portal credentials.
          </p>
        </section>
      </div>
    </main>
  );
}