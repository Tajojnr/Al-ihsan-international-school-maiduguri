"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { GraduationCap, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div aria-hidden="true" className="absolute -top-60 -left-60 h-[500px] w-[500px] rounded-full bg-magenta/20 blur-[160px] pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-60 -right-60 h-[500px] w-[500px] rounded-full bg-signal/15 blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-magenta/20 border border-magenta/40 text-magenta mb-4">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
            Al-Ihsan International
          </h1>
          <p className="font-arabic text-sm text-gold mt-1">
            مَدْرَسَةُ الإِحْسَانِ الإِسْلَامِيَّةِ
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Applicant & Staff Portal
          </p>
        </div>

        <div className="glass-panel p-8 border-white/15">
          <h2 className="font-heading text-xl font-bold text-white">
            Welcome back
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to manage your applications and track admission progress.
          </p>

          <form action={formAction} className="mt-6 space-y-5">
            {state?.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
                {state.error}
              </div>
            )}

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
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-magenta focus:ring-1 focus:ring-magenta/50 focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-gold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:border-magenta focus:ring-1 focus:ring-magenta/50 focus:outline-none transition-colors"
                  placeholder="Enter your password"
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
              className="w-full rounded-xl bg-gradient-to-r from-magenta to-magenta/80 px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-magenta/25 transition-all hover:shadow-magenta/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-gold hover:text-gold/80 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}