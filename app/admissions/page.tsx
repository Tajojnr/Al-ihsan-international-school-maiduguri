import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, UserPlus, UploadCloud, ClipboardCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Admissions",
  description: "Learn how to apply for admission to Al-Ihsan International Islamic School Maiduguri.",
};

const steps = [
  {
    icon: UserPlus,
    title: "1. Create an Applicant Account",
    desc: "Register on the portal with your email. You can manage multiple children from one account.",
  },
  {
    icon: FileText,
    title: "2. Complete the Online Application",
    desc: "Choose your preferred campus, track (Conventional or Tahfeez), and fill student & guardian details.",
  },
  {
    icon: UploadCloud,
    title: "3. Upload Required Documents",
    desc: "Upload passport photograph, birth certificate, and previous academic reports securely.",
  },
  {
    icon: ClipboardCheck,
    title: "4. Track Review & Assessment",
    desc: "Monitor your application status on the portal and receive updates as review progresses.",
  },
];

export default function AdmissionsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Enrolment Guide
        </span>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
          Admissions Process
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          We welcome applications for students seeking admission into our Conventional and Tahfeez sections across all six Maiduguri campuses.
        </p>
      </div>

      {/* 4 Steps */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="glass-panel p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-magenta/15 text-magenta mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="mt-16 glass-panel p-8 text-center max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl font-bold text-white">
          Ready to begin?
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Sign in or create your account to start an admission application today.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-xl bg-magenta px-6 py-3 text-sm font-semibold text-white shadow-lg"
          >
            Create Applicant Account
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Portal Login
          </Link>
        </div>
      </div>
    </main>
  );
}