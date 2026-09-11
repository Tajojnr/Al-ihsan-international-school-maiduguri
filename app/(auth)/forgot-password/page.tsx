"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions/auth";
import { GraduationCap, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div aria-hidden="true" className="absolute -top-60 -left-60 h-[500px] w-[500px] rounded-full bg-gold/15 blur-[160px] pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-60 -right-60 h-[500px] w-[500px] rounded-full bg-magenta/15 blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/20 border border-gold/40 text-gold mb-4">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Enter your email to receive a secure recovery link.
          </p>
        </div>

        <div className="glass-panel p-8 border-white/15">
          {state?.success ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="font-heading text-lg font-bold text-white">Check Your Email</h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">{state.success}</p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-magenta px-6 py-3 text-xs font-semibold text-white shadow-lg hover:opacity-90"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              {state?.error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
                  {state.error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Registered Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-gold focus:ring-1 focus:ring-gold/50 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-magenta px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-magenta/25 transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? "Sending link..." : (
                  <>
                    Send Recovery Link <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}