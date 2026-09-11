"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const SignUpSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(200),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LoginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const ForgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AuthState = {
  error?: string;
  success?: string;
};

export async function signupAction(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = SignUpSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: "Account created! Please check your email inbox to confirm your account.",
  };
}

export async function loginAction(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const redirectUrl = profile?.role === "admin" ? "/admin" : "/portal";

  revalidatePath("/", "layout");
  redirect(redirectUrl);
}

export async function forgotPasswordAction(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const rawData = {
    email: formData.get("email"),
  };

  const parsed = ForgotPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: "Password reset instructions have been sent to your email address.",
  };
}

export async function resetPasswordAction(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const rawData = {
    password: formData.get("password"),
  };

  const parsed = ResetPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Password%20successfully%20updated");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}