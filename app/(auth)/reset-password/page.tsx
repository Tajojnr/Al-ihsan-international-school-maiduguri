"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/app/actions/auth";
import { GraduationCap, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div aria-hidden="true" className="absolute -top-60 -left-60 h-[500px] w-[500px] rounded-full bg-magenta/20 blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-magenta/20 border border-magenta/40 text-magenta mb-4">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
            Create New Password
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Please choose a strong password with at least 8 characters.
          </p>
        </div>

        <div className="glass-panel p-8 border-white/15">
          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
                {state.error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:border-magenta focus:ring-1 focus:ring-magenta/50 focus:outline-none transition-colors"
                  placeholder="At least 8 characters"
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
              className="w-full rounded-xl bg-magenta px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-magenta/25 transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? "Updating password..." : (
                <>
                  Set New Password & Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}