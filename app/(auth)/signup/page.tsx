"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/app/actions/auth";
import { GraduationCap, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signupAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div aria-hidden="true" className="absolute -top-60 -right-60 h-[500px] w-[500px] rounded-full bg-tahfeez/15 blur-[160px] pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-60 -left-60 h-[500px] w-[500px] rounded-full bg-magenta/15 blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-tahfeez/20 border border-tahfeez/40 text-tahfeez mb-4">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            One account to manage all admission and career applications.
          </p>
        </div>

        <div className="glass-panel p-8 border-white/15">
          {state?.success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="font-heading text-xl font-bold text-white">Account Created!</h2>
              <p className="mt-2 text-sm text-slate-300">{state.success}</p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-magenta px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90"
              >
                Sign In Now <ArrowRight className="h-4 w-4" />
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
                <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-tahfeez focus:ring-1 focus:ring-tahfeez/50 focus:outline-none transition-colors"
                  placeholder="e.g. Fatima Muhammad"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-tahfeez focus:ring-1 focus:ring-tahfeez/50 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password (min. 8 characters)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    minLength={8}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:border-tahfeez focus:ring-1 focus:ring-tahfeez/50 focus:outline-none transition-colors"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-gradient-to-r from-tahfeez to-tahfeez/80 px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-tahfeez/25 transition-all hover:shadow-tahfeez/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Create Account <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {!state?.success && (
            <div className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-gold hover:text-gold/80 transition-colors">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}