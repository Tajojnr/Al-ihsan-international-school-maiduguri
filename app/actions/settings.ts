"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") redirect("/portal");
  return { supabase, user };
}

export async function saveSiteSettingsAction(formData: FormData) {
  const { supabase } = await assertAdmin();

  const payload = {
    main_phone: formData.get("mainPhone")?.toString() || "",
    alt_phone: formData.get("altPhone")?.toString() || "",
    main_email: formData.get("mainEmail")?.toString() || "",
    main_address: formData.get("mainAddress")?.toString() || "",
    whatsapp: formData.get("whatsapp")?.toString() || "",
    facebook: formData.get("facebook")?.toString() || "",
    instagram: formData.get("instagram")?.toString() || "",
    twitter: formData.get("twitter")?.toString() || "",
    youtube: formData.get("youtube")?.toString() || "",
    tiktok: formData.get("tiktok")?.toString() || "",
    telegram: formData.get("telegram")?.toString() || "",
  };

  const { error } = await supabase
    .from("site_settings")
    .update(payload)
    .eq("id", true);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  revalidatePath("/contact");
  return { success: true };
}